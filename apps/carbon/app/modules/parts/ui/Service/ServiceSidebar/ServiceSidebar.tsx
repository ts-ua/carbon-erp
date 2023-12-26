import { useColor, VStack } from "@carbon/react";
import { Button } from "@chakra-ui/react";
import { Link, useMatches, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type { Service } from "~/modules/parts/types";
import { path } from "~/utils/path";
import { useServiceSidebar } from "./useServiceSidebar";

const ServiceSidebar = () => {
  const { serviceId } = useParams();
  const borderColor = useColor("gray.200");
  if (!serviceId) throw new Error("serviceId not found");

  const routeData = useRouteData<{ service: Service }>(
    path.to.service(serviceId)
  );
  if (!routeData?.service?.serviceType)
    throw new Error("Could not find service type in routeData");

  const links = useServiceSidebar(routeData.service.serviceType);
  const matches = useMatches();

  return (
    <VStack className="h-full">
      <div className="overflow-y-auto h-full w-full">
        <VStack spacing={2}>
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
                  justifyContent="start"
                  size="md"
                  w="full"
                >
                  {route.name}
                </Button>
              );
            })}
          </VStack>
        </VStack>
      </div>
    </VStack>
  );
};

export default ServiceSidebar;
