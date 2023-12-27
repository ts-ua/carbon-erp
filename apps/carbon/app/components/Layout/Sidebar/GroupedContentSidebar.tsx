import { VStack } from "@carbon/react";
import { Button } from "@chakra-ui/react";
import { Link, useMatches } from "@remix-run/react";
import type { RouteGroup } from "~/types";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

const GroupedContentSidebar = ({ groups }: { groups: RouteGroup[] }) => {
  const matches = useMatches();

  return (
    <CollapsibleSidebar>
      <div className="overflow-y-auto h-full w-full pb-8">
        <VStack>
          {groups.map((group) => (
            <VStack
              key={group.name}
              spacing={1}
              className="border-b border-border p-2"
            >
              <p className="text-xs text-muted-foreground font-bold pl-3 py-1 uppercase">
                {group.name}
              </p>
              {group.routes.map((route) => {
                const isActive = matches.some((match) =>
                  match.pathname.includes(route.to)
                );
                return (
                  <Button
                    key={route.name}
                    as={Link}
                    to={route.to}
                    variant={isActive ? "solid" : "ghost"}
                    border="none"
                    fontWeight={isActive ? "bold" : "normal"}
                    leftIcon={route.icon}
                    justifyContent="start"
                    w="full"
                  >
                    {route.name}
                  </Button>
                );
              })}
            </VStack>
          ))}
        </VStack>
      </div>
    </CollapsibleSidebar>
  );
};

export default GroupedContentSidebar;
