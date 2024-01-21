import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const exchangeRatesMetadata = z.object({
  apiKey: z.string(),
});

export const exchangeRatesMetadataValidator = withZod(exchangeRatesMetadata);
