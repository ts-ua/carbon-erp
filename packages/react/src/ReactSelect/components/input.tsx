import { cva } from "class-variance-authority";
import type { GroupBase, InputProps } from "react-select";
import { cn } from "~/utils/cn";
import { cleanCommonProps } from "../utils";

const inputVariants = cva(
  "color-inherit background-0 w-full outline-0 focus-visible:outline-0 focus-visible:ring-0",
  {
    variants: {
      isHidden: {
        true: "opacity-0 pointer-events-none",
        false: "opacity-100 pointer-events-auto",
      },
    },
    defaultVariants: {
      isHidden: false,
    },
  }
);

const Input = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: InputProps<Option, IsMulti, Group>
) => {
  const {
    className,
    value,
    selectProps: { isReadOnly, isRequired },
  } = props;
  const { innerRef, isDisabled, isHidden, inputClassName, ...innerProps } =
    cleanCommonProps(props);

  return (
    <div
      className={cn(
        "flex-1 inline-grid grid-area-[1 / 1 / 2 / 3] mx-[0.5] py-1 text-inherit min-w-[2px] border-0 margin-0 outline-0 after:content-[attr(data-value) ' '] after:visibility-hidden after:whitespace-pre after:px-0 after:py-0",
        className
      )}
      data-value={value || ""}
    >
      <input
        className={cn(inputVariants({ isHidden }), inputClassName)}
        ref={innerRef}
        disabled={isDisabled}
        readOnly={isReadOnly ? true : undefined}
        aria-readonly={isReadOnly ? true : undefined}
        aria-required={isRequired ? true : undefined}
        {...innerProps}
      />
    </div>
  );
};

export default Input;
