import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  RequestForQuotesTable,
  RequestForQuotesTableFilters,
  getRequestsForQuotes,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Requests for Quotes",
  to: path.to.requestForQuotes,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const supplierId = searchParams.get("supplierId");
  const partId = searchParams.get("partId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [requestForQuotes] = await Promise.all([
    getRequestsForQuotes(client, {
      search,
      status,
      partId,
      supplierId,
      limit,
      offset,
      sorts,
      filters,
    }),
  ]);

  if (requestForQuotes.error) {
    redirect(
      path.to.authenticatedRoot,
      await flash(
        request,
        error(requestForQuotes.error, "Failed to fetch request for quotes")
      )
    );
  }

  return json({
    count: requestForQuotes.count ?? 0,
    requestForQuotes: requestForQuotes.data ?? [],
  });
}

export default function RequestForQuotesSearchRoute() {
  const { count, requestForQuotes } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <RequestForQuotesTableFilters />
      <RequestForQuotesTable data={requestForQuotes} count={count} />
      <Outlet />
    </VStack>
  );
}
