import { useParams } from "@remix-run/react";
import { useUrlParams } from "~/hooks";
import QuotationAssemblyForm from "~/modules/sales/ui/Quotation/QuotationAssemblyForm";

export default function NewQuoteAssembly() {
  const { id: quoteId, lineId } = useParams();
  const [params] = useUrlParams();
  const parentAssemblyId = params.get("parentAssemblyId");

  if (!quoteId) throw new Error("quoteId not found");
  if (!lineId) throw new Error("lineId not found");

  const initialValues = {
    quoteId,
    quoteLineId: lineId,
    parentAssemblyId: parentAssemblyId ?? undefined,
    partId: "",
    description: "",
    quantityPerParent: 1,
  };

  return <QuotationAssemblyForm initialValues={initialValues} />;
}
