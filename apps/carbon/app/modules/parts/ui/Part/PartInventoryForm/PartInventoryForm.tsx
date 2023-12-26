import { HStack, Heading, Select, VStack } from "@carbon/react";
import { Card, CardBody, CardFooter, CardHeader, Grid } from "@chakra-ui/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { CreatableSelect, Hidden, Number, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { PartQuantities } from "~/modules/parts";
import { partInventoryValidator } from "~/modules/parts";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type PartInventoryFormProps = {
  initialValues: Omit<
    TypeOfValidator<typeof partInventoryValidator>,
    "hasNewShelf"
  >;
  quantities: PartQuantities;
  locations: ListItem[];
  shelves: string[];
};

const PartInventoryForm = ({
  initialValues,
  locations,
  quantities,
  shelves,
}: PartInventoryFormProps) => {
  const permissions = usePermissions();
  const [hasNewShelf, setHasNewShelf] = useState(false);
  const shelfOptions = shelves.map((shelf) => ({ value: shelf, label: shelf }));
  const locationOptions = locations.map((location) => ({
    label: location.name,
    value: location.id,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={partInventoryValidator}
      defaultValues={{ ...quantities, ...initialValues }}
    >
      <Card w="full">
        <CardHeader>
          <HStack className="w-full justify-between">
            <Heading size="h3">Inventory</Heading>
            <div className="w-[180px]">
              <Select
                // @ts-ignore
                size="sm"
                value={locationOptions.find(
                  (location) => location.value === initialValues.locationId
                )}
                options={locationOptions}
                onChange={(selected) => {
                  // hard refresh because initialValues update has no effect otherwise
                  window.location.href = `${path.to.partInventory(
                    initialValues.partId
                  )}?location=${selected?.value}`;
                }}
              />
            </div>
          </HStack>
        </CardHeader>
        <CardBody>
          <Hidden name="partId" />
          <Hidden name="locationId" />
          <Hidden name="hasNewShelf" value={hasNewShelf.toString()} />
          <Grid
            gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack>
              <CreatableSelect
                options={shelfOptions}
                name="defaultShelfId"
                label="Default Shelf"
                onUsingCreatedChanged={setHasNewShelf}
                // @ts-ignore
                w="full"
              />
              <Number
                name="quantityOnHand"
                label="Quantity On Hand"
                isReadOnly
              />
            </VStack>
            <VStack>
              <Number
                name="quantityAvailable"
                label="Quantity Available"
                isReadOnly
              />
              <Number
                name="quantityOnPurchaseOrder"
                label="Quantity On Purchase Order"
                isReadOnly
              />
            </VStack>
            <VStack>
              <Number
                name="quantityOnProdOrder"
                label="Quantity On Prod Order"
                isReadOnly
              />
              <Number
                name="quantityOnSalesOrder"
                label="Quantity On Sales Order"
                isReadOnly
              />
            </VStack>
          </Grid>
        </CardBody>
        <CardFooter>
          <Submit isDisabled={!permissions.can("update", "parts")}>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PartInventoryForm;
