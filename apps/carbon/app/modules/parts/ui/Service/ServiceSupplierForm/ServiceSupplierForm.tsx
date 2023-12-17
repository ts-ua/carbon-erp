import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Input, Submit, Supplier } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { serviceSupplierValidator } from "~/modules/parts";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type ServiceSupplierFormProps = {
  initialValues: TypeOfValidator<typeof serviceSupplierValidator>;
};

const ServiceSupplierForm = ({ initialValues }: ServiceSupplierFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const { serviceId } = useParams();

  if (!serviceId) throw new Error("serviceId not found");

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "parts")
    : !permissions.can("create", "parts");

  const onClose = () => navigate(-1);

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        defaultValues={initialValues}
        validator={serviceSupplierValidator}
        method="post"
        action={
          isEditing
            ? path.to.serviceSupplier(serviceId, initialValues.id!)
            : path.to.newServiceSupplier(serviceId)
        }
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? "Edit" : "New"} Service Supplier
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <Hidden name="serviceId" />

            <VStack spacing={4} alignItems="start">
              <Supplier name="supplierId" label="Supplier" />
              <Input name="supplierServiceId" label="Supplier Service ID" />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button size="md" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </ValidatedForm>
    </Drawer>
  );
};

export default ServiceSupplierForm;
