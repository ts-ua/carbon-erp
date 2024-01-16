import { HStack } from "@carbon/react";
import { useMatches } from "@remix-run/react";
import { z } from "zod";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumbs as BreadcrumbsBase,
} from "~/components";

export const BreadcrumbHandle = z.object({
  breadcrumb: z.any(),
  to: z.string().optional(),
});
export type BreadcrumbHandleType = z.infer<typeof BreadcrumbHandle>;

const BreadcrumbHandleMatch = z.object({
  handle: BreadcrumbHandle,
});

const Breadcrumbs = () => {
  const matches = useMatches();

  const breadcrumbs = matches
    .map((m) => {
      const result = BreadcrumbHandleMatch.safeParse(m);
      if (!result.success || !result.data.handle.breadcrumb) return null;

      return {
        breadcrumb: result.data.handle.breadcrumb,
        to: result.data.handle?.to ?? m.pathname,
      };
    })
    .filter(Boolean);

  return (
    <HStack className="items-center h-full" spacing={0}>
      <BreadcrumbsBase className="line-clamp-1">
        {breadcrumbs.map((breadcrumb, i) => (
          <BreadcrumbItem key={i}>
            <BreadcrumbLink
              isCurrentPage={!breadcrumb?.to}
              to={breadcrumb?.to ?? ""}
            >
              {breadcrumb?.breadcrumb}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbsBase>
    </HStack>
  );
};

export default Breadcrumbs;
