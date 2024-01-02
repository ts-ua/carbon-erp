import type { InputProps } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as InputBase,
} from "@carbon/react";
import { forwardRef } from "react";
import { useField } from "remix-validated-form";

type FormPhoneProps = InputProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
};

const Phone = forwardRef<HTMLInputElement, FormPhoneProps>(
  ({ name, label, isRequired, ...rest }, ref) => {
    const { getInputProps, error } = useField(name);

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <InputBase
          ref={ref}
          {...getInputProps({
            id: name,
            ...rest,
          })}
          type="tel"
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Phone.displayName = "Phone";

export default Phone;
