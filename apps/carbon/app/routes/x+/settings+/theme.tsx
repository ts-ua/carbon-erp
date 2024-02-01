import { VStack } from "@carbon/react";
import { hexToHls, hslToHex } from "@carbon/utils";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { PageTitle } from "~/components/Layout";
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

  const { id, updatedBy, updatedAt, ...themeData } = theme.data;

  Object.keys(themeData).forEach((key) => {
    // @ts-ignore
    themeData[key] = hslToHex(themeData[key]);
  });

  return json({
    theme: themeData,
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

  const themeData = validation.data;
  Object.keys(themeData).forEach((key) => {
    // @ts-ignore
    themeData[key] = hexToHls(themeData[key]);
  });

  const update = await updateTheme(client, {
    ...validation.data,
    updatedBy: userId,
  });
  if (update.error)
    return json(
      {},
      await flash(request, error(update.error, "Failed to update theme"))
    );

  return json(
    {},
    await flash(request, success("Updated theme. Please refresh the page."))
  );
}

export default function Theme() {
  const { theme } = useLoaderData<typeof loader>();

  const initialValues = theme;

  return (
    <VStack spacing={0} className="bg-background p-8 h-full">
      <PageTitle
        title="Theme"
        subtitle="This information will be displayed on document headers."
      />
      <ThemeForm theme={initialValues} />
    </VStack>
  );
}
