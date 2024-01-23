import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const integration = z.object({
  active: zfd.checkbox(),
});

export const exchangeRatesMetadata = z.object({
  apiKey: z.string(),
});

export const exchangeRatesIntegration = integration
  .merge(exchangeRatesMetadata)
  .refine(
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
