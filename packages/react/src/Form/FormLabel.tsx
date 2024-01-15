import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "~/utils/cn";
import type { FormControlOptions } from "./FormControl";
import { useFormControlContext } from "./FormControl";

import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as ReactAria from "react-aria-components";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground",
  {
    variants: {
      isInvalid: {
        true: "text-destructive",
      },
    },
    defaultVariants: {
      isInvalid: false,
    },
  }
);

export interface FormLabelProps
  extends ComponentPropsWithoutRef<typeof ReactAria.Label>,
    Omit<VariantProps<typeof labelVariants>, "isInvalid">,
    FormControlOptions {}

export const FormLabel = forwardRef<
  ElementRef<typeof ReactAria.Label>,
  FormLabelProps
>((props, ref) => {
  const { className, children, ...rest } = props;

  const field = useFormControlContext();
  const labelProps = field?.getLabelProps(rest, ref) ?? { ref, ...rest };

  return (
    <ReactAria.Label
      {...labelProps}
      ref={ref}
      className={cn(labelVariants({ isInvalid: field?.isInvalid }), className)}
      {...props}
    >
      {children}
      {field?.isRequired && <span className="text-destructive"> *</span>}
    </ReactAria.Label>
  );
});

FormLabel.displayName = "FormLabel";
