import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getPurchaseInvoiceLines } from "~/modules/invoicing";
import { PostingQueueType, postingQueue } from "~/queues";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    update: "inventory",
  });

  const { invoiceId } = params;
  if (!invoiceId) throw new Error("invoiceId not found");

  const purchaseInvoiceLines = await getPurchaseInvoiceLines(client, invoiceId);
  if (purchaseInvoiceLines.error) {
    return redirect(
      path.to.purchaseInvoiceDetails(invoiceId),
      await flash(request, error(purchaseInvoiceLines.error))
    );
  }

  return json({ purchaseInvoiceLines: purchaseInvoiceLines.data ?? [] });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    update: "invoicing",
  });

  const { invoiceId } = params;
  if (!invoiceId) throw new Error("invoiceId not found");

  const setPendingState = await client
    .from("purchaseInvoice")
    .update({
      status: "Pending",
    })
    .eq("id", invoiceId);

  if (setPendingState.error) {
    return redirect(
      path.to.purchaseInvoices,
      await flash(
        request,
        error(setPendingState.error, "Failed to post purchase invoice")
      )
    );
  }

  postingQueue.add(`posting invoice ${invoiceId}`, {
    type: PostingQueueType.PurchaseInvoice,
    documentId: invoiceId,
  });

  return redirect(path.to.purchaseInvoices);
}
