import {
  Button,
  Card,
  CardAction,
  CardAttribute,
  CardAttributeLabel,
  CardAttributeValue,
  CardAttributes,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Menubar,
  MenubarItem,
  VStack,
  useDisclosure,
} from "@carbon/react";
import { useParams } from "@remix-run/react";
import { useMemo } from "react";
import { FaHistory } from "react-icons/fa";
import { usePermissions, useRouteData } from "~/hooks";
import type { PurchaseOrder } from "~/modules/purchasing";
import { PurchasingStatus, usePurchaseOrderTotals } from "~/modules/purchasing";
import { path } from "~/utils/path";
import { usePurchaseOrder } from "../PurchaseOrders/usePurchaseOrder";
import PurchaseOrderReleaseModal from "./PurchaseOrderReleaseModal";

const PurchaseOrderHeader = () => {
  const permissions = usePermissions();
  const { orderId } = useParams();
  if (!orderId) throw new Error("Could not find orderId");

  const routeData = useRouteData<{ purchaseOrder: PurchaseOrder }>(
    path.to.purchaseOrder(orderId)
  );

  if (!routeData?.purchaseOrder) throw new Error("purchaseOrder not found");
  const isReleased = !["Draft", "Approved"].includes(
    routeData?.purchaseOrder?.status ?? ""
  );

  const [purchaseOrderTotals] = usePurchaseOrderTotals();

  // TODO: factor in default currency, po currency and exchange rate
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  const { receive, invoice } = usePurchaseOrder();
  const releaseDisclosure = useDisclosure();

  return (
    <>
      <VStack>
        {permissions.is("employee") && (
          <Menubar>
            <MenubarItem asChild>
              <a
                target="_blank"
                href={path.to.file.purchaseOrder(orderId)}
                rel="noreferrer"
              >
                Preview
              </a>
            </MenubarItem>

            <MenubarItem
              onClick={releaseDisclosure.onOpen}
              isDisabled={isReleased}
            >
              Release
            </MenubarItem>
            <MenubarItem
              onClick={() => {
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

        <Card>
          <HStack className="justify-between items-start">
            <CardHeader>
              <CardTitle>{routeData?.purchaseOrder?.purchaseOrderId}</CardTitle>
              <CardDescription>
                {routeData?.purchaseOrder?.supplierName}
              </CardDescription>
            </CardHeader>
            <CardAction>
              <Button
                variant="secondary"
                onClick={() => alert("TODO")}
                leftIcon={<FaHistory />}
              >
                Supplier Details
              </Button>
            </CardAction>
          </HStack>
          <CardContent>
            <CardAttributes>
              <CardAttribute>
                <CardAttributeLabel>Total</CardAttributeLabel>
                <CardAttributeValue>
                  {formatter.format(purchaseOrderTotals?.total ?? 0)}
                </CardAttributeValue>
              </CardAttribute>
              <CardAttribute>
                <CardAttributeLabel>Order Date</CardAttributeLabel>
                <CardAttributeValue>
                  {routeData?.purchaseOrder?.orderDate}
                </CardAttributeValue>
              </CardAttribute>

              <CardAttribute>
                <CardAttributeLabel>Promised Date</CardAttributeLabel>
                <CardAttributeValue>
                  {routeData?.purchaseOrder?.receiptPromisedDate}
                </CardAttributeValue>
              </CardAttribute>
              <CardAttribute>
                <CardAttributeLabel>Type</CardAttributeLabel>
                <CardAttributeValue>
                  {routeData?.purchaseOrder?.type}
                </CardAttributeValue>
              </CardAttribute>

              <CardAttribute>
                <CardAttributeLabel>Status</CardAttributeLabel>
                <PurchasingStatus status={routeData?.purchaseOrder?.status} />
              </CardAttribute>
            </CardAttributes>
          </CardContent>
        </Card>
      </VStack>
      {releaseDisclosure.isOpen && (
        <PurchaseOrderReleaseModal
          purchaseOrder={routeData?.purchaseOrder}
          onClose={releaseDisclosure.onClose}
        />
      )}
    </>
  );
};

export default PurchaseOrderHeader;
