import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  ReactSelect as SelectBase,
} from "@carbon/react";
import { useMemo } from "react";
import { useField } from "remix-validated-form";

export type SelectProps = {
  name: string;
  label?: string;
  options: { value: string | number; label: string }[];
  helperText?: string;
  isClearable?: boolean;
  isLoading?: boolean;
  isReadOnly?: boolean;
  placeholder?: string;
  onChange?: (newValue: { value: string | number; label: string }) => void;
};

const Select = ({
  name,
  label,
  options,
  helperText,
  isClearable,
  isLoading,
  isReadOnly,
  placeholder,
  onChange,
  ...props
}: SelectProps) => {
  const { getInputProps, error, defaultValue } = useField(name);
  const initialValue = useMemo(
    () => options.find((option) => option.value === defaultValue),
    [defaultValue, options]
  );

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {options?.length > 0 ? (
        <SelectBase
          {...getInputProps({
            // @ts-ignore
            id: name,
          })}
          {...props}
          defaultValue={initialValue}
          isClearable={isClearable}
          isLoading={isLoading}
          isReadOnly={isReadOnly}
          options={options}
          placeholder={placeholder}
          w="full"
          // @ts-ignore
          onChange={onChange ?? undefined}
        />
      ) : (
        <SelectBase
          isLoading={isLoading}
          isReadOnly={isReadOnly}
          options={[]}
          w="full"
        />
      )}

      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

Select.displayName = "Select";

export default Select;
