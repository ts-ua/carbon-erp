import { useParams } from "@remix-run/react";
import { BsBank, BsCreditCard, BsListCheck, BsTruck } from "react-icons/bs";
import {
  HiOutlineDocumentArrowDown,
  HiOutlineDocumentArrowUp,
} from "react-icons/hi2";
import { usePermissions } from "~/hooks";
import type { Role } from "~/types";
import { path } from "~/utils/path";

type Props = {
  lines?: number;
  externalDocuments?: number;
  internalDocuments?: number;
};

export function usePurchaseOrderSidebar({
  lines = 0,
  internalDocuments = 0,
  externalDocuments = 0,
}: Props) {
  const { orderId } = useParams();
  if (!orderId) throw new Error("orderId not found");

  const permissions = usePermissions();
  return [
    {
      name: "Summary",
      to: path.to.purchaseOrderDetails(orderId),
      icon: BsBank,
    },
    {
      name: "Lines",
      to: path.to.purchaseOrderLines(orderId),
      count: lines,
      icon: BsListCheck,
    },
    {
      name: "Delivery",
      to: path.to.purchaseOrderDelivery(orderId),
      role: ["employee", "supplier"],
      icon: BsTruck,
    },
    {
      name: "Payment",
      to: path.to.purchaseOrderPayment(orderId),
      role: ["employee"],
      icon: BsCreditCard,
    },
    {
      name: "Internal Documents",
      to: path.to.purchaseOrderInternalDocuments(orderId),
      role: ["employee"],
      count: internalDocuments,
      icon: HiOutlineDocumentArrowDown,
    },
    {
      name: "External Documents",
      to: path.to.purchaseOrderExternalDocuments(orderId),
      role: ["employee", "supplier"],
      count: externalDocuments,
      icon: HiOutlineDocumentArrowUp,
    },
  ].filter(
    (item) =>
      item.role === undefined ||
      item.role.some((role) => permissions.is(role as Role))
  );
}
