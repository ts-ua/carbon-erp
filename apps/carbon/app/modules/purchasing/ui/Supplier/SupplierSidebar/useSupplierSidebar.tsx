import {
  BsBank,
  BsCreditCard,
  BsFillPersonLinesFill,
  BsFillPinMapFill,
  BsTruck,
} from "react-icons/bs";
import { usePermissions } from "~/hooks";
import type { Role } from "~/types";

type Props = {
  contacts: number;
  locations: number;
};

export function useSupplierSidebar({ contacts, locations }: Props) {
  const permissions = usePermissions();
  return [
    {
      name: "Overview",
      to: "",
      icon: BsBank,
    },
    {
      name: "Contacts",
      to: "contacts",
      role: ["employee"],
      count: contacts,
      icon: BsFillPersonLinesFill,
    },
    {
      name: "Locations",
      to: "locations",
      role: ["employee", "supplier"],
      count: locations,
      icon: BsFillPinMapFill,
    },
    {
      name: "Payments",
      to: "payments",
      role: ["employee"],
      icon: BsCreditCard,
    },
    {
      name: "Shipping",
      to: "shipping",
      role: ["employee"],
      icon: BsTruck,
    },
  ].filter(
    (item) =>
      item.role === undefined ||
      item.role.some((role) => permissions.is(role as Role))
  );
}
