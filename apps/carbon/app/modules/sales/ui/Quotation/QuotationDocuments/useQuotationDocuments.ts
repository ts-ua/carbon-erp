import { toast } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useCallback } from "react";
import { usePermissions } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { QuotationAttachment } from "~/modules/sales/types";

type Props = {
  attachments: QuotationAttachment[];
  isExternal: boolean;
  id: string;
};

export const useQuotationDocuments = ({
  attachments,
  isExternal,
  id,
}: Props) => {
  const fetcher = useFetcher();
  const permissions = usePermissions();
  const { supabase } = useSupabase();

  const canDelete = permissions.can("delete", "sales"); // TODO: or is document owner

  const refresh = useCallback(
    () => fetcher.submit(null, { method: "post" }),
    [fetcher]
  );

  const deleteAttachment = useCallback(
    async (attachment: QuotationAttachment) => {
      const result = await supabase?.storage
        .from(isExternal ? "quote-external" : "quote-internal")
        .remove([`${id}/${attachment.name}`]);

      if (!result || result.error) {
        toast.error(result?.error?.message || "Error deleting file");
        return;
      }

      toast.success("File deleted successfully");
      refresh();
    },
    [supabase, id, isExternal, refresh]
  );

  const download = useCallback(
    async (attachment: QuotationAttachment) => {
      const result = await supabase?.storage
        .from(isExternal ? "quote-external" : "quote-internal")
        .download(`${id}/${attachment.name}`);

      if (!result || result.error) {
        toast.error(result?.error?.message || "Error downloading file");
        return;
      }

      const a = document.createElement("a");
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(result.data);
      a.href = url;
      a.download = attachment.name;
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    },
    [supabase, id, isExternal]
  );

  const isImage = useCallback((fileType: string) => {
    return ["png", "jpg", "jpeg", "gif", "svg", "avif"].includes(fileType);
  }, []);

  const makePreview = useCallback(
    async (attachment: QuotationAttachment) => {
      const result = await supabase?.storage
        .from(isExternal ? "quote-external" : "quote-internal")
        .download(`${id}/${attachment.name}`);

      if (!result || result.error) {
        toast.error(result?.error?.message || "Error previewing file");
        return null;
      }

      return window.URL.createObjectURL(result.data);
    },
    [isExternal, id, supabase?.storage]
  );

  return {
    canDelete,
    deleteAttachment,
    download,
    isImage,
    makePreview,
  };
};
