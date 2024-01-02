import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "~/utils/cn";
import type { FormControlOptions } from "./FormControl";
import { useFormControlContext } from "./FormControl";

import * as LabelPrimitive from "@radix-ui/react-label";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

export interface FormLabelProps
  extends ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants>,
    FormControlOptions {}

export const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  FormLabelProps
>((props, ref) => {
  const { className, children, ...rest } = props;

  const field = useFormControlContext();
  const labelProps = field?.getLabelProps(rest, ref) ?? { ref, ...rest };

  return (
    <LabelPrimitive.Root
      {...labelProps}
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    >
      {children}
      {field?.isRequired && <span className="text-destructive"> *</span>}
    </LabelPrimitive.Root>
  );
});

FormLabel.displayName = "FormLabel";
