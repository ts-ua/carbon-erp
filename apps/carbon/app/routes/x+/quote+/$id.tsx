import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { getLocationsList } from "~/modules/resources";
import {
  QuotationHeader,
  QuotationSidebar,
  getQuote,
  getQuoteExternalDocuments,
  getQuoteInternalDocuments,
  getQuoteLines,
  useQuotationTotals,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Quotations",
  to: path.to.quotes,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
  });

  const { id } = params;
  if (!id) throw new Error("Could not find id");

  const [
    quotation,
    quotationLines,
    externalDocuments,
    internalDocuments,
    locations,
  ] = await Promise.all([
    getQuote(client, id),
    getQuoteLines(client, id),
    getQuoteExternalDocuments(client, id),
    getQuoteInternalDocuments(client, id),
    getLocationsList(client),
  ]);

  if (quotation.error) {
    return redirect(
      path.to.quotes,
      await flash(
        request,
        error(quotation.error, "Failed to load quotation summary")
      )
    );
  }

  return json({
    quotation: quotation.data,
    quotationLines: quotationLines.data ?? [],
    externalDocuments: externalDocuments.data ?? [],
    internalDocuments: internalDocuments.data ?? [],
    locations: locations.data ?? [],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  return redirect(request.headers.get("Referer") ?? request.url);
}

export default function QuotationRoute() {
  const { quotationLines } = useLoaderData<typeof loader>();
  const [, setQuotationTotals] = useQuotationTotals();

  useEffect(() => {
    const totals = quotationLines.reduce(
      (acc, line) => {
        acc.total += (line.quantity ?? 0) * (line.unitPrice ?? 0);

        return acc;
      },
      { total: 0 }
    );
    setQuotationTotals(totals);
  }, [quotationLines, setQuotationTotals]);

  return (
    <>
      <QuotationHeader />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_4fr] h-full w-full gap-4">
        <QuotationSidebar />
        <Outlet />
      </div>
    </>
  );
}
