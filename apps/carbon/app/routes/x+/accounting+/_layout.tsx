import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { GroupedContentSidebar } from "~/components/Layout";
import {
  getAccountsList,
  getBaseCurrency,
  useAccountingSidebar,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Accounting" }];
};

export const handle: Handle = {
  breadcrumb: "Accounting",
  to: path.to.accounting,
  module: "accounting",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
  });

  const [baseCurrency, balanceSheetAccounts, incomeStatementAccounts] =
    await Promise.all([
      getBaseCurrency(client),
      getAccountsList(client, {
        type: "Posting",
        incomeBalance: "Balance Sheet",
      }),
      getAccountsList(client, {
        type: "Posting",
        incomeBalance: "Income Statement",
      }),
    ]);

  if (balanceSheetAccounts.error) {
    return redirect(
      path.to.authenticatedRoot,
      await flash(
        request,
        error(
          balanceSheetAccounts.error,
          "Failed to fetch balance sheet accounts"
        )
      )
    );
  }

  if (incomeStatementAccounts.error) {
    return redirect(
      path.to.authenticatedRoot,
      await flash(
        request,
        error(
          incomeStatementAccounts.error,
          "Failed to fetch income statement accounts"
        )
      )
    );
  }

  return json({
    baseCurrency: baseCurrency.data,
    balanceSheetAccounts: balanceSheetAccounts.data ?? [],
    incomeStatementAccounts: incomeStatementAccounts.data ?? [],
  });
}

export default function AccountingRoute() {
  const { groups } = useAccountingSidebar();

  return (
    <div className="grid grid-cols-[auto_1fr] w-full h-full">
      <GroupedContentSidebar groups={groups} />
      <VStack spacing={0} className="h-full">
        <Outlet />
      </VStack>
    </div>
  );
}
