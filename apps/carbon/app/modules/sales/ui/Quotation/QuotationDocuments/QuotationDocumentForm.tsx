import { File, toast } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { IoMdAdd } from "react-icons/io";
import { useSupabase } from "~/lib/supabase";

type QuotationDocumentFormProps = {
  id: string;
  isExternal: boolean;
};

const QuotationDocumentForm = ({
  id,
  isExternal,
}: QuotationDocumentFormProps) => {
  const fetcher = useFetcher();
  const { supabase } = useSupabase();

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && supabase) {
      const file = e.target.files[0];
      const fileName = `${id}/${file.name}`;

      const fileUpload = await supabase.storage
        .from(`quote-${isExternal ? "external" : "internal"}`)
        .upload(fileName, file, {
          cacheControl: `${12 * 60 * 60}`,
        });

      if (fileUpload.error) {
        toast.error("Failed to upload file");
      }

      if (fileUpload.data?.path) {
        toast.success("File uploaded");
        // refetch the loaders
        fetcher.submit(null, { method: "post" });
      }
    }
  };

  return (
    <File leftIcon={<IoMdAdd />} onChange={uploadFile}>
      New
    </File>
  );
};

export default QuotationDocumentForm;
