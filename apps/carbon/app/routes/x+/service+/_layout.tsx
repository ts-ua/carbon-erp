import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getServiceGroupsList } from "~/modules/parts";
import { getLocationsList } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Service" }];
};

export const handle: Handle = {
  breadcrumb: "Parts",
  to: path.to.parts,
  module: "parts",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const [serviceGroups, locations] = await Promise.all([
    getServiceGroupsList(client),
    getLocationsList(client),
  ]);

  return {
    locations: locations?.data ?? [],
    serviceGroups: serviceGroups?.data ?? [],
  };
}

export default function ServiceRoute() {
  return (
    <VStack w="full" h="full" spacing={4} p={4}>
      <Outlet />
    </VStack>
  );
}
