import { useMount } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useCallback, useMemo } from "react";
import { usePermissions, useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { getAccountsList } from "~/modules/accounting";
import type { PurchaseOrderLine } from "~/modules/purchasing";
import { usePurchasedParts } from "~/stores/parts";
import { path } from "~/utils/path";

export default function usePurchaseOrderLines() {
  const { id: userId } = useUser();
  const { supabase } = useSupabase();
  const permissions = usePermissions();

  const canEdit = permissions.can("update", "purchasing");
  const canDelete = permissions.can("delete", "purchasing");

  const parts = usePurchasedParts();
  const accountsFetcher =
    useFetcher<Awaited<ReturnType<typeof getAccountsList>>>();

  useMount(() => {
    accountsFetcher.load(`${path.to.api.accounts}?type=Posting`);
  });

  const partOptions = useMemo(
    () =>
      parts.map((p) => ({
        value: p.id,
        label: p.id,
      })),
    [parts]
  );

  const accountOptions = useMemo(
    () =>
      accountsFetcher.data?.data
        ? accountsFetcher.data?.data.map((c) => ({
            value: c.number,
            label: c.number,
          }))
        : [],
    [accountsFetcher.data]
  );

  const onCellEdit = useCallback(
    async (id: string, value: unknown, row: PurchaseOrderLine) => {
      if (!supabase) throw new Error("Supabase client not found");
      return await supabase
        .from("purchaseOrderLine")
        .update({
          [id]: value,
          updatedBy: userId,
        })
        .eq("id", row.id);
    },
    [supabase, userId]
  );

  return {
    accountOptions,
    canDelete,
    canEdit,
    partOptions,
    supabase,
    onCellEdit,
  };
}
