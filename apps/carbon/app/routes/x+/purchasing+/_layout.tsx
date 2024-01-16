import { VStack } from "@carbon/react";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { GroupedContentSidebar } from "~/components/Layout";
import { usePurchasingSidebar } from "~/modules/purchasing";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Purchasing" }];
};

export const handle: Handle = {
  breadcrumb: "Purchasing",
  to: path.to.purchasing,
  module: "purchasing",
};

export default function UsersRoute() {
  const { groups } = usePurchasingSidebar();

  return (
    <div className="grid grid-cols-[auto_1fr] w-full h-full">
      <GroupedContentSidebar groups={groups} />
      <VStack spacing={0} className="h-full">
        <Outlet />
      </VStack>
    </div>
  );
}
