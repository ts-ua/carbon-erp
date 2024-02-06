import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  VStack,
  cn,
} from "@carbon/react";
import { ValidatedForm } from "remix-validated-form";
import { Employee, Hidden, Input, Select, Submit } from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import type { SupplierStatus, SupplierType } from "~/modules/purchasing";
import { supplierValidator } from "~/modules/purchasing";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type SupplierFormProps = {
  initialValues: TypeOfValidator<typeof supplierValidator>;
};

const SupplierForm = ({ initialValues }: SupplierFormProps) => {
  const permissions = usePermissions();

  const routeData = useRouteData<{
    supplierTypes: SupplierType[];
    supplierStatuses: SupplierStatus[];
  }>(path.to.supplierRoot);

  const supplierTypeOptions =
    routeData?.supplierTypes?.map((type) => ({
      value: type.id,
      label: type.name,
    })) ?? [];

  const supplierStatusOptions =
    routeData?.supplierStatuses?.map((status) => ({
      value: status.id,
      label: status.name,
    })) ?? [];

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  return (
    <ValidatedForm
      method="post"
      validator={supplierValidator}
      defaultValues={initialValues}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Supplier Overview" : "New Supplier"}
          </CardTitle>
          {!isEditing && (
            <CardDescription>
              A supplier is a business or person who sells you parts or
              services.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Hidden name="id" />
          <div
            className={cn(
              "grid w-full gap-x-8 gap-y-2",
              isEditing ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"
            )}
          >
            <VStack>
              <Input name="name" label="Name" />
              <Input name="taxId" label="Tax ID" />
            </VStack>
            <VStack>
              <Select
                name="supplierTypeId"
                label="Supplier Type"
                options={supplierTypeOptions}
                placeholder="Select Supplier Type"
              />
              <Select
                name="supplierStatusId"
                label="Supplier Status"
                options={supplierStatusOptions}
                placeholder="Select Supplier Status"
              />
            </VStack>
            {isEditing && (
              <>
                <VStack>
                  <Employee name="accountManagerId" label="Account Manager" />
                </VStack>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <HStack>
            <Submit isDisabled={isDisabled}>Save</Submit>
          </HStack>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default SupplierForm;
