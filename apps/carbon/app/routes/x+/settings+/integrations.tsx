import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getIntegrations } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "settings",
  });

  const integrations = await getIntegrations(client);

  if (integrations.error) {
    return redirect(
      path.to.settings,
      await flash(
        request,
        error(integrations.error, "Failed to load integrations")
      )
    );
  }

  return json({
    integrations: integrations.data ?? [],
  });
}

export default function IntegrationsRoute() {
  const { integrations } = useLoaderData<typeof loader>();
  return (
    <>
      <pre>{JSON.stringify(integrations, null, 2)}</pre>
      <Outlet />
    </>
  );
}
