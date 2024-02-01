import { VStack } from "@carbon/react";
import { ValidatedForm } from "remix-validated-form";
import { Color, Submit } from "~/components/Form";
import { SectionTitle } from "~/components/Layout";
import { themeValidator } from "~/modules/settings";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type ThemeFormProps = {
  theme: TypeOfValidator<typeof themeValidator>;
};

const ThemeForm = ({ theme }: ThemeFormProps) => {
  return (
    <div className="w-full">
      <ValidatedForm
        method="post"
        action={path.to.theme}
        validator={themeValidator}
        defaultValues={theme}
      >
        <VStack spacing={4} className="max-w-[520px]">
          <SectionTitle>Light Mode</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Color name="primaryBackgroundLight" label="Primary Background" />
            <Color name="primaryForegroundLight" label="Primary Foreground" />
            <Color name="accentBackgroundLight" label="Accent Background" />
            <Color name="accentForegroundLight" label="Accent Foreground" />
          </div>
          <SectionTitle>Dark Mode</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Color name="primaryBackgroundDark" label="Primary Background" />
            <Color name="primaryForegroundDark" label="Primary Foreground" />
            <Color name="accentBackgroundDark" label="Accent Background Dark" />
            <Color name="accentForegroundDark" label="Accent Foreground Dark" />
          </div>

          <Submit>Save</Submit>
        </VStack>
      </ValidatedForm>
    </div>
  );
};

export default ThemeForm;
