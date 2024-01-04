import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  ReactSelect,
  VStack,
  useMount,
} from "@carbon/react";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { ValidatedForm, useControlField, useField } from "remix-validated-form";
import { Abilities, Number, Submit, Supplier } from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { getSupplierLocations } from "~/modules/purchasing";
import { partnerValidator } from "~/modules/resources";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type PartnerFormProps = {
  initialValues: TypeOfValidator<typeof partnerValidator>;
};

const PartnerForm = ({ initialValues }: PartnerFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== "";
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  const supplierLocationFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierLocations>>>();

  const onSupplierChange = ({ value }: { value: string | number }) => {
    if (value)
      supplierLocationFetcher.load(path.to.api.supplierLocations(`${value}`));
  };

  useMount(() => {
    if (initialValues.supplierId)
      supplierLocationFetcher.load(
        path.to.api.supplierLocations(initialValues.supplierId)
      );
  });

  const supplierLocations = useMemo(
    () =>
      supplierLocationFetcher.data?.data?.map((loc) => ({
        value: loc.id,
        label: `${loc.address?.city}, ${loc.address?.state}`,
      })) ?? [],
    [supplierLocationFetcher.data]
  );

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={partnerValidator}
          method="post"
          action={
            isEditing ? path.to.partner(initialValues.id) : path.to.newPartner
          }
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Edit" : "New"} Partner</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <Supplier
                name="supplierId"
                label="Supplier"
                isReadOnly={isEditing}
                onChange={onSupplierChange}
              />
              <SupplierLocationsBySupplier
                supplierLocations={supplierLocations}
                initialLocation={initialValues.id}
                isReadOnly={isEditing}
              />
              <Abilities name="abilities" label="Abilities" />
              <Number
                name="hoursPerWeek"
                label="Hours per Week"
                helperText="The number of hours per week the supplier is available to work."
                min={0}
                max={10000}
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit isDisabled={isDisabled}>Save</Submit>
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

const SUPPLIER_LOCATION_FIELD = "id";

const SupplierLocationsBySupplier = ({
  supplierLocations,
  initialLocation,
  isReadOnly,
}: {
  supplierLocations: { value: string | number; label: string }[];
  initialLocation?: string;
  isReadOnly: boolean;
}) => {
  const { error, getInputProps } = useField(SUPPLIER_LOCATION_FIELD);

  const [supplierLocation, setSupplierLocation] = useControlField<{
    value: string | number;
    label: string;
  } | null>(SUPPLIER_LOCATION_FIELD);

  useEffect(() => {
    // if the initial value is in the options, set it, otherwise set to null
    if (supplierLocations) {
      setSupplierLocation(
        supplierLocations.find((s) => s.value === initialLocation) ?? null
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierLocations, initialLocation]);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={SUPPLIER_LOCATION_FIELD}>Supplier Location</FormLabel>
      <ReactSelect
        {...getInputProps({
          // @ts-ignore
          id: SUPPLIER_LOCATION_FIELD,
        })}
        options={supplierLocations}
        value={supplierLocation}
        onChange={setSupplierLocation}
        isReadOnly={isReadOnly}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default PartnerForm;
