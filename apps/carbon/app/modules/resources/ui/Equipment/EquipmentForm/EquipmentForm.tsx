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
  VStack,
} from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { ValidatedForm, useControlField, useField } from "remix-validated-form";
import {
  Hidden,
  Input,
  Location,
  Number,
  Select,
  Submit,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { getWorkCellList } from "~/modules/resources";
import { equipmentValidator } from "~/modules/resources";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type EquipmentFormProps = {
  initialValues: TypeOfValidator<typeof equipmentValidator>;
  equipmentTypes: {
    id: string;
    name: string;
  }[];
  onClose: () => void;
};

const EquipmentForm = ({
  initialValues,
  equipmentTypes,
  onClose,
}: EquipmentFormProps) => {
  const permissions = usePermissions();

  const options =
    equipmentTypes?.map((et) => ({
      value: et.id,
      label: et.name,
    })) ?? [];

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  const workCellFetcher =
    useFetcher<Awaited<ReturnType<typeof getWorkCellList>>>();
  const [location, setLocation] = useState<string | null>(
    initialValues.locationId ?? null
  );

  const onLocationChange = (location: { value: string | number } | null) => {
    setLocation((location?.value as string) ?? null);
  };

  useEffect(() => {
    if (location) {
      workCellFetcher.load(path.to.api.workCells(location));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const workCells = useMemo(
    () =>
      workCellFetcher.data?.data?.map((cell) => ({
        value: cell.id,
        label: cell.name,
      })) ?? [],
    [workCellFetcher.data]
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
          validator={equipmentValidator}
          method="post"
          action={
            isEditing
              ? path.to.equipmentUnit(initialValues.id!)
              : path.to.newEquipmentUnit
          }
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Edit" : "New"} Equipment</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <VStack spacing={4}>
              <Input name="name" label="Name" />
              <TextArea name="description" label="Description" />
              <Select
                name="equipmentTypeId"
                label="Equipment Type"
                options={options}
              />
              <Location
                name="locationId"
                label="Location"
                onChange={onLocationChange}
              />
              <WorkCellsByLocation
                workCells={workCells}
                initialWorkCell={initialValues.workCellId ?? undefined}
              />
              <Number
                name="setupHours"
                label="Setup Hours"
                min={0}
                max={100} // this seems like a reasonable max?
              />
              <Number
                name="operatorsRequired"
                label="Operators Required"
                min={0}
                max={100} // this seems like a reasonable max?
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

const WORK_CELL_FIELD = "workCellId";

const WorkCellsByLocation = ({
  workCells,
  initialWorkCell,
}: {
  workCells: { value: string | number; label: string }[];
  initialWorkCell?: string;
}) => {
  const { error, getInputProps } = useField(WORK_CELL_FIELD);

  const [workCell, setWorkCell] = useControlField<{
    value: string | number;
    label: string;
  } | null>(WORK_CELL_FIELD);

  useEffect(() => {
    // if the initial value is in the options, set it, otherwise set to null
    if (workCells) {
      setWorkCell(workCells.find((s) => s.value === initialWorkCell) ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workCells, initialWorkCell]);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={WORK_CELL_FIELD}>Work Cell</FormLabel>
      <Select
        {...getInputProps({
          // @ts-ignore
          id: WORK_CELL_FIELD,
        })}
        options={workCells}
        // @ts-ignore
        value={workCell}
        onChange={setWorkCell}
        w="full"
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default EquipmentForm;
