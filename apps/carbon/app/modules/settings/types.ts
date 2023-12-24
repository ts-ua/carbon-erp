import type { getCompany, getSequences } from "./settings.service";

export type Company = NonNullable<
  Awaited<ReturnType<typeof getCompany>>["data"]
>;

export type Sequence = NonNullable<
  Awaited<ReturnType<typeof getSequences>>["data"]
>[number];
