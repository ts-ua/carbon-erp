import type {
  getCompany,
  getIntegrations,
  getSequences,
} from "./settings.service";

export type Company = NonNullable<
  Awaited<ReturnType<typeof getCompany>>["data"]
>;

export type Integration = NonNullable<
  Awaited<ReturnType<typeof getIntegrations>>["data"]
>[number];

export type Sequence = NonNullable<
  Awaited<ReturnType<typeof getSequences>>["data"]
>[number];
