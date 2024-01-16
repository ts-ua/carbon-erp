import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack,
} from "@carbon/react";
import { useNavigate, useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import {
  DatePicker,
  Hidden,
  Input,
  Phone,
  Submit,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { customerContactValidator } from "~/modules/sales";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type CustomerContactFormProps = {
  initialValues: TypeOfValidator<typeof customerContactValidator>;
};

const CustomerContactForm = ({ initialValues }: CustomerContactFormProps) => {
  const navigate = useNavigate();
  const { customerId } = useParams();

  if (!customerId) throw new Error("customerId not found");

  const permissions = usePermissions();
  const isEditing = !!initialValues?.id;
  const isDisabled = isEditing
    ? !permissions.can("update", "sales")
    : !permissions.can("create", "sales");

  const onClose = () => navigate(path.to.customerContacts(customerId));

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={customerContactValidator}
          method="post"
          action={
            isEditing
              ? path.to.customerContact(customerId, initialValues.id!)
              : path.to.newCustomerContact(customerId)
          }
          defaultValues={initialValues}
          onSubmit={onClose}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Edit" : "New"} Contact</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <Hidden name="contactId" />
            <VStack spacing={4}>
              <Input name="firstName" label="First Name" />
              <Input name="lastName" label="Last Name" />
              <Input name="email" label="Email" />
              <Input name="title" label="Title" />
              <Phone name="mobilePhone" label="Mobile Phone" />
              <Phone name="homePhone" label="Home Phone" />
              <Phone name="workPhone" label="Work Phone" />
              <Phone name="fax" label="Fax" />
              <Input name="addressLine1" label="Address Line 1" />
              <Input name="addressLine2" label="Address Line 2" />
              <Input name="city" label="City" />
              <Input name="state" label="State" />
              <Input name="postalCode" label="Zip Code" />
              {/* Country dropdown */}
              <DatePicker name="birthday" label="Birthday" />
              <TextArea name="notes" label="Notes" />
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

export default CustomerContactForm;
