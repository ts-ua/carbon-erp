import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "remix-validated-form";
import { Boolean, Input, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { resendFormValidator } from "~/modules/settings";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type ResendFormProps = {
  initialValues: TypeOfValidator<typeof resendFormValidator>;
  onClose: () => void;
};

const ResendForm = ({ initialValues, onClose }: ResendFormProps) => {
  const permissions = usePermissions();
  const isDisabled = !permissions.can("update", "settings");

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={resendFormValidator}
          method="post"
          action={path.to.integration("resend")}
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>Resend</DrawerTitle>
            <DrawerDescription>
              Sends transactional emails with Resend API
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <Boolean name="active" label="Active" />
              <Input name="apiKey" label="API Key" />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button size="md" variant="solid" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </ValidatedForm>
      </DrawerContent>
    </Drawer>
  );
};

export default ResendForm;
