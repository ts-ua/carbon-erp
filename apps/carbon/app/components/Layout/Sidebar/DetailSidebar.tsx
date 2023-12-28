import { Button, Count, VStack } from "@carbon/react";
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
            asChild
            variant={isActive ? "primary" : "ghost"}
            className="w-full justify-start"
          >
            <Link to={route.to}>
              {route.icon && <route.icon className="mr-2" />}
              <span>{route.name}</span>
              {route.count !== undefined && (
                <Count count={route.count} className="ml-auto" />
              )}
            </Link>
          </Button>
        );
      })}
    </VStack>
  );
};

export default DetailSidebar;
