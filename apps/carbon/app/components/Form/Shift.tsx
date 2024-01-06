import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { path } from "~/utils/path";

import type { getShiftsList } from "~/modules/resources";
import type { SelectProps } from "./Select";
import Select from "./Select";

type ShiftSelectProps = Omit<SelectProps, "options"> & {
  location?: string;
};

const Shift = (props: ShiftSelectProps) => {
  const shiftFetcher = useFetcher<Awaited<ReturnType<typeof getShiftsList>>>();

  useEffect(() => {
    if (props?.location) {
      shiftFetcher.load(path.to.api.shifts(props.location));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location]);

  const options = useMemo(
    () =>
      shiftFetcher.data?.data?.map((c) => ({
        value: c.id,
        label: c.name,
      })) ?? [],

    [shiftFetcher.data]
  );

  return (
    <Select options={options} {...props} label={props?.label ?? "Shift"} />
  );
};

export default Shift;
