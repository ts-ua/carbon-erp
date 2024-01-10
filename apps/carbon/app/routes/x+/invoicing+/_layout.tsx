import { VStack } from "@carbon/react";
import { Outlet } from "@remix-run/react";
import { GroupedContentSidebar } from "~/components/Layout";
import { useInvoicingSidebar } from "~/modules/invoicing";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: "Invoicing",
  to: path.to.invoicing,
  module: "invoicing",
};

export default function InvoicingRoute() {
  const { groups } = useInvoicingSidebar();

  return (
    <div className="grid grid-cols-[auto_1fr] w-full h-full">
      <GroupedContentSidebar groups={groups} />
      <VStack spacing={0} className="h-full">
        <Outlet />
      </VStack>
    </div>
  );
}
