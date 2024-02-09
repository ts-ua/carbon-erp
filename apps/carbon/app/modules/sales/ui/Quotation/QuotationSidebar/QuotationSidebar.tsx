import { useParams } from "@remix-run/react";
import { DetailSidebar } from "~/components/Layout";
import { useRouteData } from "~/hooks";
import type {
  Quotation,
  QuotationAttachment,
  QuotationLine,
} from "~/modules/sales";
import { path } from "~/utils/path";
import { useQuotationSidebar } from "./useQuotationSidebar";

const QuotationSidebar = () => {
  const { id } = useParams();

  if (!id)
    throw new Error(
      "QuotationSidebar requires an id and could not find id in params"
    );

  const routeData = useRouteData<{
    quotation: Quotation;
    quotationLines: QuotationLine[];
    internalDocuments: QuotationAttachment[];
    externalDocuments: QuotationAttachment[];
  }>(path.to.quote(id));

  const links = useQuotationSidebar({
    lines: routeData?.quotationLines.length ?? 0,
    internalDocuments: routeData?.internalDocuments.length ?? 0,
    externalDocuments: routeData?.externalDocuments.length ?? 0,
  });

  return <DetailSidebar links={links} />;
};

export default QuotationSidebar;
