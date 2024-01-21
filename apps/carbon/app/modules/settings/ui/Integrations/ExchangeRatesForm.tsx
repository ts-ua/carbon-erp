import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "remix-validated-form";
import { Input, Submit } from "~/components/Form";
import { exchangeRatesMetadataValidator } from "~/modules/settings";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type ExchangeRatesFormProps = {
  initialValues: TypeOfValidator<typeof exchangeRatesMetadataValidator>;
  onClose: () => void;
};

const ExchangeRatesForm = ({
  initialValues,
  onClose,
}: ExchangeRatesFormProps) => {
  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={exchangeRatesMetadataValidator}
          method="post"
          action={path.to.integration("exchange-rates-v1")}
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>Exchange Rates Integration</DrawerTitle>
            <DrawerDescription>
              Updates the exchange rates using
              http://api.exchangeratesapi.io/v1/ three times per day
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <VStack>
              <Input name="apiKey" label="API Key" />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit>Save</Submit>
              <Button size="md" variant="solid" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </ValidatedForm>
      </DrawerContent>
    </Drawer>
  );
};

export default ExchangeRatesForm;
