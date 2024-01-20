import { CgSync } from "react-icons/cg";
import { GoNumber } from "react-icons/go";
import { TbBuildingFactory2 } from "react-icons/tb";
import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";
import { path } from "~/utils/path";

const settingsRoutes: AuthenticatedRouteGroup[] = [
  {
    name: "Company",
    routes: [
      {
        name: "Business",
        to: path.to.company,
        role: "employee",
        icon: <TbBuildingFactory2 />,
      },
    ],
  },
  {
    name: "System",
    routes: [
      {
        name: "Integrations",
        to: path.to.integrations,
        role: "employee",
        icon: <CgSync />,
      },
      {
        name: "Sequences",
        to: path.to.sequences,
        role: "employee",
        icon: <GoNumber />,
      },
    ],
  },
];

export default function usePurchasingSidebar() {
  const permissions = usePermissions();
  return {
    groups: settingsRoutes
      .filter((group) => {
        const filteredRoutes = group.routes.filter((route) => {
          if (route.role) {
            return permissions.is(route.role);
          } else {
            return true;
          }
        });

        return filteredRoutes.length > 0;
      })
      .map((group) => ({
        ...group,
        routes: group.routes.filter((route) => {
          if (route.role) {
            return permissions.is(route.role);
          } else {
            return true;
          }
        }),
      })),
  };
}
