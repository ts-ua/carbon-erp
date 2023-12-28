import { useParams } from "@remix-run/react";
import { DetailSidebar } from "~/components/Layout";
import { useRouteData } from "~/hooks";
import type {
  PurchaseOrder,
  PurchaseOrderAttachment,
  PurchaseOrderLine,
} from "~/modules/purchasing";
import { path } from "~/utils/path";
import { usePurchaseOrderSidebar } from "./usePurchaseOrderSidebar";

const PurchaseOrderSidebar = () => {
  const { orderId } = useParams();

  if (!orderId)
    throw new Error(
      "PurchaseOrderSidebar requires an orderId and could not find orderId in params"
    );

  const routeData = useRouteData<{
    purchaseOrder: PurchaseOrder;
    purchaseOrderLines: PurchaseOrderLine[];
    internalDocuments: PurchaseOrderAttachment[];
    externalDocuments: PurchaseOrderAttachment[];
  }>(path.to.purchaseOrder(orderId));

  const links = usePurchaseOrderSidebar({
    lines: routeData?.purchaseOrderLines.length ?? 0,
    internalDocuments: routeData?.internalDocuments.length ?? 0,
    externalDocuments: routeData?.externalDocuments.length ?? 0,
  });

  return <DetailSidebar links={links} />;
};

export default PurchaseOrderSidebar;
