import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  getSupplierContact,
  purchaseOrderReleaseValidator,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { success } from "~/utils/result";

export async function action({ request, params, context }: ActionFunctionArgs) {
  assertIsPost(request);

  const { client } = await requirePermissions(request, {
    create: "purchasing",
    role: "employee",
  });

  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  const validation = await purchaseOrderReleaseValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { notification, buyerEmail, supplierContact } = validation.data;

  switch (notification) {
    case "Email":
      if (!supplierContact) throw new Error("Supplier contact is required");
      if (!buyerEmail) throw new Error("Buyer email is required");

      const contact = await getSupplierContact(client, supplierContact);
      const supplierEmail = contact.data?.contact?.email;

      if (!supplierEmail) throw new Error("Failed to get supplier contact");

      break;
    case "Download":
      return redirect(path.to.file.purchaseOrder(orderId));
    default:
      throw new Error("Invalid notification type");
  }
  // await triggerClient.sendEvent({
  //   name: "resend.email",
  //   payload: {
  //     to: ["bradbarbin@protonmail.com", "gravyfries@protonmail.com"],
  //     from: "bradbarbin@protonmail.com",
  //     subject: "Hello from the server",
  //     html: "<p>This is a replyable email from the <strong>server</strong></p>",
  //     attachments: [],
  //   },
  // });

  return redirect(
    path.to.purchaseOrder(orderId),
    await flash(request, success("Purchase order released"))
  );
}
