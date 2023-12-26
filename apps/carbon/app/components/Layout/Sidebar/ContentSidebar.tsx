import { VStack } from "@carbon/react";
import { Button } from "@chakra-ui/react";
import { Link, useMatches } from "@remix-run/react";
import { useUrlParams } from "~/hooks";
import type { Route } from "~/types";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

const ContentSidebar = ({ links }: { links: Route[] }) => {
  const matches = useMatches();
  const [params] = useUrlParams();
  const filter = params.get("q") ?? undefined;

  return (
    <CollapsibleSidebar>
      <div className="overflow-y-auto h-full w-full pb-8">
        <VStack spacing={2}>
          <VStack spacing={1} className="border-b p-2">
            {links.map((route) => {
              const isActive = matches.some(
                (match) =>
                  match.pathname.includes(route.to) && route.q === filter
              );
              return (
                <Button
                  key={route.name}
                  as={Link}
                  to={route.to + (route.q ? `?q=${route.q}` : "")}
                  leftIcon={route.icon}
                  variant={isActive ? "solid" : "ghost"}
                  border="none"
                  fontWeight={isActive ? "bold" : "normal"}
                  justifyContent="start"
                  w="full"
                >
                  {route.name}
                </Button>
              );
            })}
          </VStack>
        </VStack>
      </div>
    </CollapsibleSidebar>
  );
};

export default ContentSidebar;
