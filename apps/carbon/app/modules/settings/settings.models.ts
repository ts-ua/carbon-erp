import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

const company = {
  name: z.string().min(1, { message: "Name is required" }),
  taxId: zfd.text(z.string().optional()),
  addressLine1: z.string().min(1, { message: "Address is required" }),
  addressLine2: zfd.text(z.string().optional()),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postalCode: z.string().min(1, { message: "Zip is required" }),
  countryCode: zfd.text(z.string().optional()),
  phone: zfd.text(z.string().optional()),
  fax: zfd.text(z.string().optional()),
  email: zfd.text(z.string().optional()),
  website: zfd.text(z.string().optional()),
};

export const companyValidator = withZod(z.object(company));
export const onboardingCompanyValidator = withZod(
  z.object({
    ...company,
    next: z.string().min(1, { message: "Next is required" }),
  })
);

export const sequenceValidator = withZod(
  z.object({
    table: z.string().min(1, { message: "Table is required" }),
    prefix: zfd.text(z.string().optional()),
    suffix: zfd.text(z.string().optional()),
    next: zfd.numeric(z.number().min(0)),
    step: zfd.numeric(z.number().min(1)),
    size: zfd.numeric(z.number().min(1).max(20)),
  })
);

export const themeValidator = withZod(
  z.object({
    primaryBackgroundLight: z
      .string()
      .min(1, { message: "Primary background light is required" }),
    primaryForegroundLight: z
      .string()
      .min(1, { message: "Primary foreground light is required" }),
    accentBackgroundLight: z
      .string()
      .min(1, { message: "Accent background light is required" }),
    accentForegroundLight: z
      .string()
      .min(1, { message: "Accent foreground light is required" }),
    primaryBackgroundDark: z
      .string()
      .min(1, { message: "Primary background dark is required" }),
    primaryForegroundDark: z
      .string()
      .min(1, { message: "Primary foreground dark is required" }),
    accentBackgroundDark: z
      .string()
      .min(1, { message: "Accent background dark is required" }),
    accentForegroundDark: z
      .string()
      .min(1, { message: "Accent foreground dark is required" }),
  })
);
