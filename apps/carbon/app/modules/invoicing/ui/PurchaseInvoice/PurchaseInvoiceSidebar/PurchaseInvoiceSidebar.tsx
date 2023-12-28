import { useParams } from "@remix-run/react";
import { DetailSidebar } from "~/components/Layout";
import { useRouteData } from "~/hooks";
import type { PurchaseInvoiceLine } from "~/modules/invoicing";
import { path } from "~/utils/path";
import { usePurchaseInvoiceSidebar } from "./usePurchaseInvoiceSidebar";

const PurchaseInvoiceSidebar = () => {
  const { invoiceId } = useParams();

  if (!invoiceId)
    throw new Error(
      "PurchaseInvoiceSidebar requires an invoiceId and could not find invoiceId in params"
    );

  const routeData = useRouteData<{
    purchaseInvoiceLines: PurchaseInvoiceLine[];
  }>(path.to.purchaseInvoice(invoiceId));

  const links = usePurchaseInvoiceSidebar({
    lines: routeData?.purchaseInvoiceLines.length ?? 0,
  });

  return <DetailSidebar links={links} />;
};

export default PurchaseInvoiceSidebar;
