import { Count, VStack, useColor } from "@carbon/react";
import { Button } from "@chakra-ui/react";
import { Link, useMatches, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type {
  SupplierContact,
  SupplierDetail,
  SupplierLocation,
} from "~/modules/purchasing";
import { path } from "~/utils/path";
import { useSupplierSidebar } from "./useSupplierSidebar";

const SupplierSidebar = () => {
  const { supplierId } = useParams();
  const borderColor = useColor("gray.200");
  if (!supplierId)
    throw new Error(
      "SupplierSidebar requires an supplierId and could not find supplierId in params"
    );

  const routeData = useRouteData<{
    purchaseOrder: SupplierDetail;
    contacts: SupplierContact[];
    locations: SupplierLocation[];
  }>(path.to.supplier(supplierId));

  const links = useSupplierSidebar({
    contacts: routeData?.contacts.length ?? 0,
    locations: routeData?.locations.length ?? 0,
  });
  const matches = useMatches();

  return (
    <VStack className="h-full">
      <div className="overflow-y-auto h-full w-full">
        <VStack>
          <VStack spacing={1}>
            {links.map((route) => {
              const isActive = matches.some(
                (match) =>
                  (match.pathname.includes(route.to) && route.to !== "") ||
                  (match.id.includes(".index") && route.to === "")
              );

              return (
                <Button
                  key={route.name}
                  as={Link}
                  to={route.to}
                  variant={isActive ? "solid" : "ghost"}
                  border={isActive ? "1px solid" : "none"}
                  borderColor={borderColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  justifyContent={
                    route.count === undefined ? "start" : "space-between"
                  }
                  size="md"
                  w="full"
                >
                  <span>{route.name}</span>
                  {route.count !== undefined && <Count count={route.count} />}
                </Button>
              );
            })}
          </VStack>
        </VStack>
      </div>
    </VStack>
  );
};

export default SupplierSidebar;
