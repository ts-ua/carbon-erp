import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteAccount, getAccount } from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";
import { notFound } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
  });
  const { accountId } = params;
  if (!accountId) throw notFound("accountId not found");

  const account = await getAccount(client, accountId);
  if (account.error) {
    return redirect(
      "/x/accounting/currencies",
      await flash(request, error(account.error, "Failed to get account"))
    );
  }

  return json({ account: account.data });
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "accounting",
  });

  const { accountId } = params;
  if (!accountId) {
    return redirect(
      "/x/accounting/currencies",
      await flash(request, error(params, "Failed to get an account id"))
    );
  }

  const { error: deleteTypeError } = await deleteAccount(client, accountId);
  if (deleteTypeError) {
    return redirect(
      "/x/accounting/currencies",
      await flash(request, error(deleteTypeError, "Failed to delete account"))
    );
  }

  return redirect(
    "/x/accounting/currencies",
    await flash(request, success("Successfully deleted account"))
  );
}

export default function DeleteAccountRoute() {
  const { accountId } = useParams();
  const { account } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!accountId || !account) return null; // TODO - handle this better (404?)

  const onCancel = () => navigate("/x/accounting/currencies");

  return (
    <ConfirmDelete
      action={`/x/accounting/currencies/delete/${accountId}`}
      name={account.name}
      text={`Are you sure you want to delete the account: ${account.name} (${account.number})? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}