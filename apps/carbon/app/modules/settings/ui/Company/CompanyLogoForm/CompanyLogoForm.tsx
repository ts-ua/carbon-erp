import { File, useNotification } from "@carbon/react";
import { Button, VStack } from "@chakra-ui/react";
import { useSubmit } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { Avatar } from "~/components";
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

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && supabase) {
      const logo = e.target.files[0];
      const fileExtension = logo.name.substring(logo.name.lastIndexOf(".") + 1);

      const imageUpload = await supabase.storage
        .from("public")
        .upload(`logo.${fileExtension}`, logo, {
          cacheControl: `${12 * 60 * 60}`,
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
    if (supabase) {
      const imageDelete = await supabase.storage
        .from("avatars")
        .remove([`${company.id}.png`]);

      if (imageDelete.error) {
        notification.copyableError(imageDelete.error, "Failed to remove image");
      }

      submitLogoUrl(null);
    }
  };

  const submitLogoUrl = (logoUrl: string | null) => {
    const formData = new FormData();
    formData.append("intent", "photo");
    if (logoUrl) formData.append("path", logoUrl);
    submit(formData, {
      method: "post",
      action: path.to.profile,
    });
  };

  return (
    <VStack w="full" spacing={2} px={8}>
      <Avatar size="2xl" path={company?.logo} title={company?.name ?? ""} />
      <File accept="image/*" onChange={uploadImage}>
        {company.logo ? "Change" : "Upload"}
      </File>

      {company.logo && (
        <Button variant="outline" onClick={deleteImage}>
          Remove
        </Button>
      )}
    </VStack>
  );
};

export default CompanyLogoForm;
