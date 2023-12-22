import { useColor } from "@carbon/react";
import { Grid, VStack } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { PageTitle } from "~/components/Layout";
import {
  CompanyForm,
  CompanyLogoForm,
  companyValidator,
  getCompany,
  updateCompany,
  updateLogo,
} from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Company",
  to: path.to.company,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {});

  const company = await getCompany(client);

  if (company.error || !company.data) {
    return redirect(
      path.to.settings,
      await flash(request, error(company.error, "Failed to get company"))
    );
  }

  return json({ company: company.data });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {});
  const formData = await request.formData();

  if (formData.get("intent") === "about") {
    const validation = await companyValidator.validate(formData);

    if (validation.error) {
      return validationError(validation.error);
    }

    const update = await updateCompany(client, {
      ...validation.data,
      updatedBy: userId,
    });
    if (update.error)
      return json(
        {},
        await flash(request, error(update.error, "Failed to update company"))
      );

    return json({}, await flash(request, success("Updated company")));
  }

  if (formData.get("intent") === "logo") {
    const logoPath = formData.get("path");
    if (logoPath === null || typeof logoPath === "string") {
      const logoUpdate = await updateLogo(client, logoPath);
      if (logoUpdate.error) {
        return redirect(
          path.to.company,
          await flash(request, error(logoUpdate.error, "Failed to update logo"))
        );
      }

      return redirect(
        path.to.company,
        await flash(
          request,
          success(
            logoPath === null
              ? "Removed logo. Please refresh the page."
              : "Updated logo. Please refresh the page."
          )
        )
      );
    } else {
      return redirect(
        path.to.company,
        await flash(request, error(null, "Invalid logo path"))
      );
    }
  }

  return null;
}

export default function Company() {
  const { company } = useLoaderData<typeof loader>();

  const initialValues = {
    name: company.name,
    taxId: company.taxId ?? undefined,
    addressLine1: company.addressLine1 ?? "",
    addressLine2: company.addressLine2 ?? undefined,
    city: company.city ?? "",
    state: company.state ?? "",
    postalCode: company.postalCode ?? "",
    countryCode: company.countryCode ?? undefined,
    phone: company.phone ?? undefined,
    email: company.email ?? undefined,
    website: company.website ?? undefined,
  };

  return (
    <VStack w="full" h="full" spacing={0} p={8} bg={useColor("white")}>
      <PageTitle
        title="Company"
        subtitle="This information will be displayed on document headers."
      />
      <Grid gridTemplateColumns={["1fr", "1fr auto"]} w="full" gridGap={8}>
        <CompanyForm company={initialValues} />
        <CompanyLogoForm company={company} />
      </Grid>
    </VStack>
  );
}
