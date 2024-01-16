import { BsBank, BsCreditCard, BsListCheck, BsTruck } from "react-icons/bs";
import {
  HiOutlineDocumentArrowDown,
  HiOutlineDocumentArrowUp,
} from "react-icons/hi2";
import { usePermissions } from "~/hooks";
import type { Role } from "~/types";

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
  const permissions = usePermissions();
  return [
    {
      name: "Summary",
      to: "details",
      icon: BsBank,
    },
    {
      name: "Lines",
      to: "lines",
      count: lines,
      icon: BsListCheck,
    },
    {
      name: "Delivery",
      to: "delivery",
      role: ["employee", "supplier"],
      icon: BsTruck,
    },
    {
      name: "Payment",
      to: "payment",
      role: ["employee"],
      icon: BsCreditCard,
    },
    {
      name: "Internal Attachments",
      to: "internal",
      role: ["employee"],
      count: internalDocuments,
      icon: HiOutlineDocumentArrowDown,
    },
    {
      name: "External Attachments",
      to: "external",
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
