import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  VStack,
} from "@carbon/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
import { useField } from "remix-validated-form";

type RadiosProps = {
  name: string;
  label?: string;
  options: { label: string; value: string }[];
  direction?: "column" | "row";
};

const Radios = ({
  name,
  label,
  options,
  direction = "column",
}: RadiosProps) => {
  const { getInputProps, error } = useField(name);
  const Stack = direction === "column" ? VStack : HStack;

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <RadioGroup
        {...getInputProps({
          // @ts-ignore
          id: name,
        })}
        name={name}
      >
        <Stack className="items-start">
          {options.map(({ label, value }) => (
            <Radio key={value} value={value}>
              {label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default Radios;
