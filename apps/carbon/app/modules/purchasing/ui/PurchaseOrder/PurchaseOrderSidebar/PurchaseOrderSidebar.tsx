import { Count, VStack, useColor } from "@carbon/react";
import { Button } from "@chakra-ui/react";
import { Link, useMatches, useParams } from "@remix-run/react";
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
  const borderColor = useColor("gray.200");
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
  const matches = useMatches();

  return (
    <VStack className="h-full">
      <div className="overflow-y-auto h-full w-full">
        <VStack spacing={2}>
          <VStack spacing={1}>
            {links.map((route) => {
              const isActive = matches.some(
                (match) =>
                  (match.pathname.includes(route.to) && route.to !== "") ||
                  (match.id.includes(".index") && route.to === "")
              );

              return (
                <Button
                  key={route.name}
                  as={Link}
                  to={route.to}
                  variant={isActive ? "solid" : "ghost"}
                  border={isActive ? "1px solid" : "none"}
                  borderColor={borderColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  justifyContent={
                    route.count === undefined ? "start" : "space-between"
                  }
                  size="md"
                  w="full"
                >
                  <span>{route.name}</span>
                  {route.count !== undefined && <Count count={route.count} />}
                </Button>
              );
            })}
          </VStack>
        </VStack>
      </div>
    </VStack>
  );
};

export default PurchaseOrderSidebar;
