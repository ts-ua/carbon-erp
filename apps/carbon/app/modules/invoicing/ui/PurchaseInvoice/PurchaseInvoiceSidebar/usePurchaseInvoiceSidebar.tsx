import { BsBank, BsCreditCard, BsListCheck } from "react-icons/bs";
import { usePermissions } from "~/hooks";
import type { Role } from "~/types";

type Props = {
  lines?: number;
};

export function usePurchaseInvoiceSidebar({ lines = 0 }: Props) {
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
      name: "Payment",
      to: "payment",
      role: ["employee"],
      icon: BsCreditCard,
    },
  ].filter(
    (item) =>
      item.role === undefined ||
      item.role.some((role) => permissions.is(role as Role))
  );
}
