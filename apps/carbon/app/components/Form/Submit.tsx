import type { ButtonProps } from "@carbon/react";
import { Button } from "@carbon/react";
import { forwardRef } from "react";
import { useIsSubmitting } from "remix-validated-form";

type SubmitProps = ButtonProps & { formId?: string; text?: string };

export const Submit = forwardRef<HTMLButtonElement, SubmitProps>(
  ({ formId, children, ...props }, ref) => {
    const isSubmitting = useIsSubmitting(formId);
    return (
      <Button
        ref={ref}
        form={formId}
        type="submit"
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
Submit.displayName = "Submit";
export default Submit;
