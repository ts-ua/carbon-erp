import { type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { useIntegrations } from "~/hooks/useIntegrations";
import { IntegrationsList } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    view: "settings",
  });

  return null;
}

export default function IntegrationsRoute() {
  const { list } = useIntegrations();

  return (
    <>
      <IntegrationsList integrations={list} />
      <Outlet />
    </>
  );
}
