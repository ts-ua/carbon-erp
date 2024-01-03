import { FormControl, FormErrorMessage, FormLabel } from "@carbon/react";
import type { TextareaProps } from "@chakra-ui/react";
import { Textarea as TextAreaBase } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { forwardRef, useState } from "react";
import { useField } from "remix-validated-form";

type FormTextArea = TextareaProps & {
  name: string;
  label?: string;
  characterLimit?: number;
  isRequired?: boolean;
};

const TextArea = forwardRef<HTMLTextAreaElement, FormTextArea>(
  ({ name, label, characterLimit, isRequired, ...rest }, ref) => {
    const { getInputProps, error, defaultValue } = useField(name);
    const [characterCount, setCharacterCount] = useState(
      defaultValue?.length ?? 0
    );

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (characterLimit) setCharacterCount(e.target.value.length);
    };

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <TextAreaBase
          ref={ref}
          {...getInputProps({
            id: name,
            ...rest,
          })}
          className="bg-input border-input-border"
          maxLength={characterLimit}
          onChange={onChange}
        />
        {characterLimit && (
          <p className="text-sm text-muted-foreground">
            {characterCount} of {characterLimit}
          </p>
        )}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
