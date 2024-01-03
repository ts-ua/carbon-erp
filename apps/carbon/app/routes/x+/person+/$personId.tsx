import { Grid } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  accountProfileValidator,
  updatePublicAccount,
} from "~/modules/account";
import {
  PersonPreview,
  PersonSidebar,
  getEmployeeSummary,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "People",
  to: path.to.people,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { personId } = params;
  if (!personId) throw new Error("Could not find personId");

  const [employeeSummary] = await Promise.all([
    getEmployeeSummary(client, personId),
  ]);

  if (employeeSummary.error) {
    return redirect(
      path.to.people,
      await flash(
        request,
        error(employeeSummary.error, "Failed to load employee summary")
      )
    );
  }

  return json({
    employeeSummary: employeeSummary.data,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "resources",
  });
  const { personId } = params;
  if (!personId) throw new Error("No person ID provided");

  const validation = await accountProfileValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { firstName, lastName, about } = validation.data;

  const updateAccount = await updatePublicAccount(client, {
    id: personId,
    firstName,
    lastName,
    about,
  });
  if (updateAccount.error)
    return json(
      {},
      await flash(
        request,
        error(updateAccount.error, "Failed to update profile")
      )
    );

  return json({}, await flash(request, success("Updated profile")));
}

export default function PersonRoute() {
  return (
    <>
      <PersonPreview />
      <Grid
        gridTemplateColumns={["1fr", "1fr", "1fr 4fr"]}
        gridColumnGap={4}
        w="full"
        h="full"
      >
        <PersonSidebar />
        <Outlet />
      </Grid>
    </>
  );
}
