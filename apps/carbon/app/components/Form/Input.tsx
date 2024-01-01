import type { InputProps } from "@carbon/react";
import {
  Input as InputBase,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { useField } from "remix-validated-form";

type FormInputProps = InputProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
  helperText?: string;
  prefix?: string;
  suffix?: string;
};

const Input = forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, label, isRequired, helperText, prefix, suffix, ...rest }, ref) => {
    const { getInputProps, error } = useField(name);

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        {prefix || suffix ? (
          <InputGroup>
            {prefix && <InputLeftAddon children={prefix} />}
            <InputBase
              ref={ref}
              {...getInputProps({
                id: name,
                ...rest,
              })}
            />
            {suffix && <InputRightAddon children={suffix} />}
          </InputGroup>
        ) : (
          <InputBase
            ref={ref}
            {...getInputProps({
              id: name,
              ...rest,
            })}
          />
        )}

        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Input.displayName = "Input";

export default Input;
