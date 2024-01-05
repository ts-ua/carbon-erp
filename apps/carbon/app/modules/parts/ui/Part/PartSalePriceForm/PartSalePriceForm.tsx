import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  VStack,
} from "@carbon/react";
import { Grid } from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import {
  Boolean,
  Combobox,
  Currency,
  Hidden,
  Number,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { UnitOfMeasureListItem } from "~/modules/parts";
import { partUnitSalePriceValidator } from "~/modules/parts";
import type { TypeOfValidator } from "~/types/validators";

type PartSalePriceFormProps = {
  initialValues: TypeOfValidator<typeof partUnitSalePriceValidator>;
  unitOfMeasures: UnitOfMeasureListItem[];
};

const PartSalePriceForm = ({
  initialValues,
  unitOfMeasures,
}: PartSalePriceFormProps) => {
  const permissions = usePermissions();

  const unitOfMeasureOptions = unitOfMeasures.map((unitOfMeasure) => ({
    label: unitOfMeasure.name,
    value: unitOfMeasure.code,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={partUnitSalePriceValidator}
      defaultValues={initialValues}
    >
      <Card>
        <CardHeader>
          <CardTitle>Sale Price</CardTitle>
        </CardHeader>
        <CardContent>
          <Hidden name="partId" />
          <Grid
            gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack>
              <Number name="unitSalePrice" label="Unit Sale Price" />
              <Currency name="currencyCode" label="Currency" />
            </VStack>
            <VStack>
              <Combobox
                name="salesUnitOfMeasureCode"
                label="Sales Unit of Measure"
                options={unitOfMeasureOptions}
              />
            </VStack>
            <VStack>
              <Boolean name="salesBlocked" label="Sales Blocked" />
              <Boolean name="priceIncludesTax" label="Price Includes Tax" />
              <Boolean
                name="allowInvoiceDiscount"
                label="Allow Invoice Discount"
              />
            </VStack>
          </Grid>
        </CardContent>
        <CardFooter>
          <Submit isDisabled={!permissions.can("update", "parts")}>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PartSalePriceForm;
