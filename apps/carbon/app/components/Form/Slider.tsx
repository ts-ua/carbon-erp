import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@carbon/react";
import type { SliderProps as SliderBaseProps } from "@chakra-ui/react";
import {
  Box,
  Slider as SliderBase,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { useField } from "remix-validated-form";

type SliderProps = SliderBaseProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
  helperText?: string;
};

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ name, label, isRequired, helperText, ...rest }, ref) => {
    const { getInputProps, error } = useField(name);

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}

        <SliderBase
          {...getInputProps({
            id: name,
            ...rest,
          })}
        >
          <SliderTrack bg="green.100" h={2}>
            <Box position="relative" right={10} />
            <SliderFilledTrack bg="green.500" />
          </SliderTrack>
          <SliderThumb boxSize={6} />
        </SliderBase>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;
