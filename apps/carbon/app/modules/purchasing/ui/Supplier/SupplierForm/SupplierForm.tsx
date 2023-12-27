import { Heading, HStack, VStack } from "@carbon/react";
import { Card, CardBody, CardFooter, CardHeader, Grid } from "@chakra-ui/react";
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
      <Card w="full">
        <CardHeader>
          <Heading size="h3">
            {isEditing ? "Supplier Overview" : "New Supplier"}
          </Heading>
          {!isEditing && (
            <p className="text-muted-foreground font-normal">
              A supplier is a business or person who sells you parts or
              services.
            </p>
          )}
        </CardHeader>
        <CardBody>
          <Hidden name="id" />
          <Grid
            gridTemplateColumns={
              isEditing ? ["1fr", "1fr", "1fr 1fr 1fr"] : "1fr"
            }
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
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
          </Grid>
        </CardBody>
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
