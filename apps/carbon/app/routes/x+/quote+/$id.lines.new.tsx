import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  QuotationLineForm,
  quotationLineValidator,
  upsertQuoteLine,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "sales",
  });

  const { id: quoteId } = params;
  if (!quoteId) throw new Error("Could not find id");

  const validation = await quotationLineValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createQuotationLine = await upsertQuoteLine(client, {
    ...data,
    createdBy: userId,
  });

  console.log({ createQuotationLine });

  if (createQuotationLine.error) {
    return redirect(
      path.to.quoteLines(quoteId),
      await flash(
        request,
        error(createQuotationLine.error, "Failed to create quote line.")
      )
    );
  }

  return redirect(path.to.quoteLines(quoteId));
}

export default function NewQuotationLineRoute() {
  const { id } = useParams();

  if (!id) throw new Error("Could not find quote id");

  const initialValues = {
    quoteId: id,
    partId: "",
    description: "",
    quantity: 1,
    unitCost: 0,
    unitPrice: 0,
  };

  return <QuotationLineForm initialValues={initialValues} />;
}
