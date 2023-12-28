import { BsBank } from "react-icons/bs";
import { PiShareNetworkFill } from "react-icons/pi";
import { usePermissions } from "~/hooks";
import type { ServiceType } from "~/modules/parts/types";
import type { Role } from "~/types";

export function useServiceSidebar(type: ServiceType) {
  const permissions = usePermissions();
  return [
    {
      name: "Details",
      to: "",
      icon: BsBank,
    },
    {
      name: "Suppliers",
      to: "suppliers",
      isDisabled: type === "Internal",
      role: ["employee", "supplier"],
      icon: PiShareNetworkFill,
    },
  ].filter(
    (item) =>
      !item.isDisabled &&
      (item.role === undefined ||
        item.role.some((role) => permissions.is(role as Role)))
  );
}
