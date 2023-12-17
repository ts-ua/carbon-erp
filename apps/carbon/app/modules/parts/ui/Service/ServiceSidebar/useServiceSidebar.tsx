import { usePermissions } from "~/hooks";
import type { ServiceType } from "~/modules/parts/types";
import type { Role } from "~/types";

export function useServiceSidebar(type: ServiceType) {
  const permissions = usePermissions();
  return [
    {
      name: "Details",
      to: "",
    },
    {
      name: "Suppliers",
      to: "suppliers",
      isDisabled: type === "Internal",
      role: ["employee", "supplier"],
    },
  ].filter(
    (item) =>
      !item.isDisabled &&
      (item.role === undefined ||
        item.role.some((role) => permissions.is(role as Role)))
  );
}
