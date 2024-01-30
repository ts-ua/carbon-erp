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
import { loader as pdfLoader } from "~/routes/file+/purchase-order+/$orderId[.]pdf";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action(args: ActionFunctionArgs) {
  const { request, params } = args;
  assertIsPost(request);

  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
    role: "employee",
  });

  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  let file: ArrayBuffer;
  let bucketName = orderId;
  let fileName: string;

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

  const purchaseOrder = await getPurchaseOrder(client, orderId);
  if (purchaseOrder.error) {
    return redirect(
      path.to.purchaseOrder(orderId),
      await flash(
        request,
        error(purchaseOrder.error, "Failed to get purchase order")
      )
    );
  }

  try {
    const pdf = await pdfLoader(args);
    if (pdf.headers.get("content-type") !== "application/pdf")
      throw new Error("Failed to generate PDF");

    file = await pdf.arrayBuffer();
    fileName = `${purchaseOrder.data.purchaseOrderId} - ${new Date()
      .toISOString()
      .slice(0, -5)}.pdf`;

    const fileUpload = await client.storage
      .from("purchasing-external")
      .upload(`${bucketName}/${fileName}`, file, {
        cacheControl: `${12 * 60 * 60}`,
        contentType: "application/pdf",
      });

    if (fileUpload.error) {
      return redirect(
        path.to.purchaseOrder(orderId),
        await flash(request, error(fileUpload.error, "Failed to upload file"))
      );
    }
  } catch (err) {
    return redirect(
      path.to.purchaseOrder(orderId),
      await flash(request, error(err, "Failed to generate PDF"))
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

        const [company, contact, user] = await Promise.all([
          getCompany(client),
          getSupplierContact(client, supplierContact),
          getUser(client, userId),
        ]);

        if (!contact?.data?.contact)
          throw new Error("Failed to get supplier contact");
        if (!company.data) throw new Error("Failed to get company");
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
            attachments: [
              {
                content: Buffer.from(file),
                filename: fileName,
              },
            ],
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
