import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import {
  Boolean,
  Hidden,
  Input,
  Select,
  Submit,
  TextArea,
} from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import { serviceType, serviceValidator } from "~/modules/parts";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type ServiceFormProps = {
  initialValues: TypeOfValidator<typeof serviceValidator>;
};

const ServiceForm = ({ initialValues }: ServiceFormProps) => {
  const sharedData = useRouteData<{
    partGroups: ListItem[];
  }>(path.to.serviceRoot);

  const permissions = usePermissions();
  const isEditing = initialValues.id !== undefined;

  const partGroupOptions =
    sharedData?.partGroups.map((partGroup) => ({
      label: partGroup.name,
      value: partGroup.id,
    })) ?? [];

  const serviceTypeOptions =
    serviceType.map((type) => ({
      label: type,
      value: type,
    })) ?? [];

  return (
    <ValidatedForm
      method="post"
      validator={serviceValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">
            {isEditing ? "Service Details" : "New Service"}
          </Heading>
          {!isEditing && (
            <Text color="gray.500" fontWeight="normal">
              A service is an intangible activity that can be purchased or sold.
            </Text>
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
            <VStack alignItems="start" spacing={2} w="full">
              <Input name="name" label="Name" />
              <TextArea name="description" label="Description" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Select
                name="serviceType"
                label="Service Type"
                options={serviceTypeOptions}
              />
              <Select
                name="partGroupId"
                label="Part Group"
                options={partGroupOptions}
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Boolean name="blocked" label="Blocked" />
              {isEditing && <Boolean name="active" label="Active" />}
            </VStack>
          </Grid>
        </CardBody>
        <CardFooter>
          <Submit
            isDisabled={
              isEditing
                ? !permissions.can("update", "parts")
                : !permissions.can("create", "parts")
            }
          >
            Save
          </Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default ServiceForm;
