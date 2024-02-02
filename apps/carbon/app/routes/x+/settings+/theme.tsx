import { VStack } from "@carbon/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { PageTitle } from "~/components/Layout";
import type { Theme as ThemeValue } from "~/modules/settings";
import {
  ThemeForm,
  getTheme,
  themeValidator,
  updateTheme,
} from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Theme",
  to: path.to.theme,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "settings",
  });

  const theme = await getTheme(client);
  if (theme.error) {
    return redirect(
      path.to.settings,
      await flash(request, error(theme.error, "Failed to get theme"))
    );
  }

  return json({
    theme: theme.data,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "settings",
  });
  const formData = await request.formData();

  const validation = await themeValidator.validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const update = await updateTheme(client, {
    ...validation.data,
    updatedBy: userId,
  });
  if (update.error)
    return json(
      {},
      await flash(request, error(update.error, "Failed to update theme"))
    );

  return json({}, await flash(request, success("Updated theme.")));
}

export default function Theme() {
  const { theme } = useLoaderData<typeof loader>();

  const initialValues = {
    theme: theme.theme as ThemeValue,
  };

  return (
    <VStack spacing={0} className="bg-background p-8 h-full">
      <PageTitle
        title="Theme"
        subtitle="Pick a style and color scheme that suits you best."
      />

      <ThemeForm theme={initialValues} />
    </VStack>
  );
}
