import { HStack, useColor } from "@carbon/react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";

import { useRef } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { useControlField, useField } from "remix-validated-form";

type ColorFieldProps = {
  name: string;
  label: string;
};

const ColorPicker = ({ name, label }: ColorFieldProps) => {
  const { error } = useField(name);
  const [value, setValue] = useControlField<string>(name);
  const disclosure = useDisclosure();
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: containerRef,
    handler: () => disclosure.onClose(),
  });

  const borderColor = useColor("var(--chakra-colors-gray-200)");

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <input type="hidden" name={name} value={value} />
      <div className="relative" ref={containerRef}>
        <HStack>
          <Box
            as={Button}
            bg={value}
            h={8}
            w={8}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="md"
            boxShadow="md"
            cursor="pointer"
            onClick={disclosure.onToggle}
            tabIndex={0}
            _hover={{
              bg: value,
            }}
          />
          <HexColorInput
            color={value}
            onChange={setValue}
            className="py-0 px-2 h-9 rounded-md outline-2 outline-offset-2 outline-transparent border z-50"
          />
        </HStack>
        {disclosure.isOpen && (
          <div className="absolute mt-1 top-10 z-50">
            <HexColorPicker color={value} onChange={setValue} />
          </div>
        )}
      </div>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default ColorPicker;
