import { Button, HStack, Select } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
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
  const employeeTypeOptions = employeeTypes?.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  return (
    <HStack
      className="px-4 py-3 justify-between border-b border-border w-full"
      spacing={4}
    >
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
        <Select
          size="sm"
          value={employeeTypeOptions.find(
            (type) => type.value === params.get("type")
          )}
          isClearable
          options={employeeTypeOptions}
          onChange={(selected) => {
            setParams({ type: selected?.value });
          }}
          aria-label="Employee Type"
          placeholder="Employee Type"
        />
        <Select
          // @ts-ignore
          size="sm"
          value={
            params.get("active") === "false"
              ? { value: "false", label: "Inactive" }
              : { value: "true", label: "Active" }
          }
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
            setParams({ active: selected?.value });
          }}
          aria-label="Active"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "users") && (
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={`${path.to.newEmployee}?${params.toString()}`}>
              New Employee
            </Link>
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default PeopleTableFilters;
