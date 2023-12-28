import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  VStack,
} from "@carbon/react";
import { Grid } from "@chakra-ui/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Boolean,
  Currency,
  Hidden,
  Select,
  Submit,
  Supplier,
  SupplierContact,
  SupplierLocation,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { purchaseOrderPaymentValidator } from "~/modules/purchasing";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";

type PurchaseOrderPaymentFormProps = {
  initialValues: TypeOfValidator<typeof purchaseOrderPaymentValidator>;
  paymentTerms: ListItem[];
};

const PurchaseOrderPaymentForm = ({
  initialValues,
  paymentTerms,
}: PurchaseOrderPaymentFormProps) => {
  const permissions = usePermissions();

  const [supplier, setSupplier] = useState<string | undefined>(
    initialValues.invoiceSupplierId
  );

  const paymentTermOptions = paymentTerms.map((term) => ({
    label: term.name,
    value: term.id,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={purchaseOrderPaymentValidator}
      defaultValues={initialValues}
    >
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Hidden name="id" />
          <Grid
            gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack>
              <Supplier
                name="invoiceSupplierId"
                label="Invoice Supplier"
                onChange={({ value }) => setSupplier(value as string)}
              />
              <SupplierLocation
                name="invoiceSupplierLocationId"
                label="Invoice Location"
                supplier={supplier}
              />
              <SupplierContact
                name="invoiceSupplierContactId"
                label="Invoice Contact"
                supplier={supplier}
              />
            </VStack>
            <VStack>
              <Select
                name="paymentTermId"
                label="Payment Terms"
                options={paymentTermOptions}
              />
              <Currency name="currencyCode" label="Currency" />
            </VStack>
            <VStack>
              <Boolean name="paymentComplete" label="Payment Complete" />
            </VStack>
          </Grid>
        </CardContent>
        <CardFooter>
          <Submit isDisabled={!permissions.can("update", "purchasing")}>
            Save
          </Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PurchaseOrderPaymentForm;
