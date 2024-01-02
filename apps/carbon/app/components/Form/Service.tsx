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
import type { ServiceType, getServicesList } from "~/modules/parts";
import { path } from "~/utils/path";
import type { SelectProps } from "./Select";

type ServiceSelectProps = Omit<SelectProps, "options"> & {
  serviceType?: ServiceType;
};

const Service = ({
  name,
  label = "Service",
  serviceType,
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Service",
  onChange,
  ...props
}: ServiceSelectProps) => {
  const { getInputProps, error } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const servicesFetcher =
    useFetcher<Awaited<ReturnType<typeof getServicesList>>>();

  useMount(() => {
    const typeQueryParams = serviceType ? `type=${serviceType}` : "";
    servicesFetcher.load(`${path.to.api.services}?${typeQueryParams}`);
  });

  const options = useMemo(
    () =>
      servicesFetcher.data?.data
        ? servicesFetcher.data?.data.map((s) => ({
            value: s.id,
            label: `${s.id} - ${s.name}`,
          }))
        : [],
    [servicesFetcher.data]
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
      <Select
        {...getInputProps({
          // @ts-ignore
          id: name,
        })}
        {...props}
        options={options}
        value={controlledValue}
        isLoading={isLoading}
        placeholder={placeholder}
        w="full"
        isReadOnly={isReadOnly}
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

Service.displayName = "Service";

export default Service;
