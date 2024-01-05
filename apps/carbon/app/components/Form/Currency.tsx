import { useMount } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useMemo } from "react";
import type { getCurrenciesList } from "~/modules/accounting";
import { path } from "~/utils/path";

import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

type CurrencySelectProps = Omit<ComboboxProps, "options">;

const Currency = ({ ...props }: CurrencySelectProps) => {
  const currencyFetcher =
    useFetcher<Awaited<ReturnType<typeof getCurrenciesList>>>();

  useMount(() => {
    currencyFetcher.load(path.to.api.currencies);
  });

  const options = useMemo(
    () =>
      currencyFetcher.data?.data
        ? currencyFetcher.data?.data.map((c) => ({
            value: c.code,
            label: c.name,
          }))
        : [],
    [currencyFetcher.data]
  );

  return (
    <Combobox {...props} options={options} label={props?.label ?? "Currency"} />
  );
};

Currency.displayName = "Currency";

export default Currency;
