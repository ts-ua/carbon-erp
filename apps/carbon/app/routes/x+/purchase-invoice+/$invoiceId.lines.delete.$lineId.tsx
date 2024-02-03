import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import {
  deletePurchaseInvoiceLine,
  getPurchaseInvoiceLine,
} from "~/modules/invoicing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "invoicing",
  });
  const { lineId, invoiceId } = params;
  if (!lineId) throw notFound("lineId not found");
  if (!invoiceId) throw notFound("invoiceId not found");

  const purchaseInvoiceLine = await getPurchaseInvoiceLine(client, lineId);
  if (purchaseInvoiceLine.error) {
    return redirect(
      path.to.purchaseInvoiceLines(invoiceId),
      await flash(
        request,
        error(purchaseInvoiceLine.error, "Failed to get purchase invoice line")
      )
    );
  }

  return json({ purchaseInvoiceLine: purchaseInvoiceLine.data });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "invoicing",
  });

  const { lineId, invoiceId } = params;
  if (!lineId) throw notFound("Could not find lineId");
  if (!invoiceId) throw notFound("Could not find invoiceId");

  const { error: deleteTypeError } = await deletePurchaseInvoiceLine(
    client,
    lineId
  );
  if (deleteTypeError) {
    return redirect(
      path.to.purchaseInvoiceLines(invoiceId),
      await flash(
        request,
        error(deleteTypeError, "Failed to delete purchase invoice line")
      )
    );
  }

  return redirect(
    path.to.purchaseInvoiceLines(invoiceId),
    await flash(request, success("Successfully deleted purchase invoice line"))
  );
}

export default function DeletePurchaseInvoiceLineRoute() {
  const { lineId, invoiceId } = useParams();
  const { purchaseInvoiceLine } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!purchaseInvoiceLine) return null;
  if (!lineId) throw notFound("Could not find lineId");
  if (!invoiceId) throw notFound("Could not find invoiceId");

  const onCancel = () => navigate(path.to.purchaseInvoiceLines(invoiceId));

  return (
    <ConfirmDelete
      action={path.to.deletePurchaseInvoiceLine(invoiceId, lineId)}
      name="Purchase Invoice Line"
      text={`Are you sure you want to delete the purchase invoice line for ${
        purchaseInvoiceLine.quantity ?? 0
      } ${purchaseInvoiceLine.description ?? ""}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
