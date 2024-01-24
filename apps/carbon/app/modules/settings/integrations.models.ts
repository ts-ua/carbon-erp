import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const integration = z.object({
  active: zfd.checkbox(),
});

export const apiKey = z.object({
  apiKey: z.string(),
});

export const exchangeRatesIntegration = integration.merge(apiKey).refine(
  (data) => {
    if (data.active) {
      return data.apiKey.length > 0;
    }
    return true;
  },
  {
    message: "API key is required when integration is active",
    path: ["apiKey"],
  }
);
export const exchangeRatesFormValidator = withZod(exchangeRatesIntegration);

export const googlePlacesIntegration = integration.merge(apiKey).refine(
  (data) => {
    if (data.active) {
      return data.apiKey.length > 0;
    }
    return true;
  },
  {
    message: "API key is required when integration is active",
    path: ["apiKey"],
  }
);
export const googlePlacesFormValidator = withZod(googlePlacesIntegration);

export const resendIntegration = integration.merge(apiKey).refine(
  (data) => {
    if (data.active) {
      return data.apiKey.length > 0;
    }
    return true;
  },
  {
    message: "API key is required when integration is active",
    path: ["apiKey"],
  }
);
export const resendFormValidator = withZod(resendIntegration);
