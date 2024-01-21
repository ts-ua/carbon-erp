import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  exchangeRatesMetadata,
  exchangeRatesMetadataValidator,
  getIntegration,
  updateIntegration,
} from "~/modules/settings";
import ExchangeRatesForm from "~/modules/settings/ui/Integrations/ExchangeRatesForm";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

const defaultValue = {
  apiKey: "",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "settings",
  });

  const integration = await getIntegration(client, "exchange-rates-v1");
  if (integration.error) {
    return redirect(
      path.to.integrations,
      await flash(
        request,
        error(integration.error, "Failed to load integration")
      )
    );
  }

  const validIntegration = exchangeRatesMetadata.safeParse(
    integration.data?.metadata
  );

  return json({
    integration: validIntegration.success
      ? validIntegration.data
      : defaultValue,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "settings",
  });

  const { customerId } = params;
  if (!customerId) throw new Error("Could not find customerId");

  const validation = await exchangeRatesMetadataValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const update = await updateIntegration(client, {
    id: "exchange-rates-v1",
    metadata: {
      ...validation.data,
    },
    updatedBy: userId,
  });
  if (update.error) {
    return redirect(
      path.to.integrations,
      await flash(
        request,
        error(update.error, "Failed to update exchange rates integration")
      )
    );
  }

  return redirect(
    path.to.integrations,
    await flash(request, success("Updated exchange rates integration"))
  );
}

export default function ExchangeRatesIntegrationRoute() {
  const { integration } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <ExchangeRatesForm
      initialValues={integration}
      onClose={() => navigate(path.to.integrations)}
    />
  );
}
