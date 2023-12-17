import { useCallback } from "react";
import { usePermissions } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { ServiceSupplier } from "~/modules/parts";

export default function useServiceSuppliers() {
  const { supabase } = useSupabase();
  const permissions = usePermissions();

  const canEdit = permissions.can("update", "parts");
  const canDelete = permissions.can("delete", "parts");

  const onCellEdit = useCallback(
    async (id: string, value: unknown, row: ServiceSupplier) => {
      if (!supabase) throw new Error("Supabase client not found");
      return await supabase
        .from("serviceSupplier")
        .update({
          [id]: value,
        })
        .eq("id", row.id);
    },
    [supabase]
  );

  return {
    canDelete,
    canEdit,
    supabase,
    onCellEdit,
  };
}
