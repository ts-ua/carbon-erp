import { useMount } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useMemo } from "react";
import type { getDepartmentsList } from "~/modules/resources";
import { path } from "~/utils/path";
import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

type DepartmentSelectProps = Omit<ComboboxProps, "options">;

const Department = (props: DepartmentSelectProps) => {
  const departmentFetcher =
    useFetcher<Awaited<ReturnType<typeof getDepartmentsList>>>();

  useMount(() => {
    departmentFetcher.load(path.to.api.departments);
  });

  const options = useMemo(
    () =>
      departmentFetcher.data?.data
        ? departmentFetcher.data?.data.map((c) => ({
            value: c.id,
            label: c.name,
          }))
        : [],
    [departmentFetcher.data]
  );

  return (
    <Combobox
      options={options}
      {...props}
      label={props?.label ?? "Department"}
    />
  );
};

Department.displayName = "Department";

export default Department;
