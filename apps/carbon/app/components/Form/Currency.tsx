import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Select,
  useMount,
} from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useMemo } from "react";
import { useControlField, useField } from "remix-validated-form";
import type { getCurrenciesList } from "~/modules/accounting";
import { path } from "~/utils/path";
import type { SelectProps } from "./Select";

type CurrencySelectProps = Omit<SelectProps, "options"> & {};

const Currency = ({
  name,
  label = "Currency",
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Currency",
  onChange,
  ...props
}: CurrencySelectProps) => {
  const { error } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

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

  const handleChange = (selection: {
    value: string | number;
    label: string;
  }) => {
    const newValue = (selection.value as string) || undefined;
    setValue(newValue);
    if (onChange && typeof onChange === "function") {
      onChange(selection);
    }
  };

  const controlledValue = useMemo(
    // @ts-ignore
    () => options.find((option) => option.value === value),
    [value, options]
  );

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <input type="hidden" name={name} id={name} value={value} />
      <Select
        {...props}
        value={controlledValue}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
        // @ts-ignore
        onChange={handleChange}
      />
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

Currency.displayName = "Currency";

export default Currency;
