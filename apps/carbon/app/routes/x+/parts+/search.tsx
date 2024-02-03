import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  PartsTable,
  PartsTableFilters,
  getPartGroupsList,
  getParts,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const group = searchParams.get("group");
  const supplierId = searchParams.get("supplierId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [parts, partGroups] = await Promise.all([
    getParts(client, {
      search,
      type,
      group,
      supplierId,
      limit,
      offset,
      sorts,
      filters,
    }),
    getPartGroupsList(client),
  ]);

  if (parts.error) {
    redirect(
      path.to.authenticatedRoot,
      await flash(request, error(parts.error, "Failed to fetch parts"))
    );
  }

  return json({
    count: parts.count ?? 0,
    parts: parts.data ?? [],
    partGroups: partGroups.data ?? [],
  });
}

export default function PartsSearchRoute() {
  const { count, parts, partGroups } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <PartsTableFilters partGroups={partGroups} />
      <PartsTable data={parts} count={count} />
      <Outlet />
    </VStack>
  );
}
