import { VStack } from "@carbon/react";
import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requirePermissions } from "~/services/auth";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | People" }];
};

export const handle: Handle = {
  breadcrumb: "Resources",
  to: path.to.resources,
  module: "resources",
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    view: "resources",
  });

  return null;
}

export default function PersonRoute() {
  return (
    <VStack spacing={4} className="h-full p-4">
      <Outlet />
    </VStack>
  );
}
