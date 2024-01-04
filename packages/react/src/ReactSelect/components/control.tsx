import { cva } from "class-variance-authority";
import { MdClose, MdKeyboardArrowDown } from "react-icons/md";
import type {
  ClearIndicatorProps,
  ControlProps,
  DropdownIndicatorProps,
  GroupBase,
  IndicatorSeparatorProps,
  LoadingIndicatorProps,
} from "react-select";
import { cn } from "~/utils/cn";
import { dataAttr } from "~/utils/dom";

const controlVariants = cva(
  "bg-background relative flex items-center justify-between flex-wrap p-0 overflow-hidden min-w-[180px] shadow-sm focus-within:outline-none ring-1 ring-border focus-within:ring-1 focus-within:ring-ring control",
  {
    variants: {
      size: {
        lg: "h-12 rounded-lg",
        md: "h-10 rounded-md",
        sm: "h-8 rounded",
      },
      w: {
        full: "w-full",
      },
      isDisabled: {
        true: "opacity-50 disabled:cursor-not-allowed pointer-events-none control--is-disabled",
      },
      isReadOnly: {
        true: "bg-muted",
      },
      isInvalid: {
        true: "ring-destructive focus-within:ring-offset-1 focus-within:ring-2 focus-within:ring-destructive",
      },
      isFocused: {
        true: "control--is-focused",
      },
      menuIsOpen: {
        true: "control--menu-is-open",
      },
    },
    defaultVariants: {
      size: "md",
      isDisabled: false,
      isReadOnly: false,
      isInvalid: false,
      isFocused: false,
      menuIsOpen: false,
    },
  }
);

const Control = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: ControlProps<Option, IsMulti, Group>
) => {
  const {
    className,
    children,
    innerRef,
    innerProps,
    isDisabled,
    isFocused,
    menuIsOpen,
    selectProps: { size, isInvalid, isReadOnly, w },
  } = props;

  return (
    <div
      ref={innerRef}
      className={cn(
        controlVariants({
          size,
          isDisabled,
          isReadOnly,
          isInvalid,
          isFocused,
          menuIsOpen,
        }),
        className
      )}
      {...innerProps}
      data-focus={isFocused ? dataAttr(true) : undefined}
      data-focus-visible={isFocused ? dataAttr(true) : undefined}
      data-invalid={isInvalid ? dataAttr(true) : undefined}
      data-disabled={isDisabled ? dataAttr(true) : undefined}
      aria-readonly={isReadOnly ? dataAttr(true) : undefined}
      style={{
        width: typeof w === "number" ? `${w}px` : undefined,
      }}
    >
      {children}
    </div>
  );
};

export const IndicatorSeparator = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: IndicatorSeparatorProps<Option, IsMulti, Group>
) => {
  return <div className="hidden" />;
};

const dropdownIndicatorVariants = cva(
  "flex items-center justify-center h-full border-0 mr-2 ml-1 indicator dropdown-indicator",
  {
    variants: {
      size: {
        lg: "text-2xl",
        md: "text-xl",
        sm: "text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export const DropdownIndicator = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: DropdownIndicatorProps<Option, IsMulti, Group>
) => {
  const {
    children,
    className,
    innerProps,
    selectProps: { size },
  } = props;

  return (
    <div
      {...innerProps}
      className={cn(dropdownIndicatorVariants({ size }), className)}
    >
      {children || <MdKeyboardArrowDown />}
    </div>
  );
};

const clearIndicatorVariants = cva(
  "flex items-center justify-center h-full border-0 mx-1 flex-shrink-0 indicator clear-indicator cursor-pointer",
  {
    variants: {
      size: {
        lg: "text-2xl",
        md: "text-xl",
        sm: "text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export const ClearIndicator = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: ClearIndicatorProps<Option, IsMulti, Group>
) => {
  const {
    children,
    className,
    innerProps,
    selectProps: { size },
  } = props;

  return (
    <div
      role="button"
      className={cn(clearIndicatorVariants({ size }), className)}
      aria-label="Clear selected options"
      {...innerProps}
    >
      {children || <MdClose />}
    </div>
  );
};

const loadingIndicatorVariants = cva(
  "animate-spin inline-block mx-1 text-muted-foreground indicator loading-indicator",
  {
    variants: {
      size: {
        lg: "h-6 w-6",
        md: "h-5 w-5",
        sm: "h-4 w-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export const LoadingIndicator = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: LoadingIndicatorProps<Option, IsMulti, Group>
) => {
  const {
    className,
    selectProps: { size },
  } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(loadingIndicatorVariants({ size }), className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
  );
};

export default Control;
