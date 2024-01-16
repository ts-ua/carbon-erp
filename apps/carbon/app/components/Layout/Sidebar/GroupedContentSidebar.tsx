import { Button, VStack } from "@carbon/react";
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
              <h4 className="text-xs text-muted-foreground font-bold pl-4 py-1 uppercase">
                {group.name}
              </h4>
              {group.routes.map((route) => {
                const isActive = matches.some((match) =>
                  match.pathname.includes(route.to)
                );
                return (
                  <Button
                    key={route.name}
                    asChild
                    leftIcon={route.icon}
                    variant={isActive ? "solid" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Link to={route.to + (route.q ? `?q=${route.q}` : "")}>
                      {route.name}
                    </Link>
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
