import { Heading, HStack, VStack } from "@carbon/react";
import { Card, CardBody, CardFooter, CardHeader, Grid } from "@chakra-ui/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Currency,
  Customer,
  CustomerContact,
  CustomerLocation,
  Hidden,
  Select,
  Submit,
} from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import { customerPaymentValidator } from "~/modules/sales";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type CustomerPaymentFormProps = {
  initialValues: TypeOfValidator<typeof customerPaymentValidator>;
};

const CustomerPaymentForm = ({ initialValues }: CustomerPaymentFormProps) => {
  const permissions = usePermissions();
  const [customer, setCustomer] = useState<string | undefined>(
    initialValues.invoiceCustomerId
  );

  const routeData = useRouteData<{
    paymentTerms: ListItem[];
  }>(path.to.customerRoot);

  const paymentTermOptions =
    routeData?.paymentTerms?.map((term) => ({
      value: term.id,
      label: term.name,
    })) ?? [];

  const isDisabled = !permissions.can("update", "sales");

  return (
    <ValidatedForm
      method="post"
      validator={customerPaymentValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="h3">Customer Payment</Heading>
        </CardHeader>
        <CardBody>
          <Hidden name="customerId" />
          <Grid
            gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack>
              <Customer
                name="invoiceCustomerId"
                label="Invoice Customer"
                onChange={({ value }) => setCustomer(value as string)}
              />
              <CustomerLocation
                name="invoiceCustomerLocationId"
                label="Invoice Location"
                customer={customer}
              />
              <CustomerContact
                name="invoiceCustomerContactId"
                label="Invoice Contact"
                customer={customer}
              />
            </VStack>
            <VStack>
              <Select
                name="paymentTermId"
                label="Payment Term"
                options={paymentTermOptions}
              />
              <Currency name="currencyCode" label="Currency" />
            </VStack>
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

export default CustomerPaymentForm;
