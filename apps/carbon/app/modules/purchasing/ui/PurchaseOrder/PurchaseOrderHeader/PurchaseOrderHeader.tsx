import { Heading, HStack, Menubar, MenubarItem, VStack } from "@carbon/react";
import { Button, Card, CardBody, CardHeader, Stack } from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { useMemo } from "react";
import { FaHistory } from "react-icons/fa";
import { usePermissions, useRouteData } from "~/hooks";
import type { PurchaseOrder } from "~/modules/purchasing";
import { PurchasingStatus, usePurchaseOrderTotals } from "~/modules/purchasing";
import { path } from "~/utils/path";
import { usePurchaseOrder } from "../../PurchaseOrders/usePurchaseOrder";

const PurchaseOrderHeader = () => {
  const permissions = usePermissions();
  const { orderId } = useParams();
  if (!orderId) throw new Error("Could not find orderId");

  const routeData = useRouteData<{ purchaseOrder: PurchaseOrder }>(
    path.to.purchaseOrder(orderId)
  );

  const [purchaseOrderTotals] = usePurchaseOrderTotals();

  // TODO: factor in default currency, po currency and exchange rate
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  const { receive, release, invoice } = usePurchaseOrder();

  return (
    <VStack>
      {permissions.is("employee") && (
        <Menubar>
          <MenubarItem
            onClick={() => {
              if (!routeData?.purchaseOrder)
                throw new Error("purchaseOrder not found");
              release(routeData.purchaseOrder);
            }}
            isDisabled={
              !["Draft", "Approved"].includes(
                routeData?.purchaseOrder?.status ?? ""
              )
            }
          >
            Release
          </MenubarItem>
          <MenubarItem
            onClick={() => {
              if (!routeData?.purchaseOrder)
                throw new Error("purchaseOrder not found");
              receive(routeData.purchaseOrder);
            }}
            isDisabled={
              routeData?.purchaseOrder?.status !== "To Receive" &&
              routeData?.purchaseOrder?.status !== "To Receive and Invoice"
            }
          >
            Receive
          </MenubarItem>
          <MenubarItem
            onClick={() => {
              if (!routeData?.purchaseOrder)
                throw new Error("purchaseOrder not found");
              invoice(routeData.purchaseOrder);
            }}
            isDisabled={
              routeData?.purchaseOrder?.status !== "To Invoice" &&
              routeData?.purchaseOrder?.status !== "To Receive and Invoice"
            }
          >
            Invoice
          </MenubarItem>
        </Menubar>
      )}

      <Card w="full">
        <CardHeader>
          <HStack className="justify-between items-start">
            <Stack direction="column" spacing={2}>
              <Heading size="h3">
                {routeData?.purchaseOrder?.purchaseOrderId}
              </Heading>
              <span className="text-muted-foreground">
                {routeData?.purchaseOrder?.supplierName}
              </span>
            </Stack>
            <Button onClick={() => alert("TODO")} leftIcon={<FaHistory />}>
              Supplier Details
            </Button>
          </HStack>
        </CardHeader>
        <CardBody>
          <Stack direction={["column", "column", "row"]} spacing={8}>
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">
                {formatter.format(purchaseOrderTotals?.total ?? 0)}
              </span>
            </Stack>
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <span className="text-muted-foreground">Order Date</span>
              <span className="font-bold">
                {routeData?.purchaseOrder?.orderDate}
              </span>
            </Stack>

            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <span className="text-muted-foreground">Promised Date</span>
              <span className="font-bold">
                {routeData?.purchaseOrder?.receiptPromisedDate}
              </span>
            </Stack>
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <span className="text-muted-foreground">Type</span>
              <span className="font-bold">
                {routeData?.purchaseOrder?.type}
              </span>
            </Stack>
            {/* 
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold">
                // TODO: this doesn't update when client-side lines are updated
                {currencyFormatter.format(
                  routeData?.purchaseOrder?.subtotal ?? 0
                )}
              </span>
            </Stack> 
            */}
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <span className="text-muted-foreground">Status</span>
              <PurchasingStatus status={routeData?.purchaseOrder?.status} />
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default PurchaseOrderHeader;
