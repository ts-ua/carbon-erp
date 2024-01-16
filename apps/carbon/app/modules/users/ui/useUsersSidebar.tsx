import { BsPeopleFill, BsPersonBadge } from "react-icons/bs";
import { GrGroup } from "react-icons/gr";
import { IoGitPullRequestOutline } from "react-icons/io5";
import { PiShareNetworkFill } from "react-icons/pi";
import type { RouteGroup } from "~/types";
import { path } from "~/utils/path";

const usersRoutes: RouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Employees",
        to: path.to.employeeAccounts,
        icon: <BsPeopleFill />,
      },
      {
        name: "Customers",
        to: path.to.customerAccounts,
        icon: <IoGitPullRequestOutline />,
      },
      {
        name: "Suppliers",
        to: path.to.supplierAccounts,
        icon: <PiShareNetworkFill />,
      },
      {
        name: "Groups",
        to: path.to.groups,
        icon: <GrGroup />,
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Employee Types",
        to: path.to.employeeTypes,
        icon: <BsPersonBadge />,
      },
    ],
  },
];

export default function useUsersSidebar() {
  return { groups: usersRoutes };
}
