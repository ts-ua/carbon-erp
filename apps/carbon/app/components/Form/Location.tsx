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
import type { getLocations } from "~/modules/resources";
import { path } from "~/utils/path";
import type { SelectProps } from "./Select";

type LocationSelectProps = Omit<SelectProps, "options" | "onChange"> & {
  isClearable?: boolean;
  onChange?: (
    selected: {
      value: string | number;
      label: string;
    } | null
  ) => void;
};

const Location = ({
  name,
  label = "Location",
  helperText,
  isLoading,
  isClearable,
  placeholder = "Select Location",
  onChange,
  ...props
}: LocationSelectProps) => {
  const { error } = useField(name);
  const [value, setValue] = useControlField<string | null>(name);

  const locationFetcher =
    useFetcher<Awaited<ReturnType<typeof getLocations>>>();

  useMount(() => {
    locationFetcher.load(path.to.api.locations);
  });

  const options = useMemo(
    () =>
      locationFetcher.data?.data
        ? locationFetcher.data?.data.map((c) => ({
            value: c.id,
            label: c.name,
          }))
        : [],
    [locationFetcher.data]
  );

  const handleChange = (
    selection: {
      value: string | number;
      label: string;
    } | null
  ) => {
    const newValue = (selection?.value as string) ?? null;
    setValue(newValue);
    onChange?.(selection);
  };

  const controlledValue = useMemo(
    // @ts-ignore
    () => options.find((option) => option.value === value),
    [value, options]
  );

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <input type="hidden" name={name} id={name} value={value ?? ""} />
      <ReactSelect
        {...props}
        value={controlledValue}
        isClearable={isClearable}
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

Location.displayName = "Location";

export default Location;
