import { useCallback, useMemo } from "react";
import { usePermissions, useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { QuotationLine } from "~/modules/sales";
import { useParts } from "~/stores/parts";

export default function useQuotationLines() {
  const { id: userId } = useUser();
  const { supabase } = useSupabase();
  const permissions = usePermissions();

  const canEdit = permissions.can("update", "sales");
  const canDelete = permissions.can("delete", "sales");

  const [parts] = useParts();
  const partOptions = useMemo(
    () =>
      parts.map((p) => ({
        value: p.id,
        label: p.id,
      })),
    [parts]
  );

  const onCellEdit = useCallback(
    async (id: string, value: unknown, row: QuotationLine) => {
      if (!supabase) throw new Error("Supabase client not found");
      return await supabase
        .from("quoteLine")
        .update({
          [id]: value,
          updatedBy: userId,
        })
        .eq("id", row.id!);
    },
    [supabase, userId]
  );

  return {
    canDelete,
    canEdit,
    partOptions,
    supabase,
    onCellEdit,
  };
}
