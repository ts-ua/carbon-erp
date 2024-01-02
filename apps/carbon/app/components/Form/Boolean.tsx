import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
} from "@carbon/react";
import type { SwitchProps, SystemStyleObject } from "@chakra-ui/react";
import {
  VisuallyHidden,
  chakra,
  omitThemingProps,
  useCheckbox,
  useMultiStyleConfig,
} from "@chakra-ui/react";
import { forwardRef, useMemo } from "react";
import { useControlField, useField } from "remix-validated-form";

type FormBooleanProps = Omit<SwitchProps, "onChange"> & {
  name: string;
  label?: string;
  helperText?: string;
  description?: string;
  onChange?: (value: boolean) => void;
};

const Boolean = forwardRef<HTMLInputElement, FormBooleanProps>(
  ({ name, label, description, helperText, onChange, ...props }, ref) => {
    const { getInputProps, error } = useField(name);
    const [value, setValue] = useControlField<boolean>(name);

    const styles = useMultiStyleConfig("Switch", {
      colorScheme: "green",
      ...props,
    });
    const { ...ownProps } = omitThemingProps(props);

    const { getCheckboxProps, getRootProps, getLabelProps } = useCheckbox({
      ...ownProps,
      isChecked: value,
    });

    const containerStyles: SystemStyleObject = useMemo(
      () => ({
        display: "inline-block",
        position: "relative",
        verticalAlign: "middle",
        lineHeight: 0,
        ...styles.container,
      }),
      [styles.container]
    );

    const trackStyles: SystemStyleObject = useMemo(
      () => ({
        display: "inline-flex",
        flexShrink: 0,
        justifyContent: "flex-start",
        boxSizing: "content-box",
        cursor: "pointer",
        ...styles.track,
      }),
      [styles.track]
    );

    return (
      <FormControl isInvalid={!!error} className="pt-2">
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <HStack className="w-full">
          <chakra.label
            {...getRootProps()}
            className="chakra-switch"
            __css={containerStyles}
          >
            <VisuallyHidden>
              <input
                ref={ref}
                type="checkbox"
                disabled={props.isDisabled}
                {...getInputProps({
                  type: "checkbox",
                  id: name,
                })}
                onChange={(e) => {
                  setValue(e.target.checked);
                  onChange?.(e.target.checked);
                }}
              />
            </VisuallyHidden>
            <HStack>
              <chakra.span
                {...getCheckboxProps()}
                className="chakra-switch__track"
                __css={trackStyles}
              >
                <chakra.span
                  __css={styles.thumb}
                  className="chakra-switch__thumb"
                  data-checked={value ? "" : undefined}
                />
              </chakra.span>
              {description && <p {...getLabelProps()}>{description}</p>}
            </HStack>
          </chakra.label>
        </HStack>
        {error ? (
          <FormErrorMessage>{error}</FormErrorMessage>
        ) : (
          helperText && <FormHelperText>{helperText}</FormHelperText>
        )}
      </FormControl>
    );
  }
);

Boolean.displayName = "Boolean";

export default Boolean;
