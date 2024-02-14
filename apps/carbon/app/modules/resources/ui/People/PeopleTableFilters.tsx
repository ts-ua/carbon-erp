import { HStack } from "@carbon/react";
import { Combobox, New, Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { EmployeeType } from "~/modules/users";
import { path } from "~/utils/path";

type PeopleTableFiltersProps = {
  employeeTypes: Partial<EmployeeType>[];
};

const PeopleTableFilters = ({ employeeTypes }: PeopleTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const employeeTypeOptions = employeeTypes?.map<{
    value: string;
    label: string;
  }>((type) => ({
    value: type.id!,
    label: type.name!,
  }));

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
        <Combobox
          size="sm"
          value={params.get("type") ?? ""}
          isClearable
          options={employeeTypeOptions}
          placeholder="Employee Type"
          onChange={(selected) => {
            setParams({ type: selected });
          }}
        />
        <Select
          size="sm"
          value={params.get("active") === "false" ? "false" : "true"}
          options={[
            {
              value: "true",
              label: "Active",
            },
            {
              value: "false",
              label: "Inactive",
            },
          ]}
          onChange={(selected) => {
            setParams({ active: selected });
          }}
          aria-label="Active"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "users") && (
          <New
            label="Employee"
            to={`${path.to.newEmployee}?${params.toString()}`}
          />
        )}
      </HStack>
    </TableFilters>
  );
};

export default PeopleTableFilters;
