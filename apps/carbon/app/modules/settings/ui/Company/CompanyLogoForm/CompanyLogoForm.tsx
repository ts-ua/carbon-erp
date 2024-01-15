import { Avatar, Button, File, VStack, useNotification } from "@carbon/react";
import { useSubmit } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useSupabase } from "~/lib/supabase";
import type { Company } from "~/modules/settings";
import { path } from "~/utils/path";

type CompanyLogoFormProps = {
  company: Company;
};

const CompanyLogoForm = ({ company }: CompanyLogoFormProps) => {
  const { supabase } = useSupabase();
  const notification = useNotification();
  const submit = useSubmit();

  const logoPath = company?.logo
    ? company.logo.substring(company.logo.lastIndexOf("/") + 1)
    : null;

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && supabase) {
      const logo = e.target.files[0];
      const fileExtension = logo.name.substring(logo.name.lastIndexOf(".") + 1);

      const imageUpload = await supabase.storage
        .from("public")
        .upload(`logo.${fileExtension}`, logo, {
          cacheControl: "0",
          upsert: true,
        });

      if (imageUpload.error) {
        notification.copyableError(imageUpload.error, "Failed to upload logo");
      }

      if (imageUpload.data?.path) {
        submitLogoUrl(imageUpload.data.path);
      }
    }
  };

  const deleteImage = async () => {
    if (supabase && logoPath) {
      const imageDelete = await supabase.storage
        .from("public")
        .remove([logoPath]);

      if (imageDelete.error) {
        notification.copyableError(imageDelete.error, "Failed to remove image");
      }

      submitLogoUrl(null);
    }
  };

  const submitLogoUrl = (logoUrl: string | null) => {
    const formData = new FormData();
    formData.append("intent", "logo");
    if (logoUrl) formData.append("path", logoUrl);
    submit(formData, {
      method: "post",
      action: path.to.company,
    });
  };

  return (
    <VStack className="items-center p-8">
      <Avatar
        size="2xl"
        src={company?.logo ?? undefined}
        name={company?.name}
      />
      <File accept="image/*" onChange={uploadImage}>
        {company.logo ? "Change" : "Upload"}
      </File>

      {company.logo && (
        <Button variant="secondary" onClick={deleteImage}>
          Remove
        </Button>
      )}
    </VStack>
  );
};

export default CompanyLogoForm;
