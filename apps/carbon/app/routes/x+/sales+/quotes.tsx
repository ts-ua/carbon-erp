import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  QuotationsTable,
  QuotationsTableFilters,
  getQuotes,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Requests for Quotes",
  to: path.to.quotes,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const customerId = searchParams.get("customerId");
  const partId = searchParams.get("partId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [quotes] = await Promise.all([
    getQuotes(client, {
      search,
      status,
      partId,
      customerId,
      limit,
      offset,
      sorts,
      filters,
    }),
  ]);

  if (quotes.error) {
    redirect(
      path.to.authenticatedRoot,
      await flash(request, error(quotes.error, "Failed to fetch quotes"))
    );
  }

  return json({
    count: quotes.count ?? 0,
    quotes: quotes.data ?? [],
  });
}

export default function QuotesRoute() {
  const { count, quotes } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <QuotationsTableFilters />
      <QuotationsTable data={quotes} count={count} />
      <Outlet />
    </VStack>
  );
}
