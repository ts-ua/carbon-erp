import { cva } from "class-variance-authority";
import clsx from "clsx";
import type {
  ContainerProps,
  GroupBase,
  IndicatorsContainerProps,
  ValueContainerProps,
} from "react-select";
import { cn } from "~/utils/cn";

export const SelectContainer = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: ContainerProps<Option, IsMulti, Group>
) => {
  const {
    children,
    className,
    innerProps,
    isDisabled,
    isRtl,
    hasValue,
    selectProps: { maxW, minW, w },
  } = props;

  return (
    <div
      {...innerProps}
      className={clsx(
        "relative",
        {
          rtl: isRtl,
          "cursor-not-allowed": isDisabled,
          "--is-disabled": isDisabled,
          "--is-rtl": isRtl,
          "--has-value": hasValue,
        },
        className
      )}
      style={{
        maxWidth: maxW,
        minWidth: minW,
        width: w,
      }}
    >
      {children}
    </div>
  );
};

const valueContainerVariants = cva(
  "flex items-center flex-1 py-0.5 flex-wrap relative overflow-hidden value-container",
  {
    variants: {
      size: {
        lg: "px-4 text-lg",
        md: "px-4 text-base",
        sm: "px-3 text-sm",
      },
      isReadOnly: {
        true: "bg-muted",
      },
      isMulti: {
        true: "value-container--is-multi",
      },
      hasValue: {
        true: "value-container--has-value",
      },
    },
    defaultVariants: {
      size: "md",
      isReadOnly: false,
      isMulti: false,
    },
  }
);

export const ValueContainer = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: ValueContainerProps<Option, IsMulti, Group>
) => {
  const {
    children,
    className,
    isMulti,
    hasValue,
    innerProps,
    selectProps: { size, isReadOnly },
  } = props;

  return (
    <div
      {...innerProps}
      className={cn(
        valueContainerVariants({ size, isReadOnly, isMulti, hasValue }),
        className
      )}
    >
      {children}
    </div>
  );
};

export const IndicatorsContainer = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: IndicatorsContainerProps<Option, IsMulti, Group>
) => {
  const {
    children,
    className,
    innerProps,
    selectProps: { isReadOnly },
  } = props;

  return (
    <div
      {...innerProps}
      className={clsx(
        "flex items-center self-stretch shrink-0 indicators",
        {
          "bg-muted": isReadOnly,
        },
        className
      )}
    >
      {children}
    </div>
  );
};
