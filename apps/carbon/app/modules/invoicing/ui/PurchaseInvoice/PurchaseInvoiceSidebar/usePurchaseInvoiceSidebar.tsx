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
    },
    {
      name: "Lines",
      to: "lines",
      count: lines,
    },
    {
      name: "Payment",
      to: "payment",
      role: ["employee"],
    },
  ].filter(
    (item) =>
      item.role === undefined ||
      item.role.some((role) => permissions.is(role as Role))
  );
}
