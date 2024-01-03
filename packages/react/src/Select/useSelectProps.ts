import type { GroupBase, Props } from "react-select";
import { createFilter } from "react-select";
import { ariaAttr } from "~/utils/dom";
import carbonComponents from "./components";

const useSelectProps = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  components = {},
  theme,
  size,
  isDisabled,
  isInvalid,
  isReadOnly,
  isRequired,
  inputId,
  selectedOptionStyle = "check",
  filterOption,
  onFocus,
  onBlur,
  menuIsOpen,
  ...props
}: Props<Option, IsMulti, Group>): Props<Option, IsMulti, Group> => {
  console.log({ isReadOnly });
  const inputProps = {
    id: inputId,
    disabled: isDisabled,
    readOnly: isReadOnly,
    required: isRequired,
    "aria-invalid": ariaAttr(isInvalid),
    "aria-required": ariaAttr(isRequired),
    "aria-readonly": ariaAttr(isReadOnly),
    onFocus,
    onBlur,
  };

  console.log({ inputProps });

  // Unless `menuIsOpen` is controlled, disable it if the select is readonly
  const realMenuIsOpen =
    menuIsOpen ?? (inputProps.readOnly ? false : undefined);

  const select: Props<Option, IsMulti, Group> = {
    // Allow overriding of custom components
    components: {
      ...carbonComponents,
      ...components,
    },
    // Custom select props
    size,
    // Extract custom props from form control
    onFocus: inputProps.onFocus,
    onBlur: inputProps.onBlur,
    isDisabled: inputProps.disabled,
    isInvalid: !!inputProps["aria-invalid"],
    inputId: inputProps.id,
    isReadOnly: inputProps.readOnly,
    menuIsOpen: realMenuIsOpen,
    ...props,
    filterOption: filterOption ?? createFilter({ ignoreAccents: false }),

    // aria-invalid can be passed to react-select, so we allow that to
    // override the `isInvalid` prop
    "aria-invalid": props["aria-invalid"] ?? inputProps["aria-invalid"],
  };

  return select;
};

export default useSelectProps;
