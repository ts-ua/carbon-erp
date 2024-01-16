import { BiListCheck } from "react-icons/bi";
import { BsBank, BsBarChartLineFill, BsCartDash } from "react-icons/bs";
import { HiOutlineCube } from "react-icons/hi";
import { IoPricetagsOutline } from "react-icons/io5";
import { PiMoneyFill, PiShareNetworkFill } from "react-icons/pi";
import { usePermissions } from "~/hooks";
import type { PartReplenishmentSystem } from "~/modules/parts/types";
import type { Role } from "~/types";

export function usePartSidebar(replenishment: PartReplenishmentSystem) {
  const permissions = usePermissions();
  return [
    {
      name: "Details",
      to: "",
      icon: BsBank,
    },
    {
      name: "Purchasing",
      to: "purchasing",
      isDisabled: replenishment === "Make",
      role: ["employee", "supplier"],
      icon: BsCartDash,
    },
    {
      name: "Suppliers",
      to: "suppliers",
      isDisabled: replenishment === "Make",
      role: ["employee", "supplier"],
      icon: PiShareNetworkFill,
    },
    {
      name: "Manufacturing",
      to: "manufacturing",
      isDisabled: replenishment === "Buy",
      role: ["employee"],
      icon: BiListCheck,
    },
    {
      name: "Costing",
      to: "costing",
      role: ["employee", "supplier"],
      icon: IoPricetagsOutline,
    },
    {
      name: "Planning",
      to: "planning",
      role: ["employee"],
      icon: BsBarChartLineFill,
    },
    {
      name: "Inventory",
      to: "inventory",
      role: ["employee", "supplier"],
      icon: HiOutlineCube,
    },
    {
      name: "Sale Price",
      to: "sale-price",
      role: ["employee", "customer"],
      icon: PiMoneyFill,
    },
  ].filter(
    (item) =>
      !item.isDisabled &&
      (item.role === undefined ||
        item.role.some((role) => permissions.is(role as Role)))
  );
}
