import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "remix-validated-form";
import { Combobox } from "~/components";
import {
  Boolean,
  Hidden,
  Number,
  Select as SelectForm,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { partPlanningValidator, partReorderingPolicies } from "~/modules/parts";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type PartPlanningFormProps = {
  initialValues: TypeOfValidator<typeof partPlanningValidator>;
  locations: ListItem[];
};

const PartPlanningForm = ({
  initialValues,
  locations,
}: PartPlanningFormProps) => {
  const permissions = usePermissions();

  const locationOptions = locations.map((location) => ({
    label: location.name,
    value: location.id,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={partPlanningValidator}
      defaultValues={initialValues}
    >
      <Card>
        <HStack className="w-full justify-between items-start">
          <CardHeader>
            <CardTitle>Planning</CardTitle>
          </CardHeader>
          <CardAction>
            <Combobox
              size="sm"
              value={initialValues.locationId}
              options={locationOptions}
              onChange={(selected) => {
                // hard refresh because initialValues update has no effect otherwise
                window.location.href = `${path.to.partPlanning(
                  initialValues.partId
                )}?location=${selected}`;
              }}
            />
          </CardAction>
        </HStack>
        <CardContent>
          <Hidden name="partId" />
          <Hidden name="locationId" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 w-full">
            <VStack>
              <SelectForm
                name="reorderingPolicy"
                label="Reordering Policy"
                options={partReorderingPolicies.map((policy) => ({
                  label: policy,
                  value: policy,
                }))}
              />
              <Boolean name="critical" label="Critical" />
              <Number
                name="safetyStockQuantity"
                label="Safety Stock Quantity"
              />
              <Number
                name="safetyStockLeadTime"
                label="Safety Stock Lead Time (Days)"
              />
              <Number
                name="minimumOrderQuantity"
                label="Minimum Order Quantity"
              />
              <Number
                name="maximumOrderQuantity"
                label="Maximum Order Quantity"
              />
              <Number name="orderMultiple" label="Order Multiple" />
            </VStack>
            <VStack>
              <Number
                name="demandAccumulationPeriod"
                label="Demand Accumulation Period (Days)"
              />
              <Number
                name="demandReschedulingPeriod"
                label="Rescheduling Period (Days)"
              />
              <Boolean
                name="demandAccumulationIncludesInventory"
                label="Demand Includes Inventory"
              />
            </VStack>
            <VStack>
              <Number name="reorderPoint" label="Reorder Point" />
              <Number name="reorderQuantity" label="Reorder Quantity" />
              <Number
                name="reorderMaximumInventory"
                label="Reorder Maximum Inventory"
              />
            </VStack>
          </div>
        </CardContent>
        <CardFooter>
          <Submit isDisabled={!permissions.can("update", "parts")}>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PartPlanningForm;
