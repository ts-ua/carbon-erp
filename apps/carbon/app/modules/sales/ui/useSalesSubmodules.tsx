import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";
import { path } from "~/utils/path";

const salesRoutes: AuthenticatedRouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Customers",
        to: path.to.customers,
      },
      {
        name: "Quotations",
        to: path.to.quotes,
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Customer Types",
        to: path.to.customerTypes,
        role: "employee",
      },
    ],
  },
];

export default function useSalesSubmodules() {
  const permissions = usePermissions();
  return {
    groups: salesRoutes
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
