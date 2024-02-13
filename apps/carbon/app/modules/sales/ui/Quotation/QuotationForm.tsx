import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  VStack,
  cn,
} from "@carbon/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Customer,
  CustomerContact,
  CustomerLocation,
  DatePicker,
  Employee,
  Hidden,
  Input,
  Location,
  Submit,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { quotationValidator } from "~/modules/sales";
import type { TypeOfValidator } from "~/types/validators";

type QuotationFormValues = TypeOfValidator<typeof quotationValidator>;

type QuotationFormProps = {
  initialValues: QuotationFormValues;
};

const QuotationForm = ({ initialValues }: QuotationFormProps) => {
  const permissions = usePermissions();
  const [customer, setCustomer] = useState<string | undefined>(
    initialValues.customerId
  );

  const isEditing = initialValues.id !== undefined;

  return (
    <ValidatedForm
      method="post"
      validator={quotationValidator}
      defaultValues={initialValues}
    >
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Quote" : "New Quote"}</CardTitle>
          {!isEditing && (
            <CardDescription>
              A quote is a document that provides a potential customer with a
              price for a product or service.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Hidden name="quoteId" />
          <VStack>
            <div
              className={cn(
                "grid w-full gap-x-8 gap-y-2",
                isEditing ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"
              )}
            >
              <VStack>
                <Customer
                  autoFocus
                  name="customerId"
                  label="Customer"
                  onChange={(value) => setCustomer(value?.value as string)}
                />
                <Input name="name" label="Name" />
                <Employee name="ownerId" label="Quoter" />
              </VStack>
              <VStack>
                <Location name="locationId" label="Location" />
                <CustomerLocation
                  name="customerLocationId"
                  label="Customer Location"
                  customer={customer}
                />
                <CustomerContact
                  name="customerContactId"
                  label="Customer Contact"
                  customer={customer}
                />
              </VStack>
              <VStack>
                {isEditing && (
                  <>
                    <DatePicker name="expirationDate" label="Expiration Date" />

                    <TextArea name="notes" label="Notes" />
                  </>
                )}
              </VStack>
            </div>
          </VStack>
        </CardContent>
        <CardFooter>
          <Submit
            isDisabled={
              isEditing
                ? !permissions.can("update", "sales")
                : !permissions.can("create", "sales")
            }
          >
            Save
          </Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default QuotationForm;
