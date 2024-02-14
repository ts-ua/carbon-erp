import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  QuotationLineForm,
  getQuoteLine,
  quotationLineValidator,
  upsertQuoteLine,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
    role: "employee",
  });

  const { lineId } = params;
  if (!lineId) throw notFound("lineId not found");

  const quotationLine = await getQuoteLine(client, lineId);

  return json({
    quotationLine: quotationLine?.data ?? null,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const { id: quoteId, lineId } = params;
  if (!quoteId) throw new Error("Could not find id");
  if (!lineId) throw new Error("Could not find lineId");

  const validation = await quotationLineValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const updateQuotationLine = await upsertQuoteLine(client, {
    id: lineId,
    ...data,
    updatedBy: userId,
  });

  if (updateQuotationLine.error) {
    return redirect(
      path.to.quoteLines(quoteId),
      await flash(
        request,
        error(updateQuotationLine.error, "Failed to update quote line")
      )
    );
  }

  return redirect(path.to.quoteLines(quoteId));
}

export default function EditQuotationLineRoute() {
  const { quotationLine } = useLoaderData<typeof loader>();

  const initialValues = {
    id: quotationLine?.id ?? undefined,
    quoteId: quotationLine?.quoteId ?? "",

    partId: quotationLine?.partId ?? "",
    customerPartId: quotationLine?.customerPartId ?? "",
    description: quotationLine?.description ?? "",
    quantity: quotationLine?.quantity ?? 1,
    unitCost: quotationLine?.unitCost ?? 0,
    unitPrice: quotationLine?.unitPrice ?? 0,
    leadTime: quotationLine?.leadTime ?? undefined,
  };

  return <QuotationLineForm initialValues={initialValues} />;
}
