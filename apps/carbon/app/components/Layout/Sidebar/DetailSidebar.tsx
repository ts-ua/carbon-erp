import { Count, VStack } from "@carbon/react";
import { Button } from "@chakra-ui/react";
import { Link, useMatches } from "@remix-run/react";
import type { IconType } from "react-icons";

type DetailSidebarProps = {
  links: {
    name: string;
    to: string;
    icon?: IconType;
    count?: number;
  }[];
};

const DetailSidebar = ({ links }: DetailSidebarProps) => {
  const matches = useMatches();

  return (
    <VStack className="overflow-y-auto h-full" spacing={1}>
      {links.map((route) => {
        const isActive = matches.some(
          (match) =>
            (match.pathname.includes(route.to) && route.to !== "") ||
            (match.id.includes(".index") && route.to === "")
        );

        return (
          <Button
            key={route.name}
            className="border-border"
            as={Link}
            to={route.to}
            colorScheme={isActive ? "brand" : "gray"}
            variant={isActive ? "solid" : "ghost"}
            border={isActive ? "1px solid" : "none"}
            fontWeight={isActive ? "bold" : "normal"}
            justifyContent="space-between"
            size="md"
            w="full"
          >
            <span>{route.name}</span>
            {route.count !== undefined && <Count count={route.count} />}
          </Button>
        );
      })}
    </VStack>
  );
};

export default DetailSidebar;
