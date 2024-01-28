import { PurchaseOrderEmail } from "@carbon/documents";
import { renderAsync } from "@react-email/components";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { triggerClient } from "~/lib/trigger.server";
import {
  getPurchaseOrder,
  getSupplierContact,
  purchaseOrderReleaseValidator,
  releasePurchaseOrder,
} from "~/modules/purchasing";
import { getCompany } from "~/modules/settings";
import { getUser } from "~/modules/users/users.server";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);

  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
    role: "employee",
  });

  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  const release = await releasePurchaseOrder(client, orderId, userId);
  if (release.error) {
    return redirect(
      path.to.purchaseOrder(orderId),
      await flash(
        request,
        error(release.error, "Failed to release purchase order")
      )
    );
  }

  const validation = await purchaseOrderReleaseValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { notification, supplierContact } = validation.data;

  switch (notification) {
    case "Email":
      try {
        if (!supplierContact) throw new Error("Supplier contact is required");

        const [company, contact, purchaseOrder, user] = await Promise.all([
          getCompany(client),
          getSupplierContact(client, supplierContact),
          getPurchaseOrder(client, orderId),
          getUser(client, userId),
        ]);

        if (!contact?.data?.contact)
          throw new Error("Failed to get supplier contact");
        if (!company.data) throw new Error("Failed to get company");
        if (!purchaseOrder.data)
          throw new Error("Failed to get purchase order");
        if (!user.data) throw new Error("Failed to get user");

        const supplierEmail = contact.data.contact.email;
        const supplierName = `${contact.data.contact.firstName} ${contact.data.contact.lastName}`;

        const buyerEmail = user.data.email;
        const buyerName = `${user.data.firstName} ${user.data.lastName}`;

        const emailTemplate = PurchaseOrderEmail({
          company: company.data,
          purchaseOrder: { id: purchaseOrder.data.purchaseOrderId! },
          recipient: { email: supplierEmail, name: supplierName },
          sender: { email: buyerEmail, name: buyerName },
        });

        await triggerClient.sendEvent({
          name: "resend.email",
          payload: {
            to: [buyerEmail, supplierEmail],
            from: buyerEmail,
            subject: `New Purchase Order from ${company.data.name}`,
            html: await renderAsync(emailTemplate),
            text: await renderAsync(emailTemplate, { plainText: true }),
            attachments: [],
          },
        });
      } catch (err) {
        return redirect(
          path.to.purchaseOrder(orderId),
          await flash(request, error(err, "Failed to send email"))
        );
      }

      break;
    case undefined:
    case "None":
      break;
    default:
      throw new Error("Invalid notification type");
  }

  return redirect(
    path.to.purchaseOrderExternalDocuments(orderId),
    await flash(request, success("Purchase order released"))
  );
}
