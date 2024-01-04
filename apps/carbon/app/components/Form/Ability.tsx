import type { SingleValue } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  ReactSelect,
  useMount,
} from "@carbon/react";

import { useFetcher } from "@remix-run/react";
import { useMemo } from "react";
import { useControlField, useField } from "remix-validated-form";
import type { getAbilitiesList } from "~/modules/resources";
import { path } from "~/utils/path";
import type { SelectProps } from "./Select";

type AbilitySelectProps = Omit<SelectProps, "options" | "onChange"> & {
  onChange?: (
    selection: SingleValue<{
      value: string | number;
      label: string;
    }>
  ) => void;
};

const Ability = ({
  name,
  label = "Ability",
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Ability",
  onChange,
  ...props
}: AbilitySelectProps) => {
  const { error } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const abilityFetcher =
    useFetcher<Awaited<ReturnType<typeof getAbilitiesList>>>();

  useMount(() => {
    abilityFetcher.load(path.to.api.abilities);
  });

  const options = useMemo(
    () =>
      abilityFetcher.data?.data
        ? abilityFetcher.data?.data.map((c) => ({
            value: c.id,
            label: c.name,
          }))
        : [],
    [abilityFetcher.data]
  );

  const handleChange = (
    selection: SingleValue<{
      value: string | number;
      label: string;
    }>
  ) => {
    const newValue = (selection?.value as string) || undefined;
    setValue(newValue);
    onChange?.(selection);
  };

  const controlledValue = useMemo(
    () => options.find((option) => option.value === value),
    [value, options]
  );

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <input type="hidden" name={name} id={name} value={value} />
      <ReactSelect
        {...props}
        value={controlledValue}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
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

Ability.displayName = "Ability";

export default Ability;
