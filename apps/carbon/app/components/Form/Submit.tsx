import type { ButtonProps } from "@carbon/react";
import { Button } from "@carbon/react";
import type { PropsWithChildren } from "react";
import { useIsSubmitting } from "remix-validated-form";

export const Submit = ({
  formId,
  children,
  ...props
}: PropsWithChildren<ButtonProps & { formId?: string; text?: string }>) => {
  const isSubmitting = useIsSubmitting(formId);
  return (
    <Button
      form={formId}
      type="submit"
      isLoading={isSubmitting}
      isDisabled={isSubmitting}
      {...props}
    >
      {children}
    </Button>
  );
};

export default Submit;
