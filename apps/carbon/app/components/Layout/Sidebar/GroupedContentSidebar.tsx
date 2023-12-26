import { VStack, useColor } from "@carbon/react";
import { Button, Text } from "@chakra-ui/react";
import { Link, useMatches } from "@remix-run/react";
import type { RouteGroup } from "~/types";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

const GroupedContentSidebar = ({ groups }: { groups: RouteGroup[] }) => {
  const matches = useMatches();
  const labelColor = useColor("gray.400");

  return (
    <CollapsibleSidebar>
      <div className="overflow-y-auto h-full w-full pb-8">
        <VStack spacing={2}>
          {groups.map((group) => (
            <VStack key={group.name} spacing={1} className="border-b p-2">
              <Text
                color={labelColor}
                fontSize="xs"
                fontWeight="bold"
                pl={3}
                py={1}
                textTransform="uppercase"
              >
                {group.name}
              </Text>
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
