import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  FormControl,
  FormErrorMessage,
  FormLabel,
  ReactSelect,
  VStack,
  useMount,
} from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { ValidatedForm, useControlField, useField } from "remix-validated-form";
import {
  DatePicker,
  Employee,
  Hidden,
  Input,
  Location,
  Submit,
} from "~/components/Form";
import type { EmployeeJob, getShiftsList } from "~/modules/resources";
import { employeeJobValidator } from "~/modules/resources";
import { path } from "~/utils/path";

type PersonJobProps = {
  job: EmployeeJob;
};

const PersonJob = ({ job }: PersonJobProps) => {
  const shiftFetcher = useFetcher<Awaited<ReturnType<typeof getShiftsList>>>();

  const onLocationChange = (selected: { value: string | number } | null) => {
    if (selected?.value)
      shiftFetcher.load(path.to.api.shifts(`${selected.value}`));
  };

  useMount(() => {
    if (job.locationId) shiftFetcher.load(path.to.api.shifts(job.locationId));
  });

  const shifts = useMemo(
    () =>
      shiftFetcher.data?.data?.map((shift) => ({
        value: shift.id,
        label: shift.name,
      })) ?? [],
    [shiftFetcher.data]
  );

  return (
    <ValidatedForm
      validator={employeeJobValidator}
      method="post"
      defaultValues={{
        locationId: job.locationId ?? undefined,
        title: job.title ?? undefined,
        startDate: job.startDate ?? undefined,
        managerId: job.managerId ?? undefined,
        shiftId: job.shiftId ?? undefined,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Job</CardTitle>
        </CardHeader>
        <CardContent>
          <VStack spacing={4}>
            <Input name="title" label="Title" />
            <DatePicker name="startDate" label="Start Date" />
            <Location
              name="locationId"
              label="Location"
              onChange={onLocationChange}
            />
            <ShiftByLocation
              shifts={shifts}
              initialShift={job.shiftId ?? undefined}
            />
            <Employee name="managerId" label="Manager" />
            <Hidden name="intent" value="job" />
          </VStack>
        </CardContent>
        <CardFooter>
          <Submit>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

const SHIFT_FIELD = "shiftId";

const ShiftByLocation = ({
  shifts,
  initialShift,
}: {
  shifts: { value: string | number; label: string }[];
  initialShift?: string;
}) => {
  const { error, getInputProps } = useField(SHIFT_FIELD);

  const [shift, setShift] = useControlField<{
    value: string | number;
    label: string;
  } | null>(SHIFT_FIELD);

  useEffect(() => {
    // if the initial value is in the options, set it, otherwise set to null
    if (shifts) {
      setShift(shifts.find((s) => s.value === initialShift) ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shifts, initialShift]);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={SHIFT_FIELD}>Shift</FormLabel>
      <ReactSelect
        {...getInputProps({
          // @ts-ignore
          id: SHIFT_FIELD,
        })}
        options={shifts}
        value={shift}
        onChange={setShift}
        // @ts-ignore
        w="full"
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default PersonJob;
