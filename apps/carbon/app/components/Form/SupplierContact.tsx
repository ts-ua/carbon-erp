import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Select,
} from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useRef } from "react";
import { useControlField, useField } from "remix-validated-form";
import type {
  SupplierContact as SupplierContactType,
  getSupplierContacts,
} from "~/modules/purchasing";
import { path } from "~/utils/path";
import type { SelectProps } from "./Select";

type SupplierContactSelectProps = Omit<SelectProps, "options" | "onChange"> & {
  supplier?: string;
  onChange?: (supplierContact: SupplierContactType["contact"] | null) => void;
};

const SupplierContact = ({
  name,
  label = "Supplier Contact",
  supplier,
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Supplier Contact",
  onChange,
  ...props
}: SupplierContactSelectProps) => {
  const initialLoad = useRef(true);
  const { error } = useField(name);
  const [value, setValue] = useControlField<string | null>(name);

  const supplierContactFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierContacts>>>();

  useEffect(() => {
    if (supplier) {
      supplierContactFetcher.load(path.to.api.supplierContacts(supplier));
    }

    if (initialLoad.current) {
      initialLoad.current = false;
    } else {
      setValue(null);
      if (onChange) {
        onChange(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier]);

  const options = useMemo(
    () =>
      supplierContactFetcher.data?.data
        ? supplierContactFetcher.data?.data.map((c) => ({
            value: c.id,
            // @ts-ignore
            label: `${c.contact?.firstName} ${c.contact?.lastName}`,
          }))
        : [],
    [supplierContactFetcher.data]
  );

  const handleChange = (
    selection: {
      value: string | number;
      label: string;
    } | null
  ) => {
    const newValue = selection === null ? null : (selection.value as string);
    setValue(newValue);
    if (onChange && typeof onChange === "function") {
      if (newValue === null) onChange(newValue);
      const contact = supplierContactFetcher.data?.data?.find(
        (c) => c.id === newValue
      );

      onChange(contact?.contact ?? null);
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
      <input type="hidden" name={name} id={name} value={value ?? ""} />
      <Select
        {...props}
        value={controlledValue}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
        // @ts-ignore
        onChange={handleChange}
        isClearable
        w="full"
      />
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

SupplierContact.displayName = "SupplierContact";

export default SupplierContact;
