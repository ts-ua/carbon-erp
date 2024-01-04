import { Button, HStack } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { Combobox, Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { serviceType } from "~/modules/parts";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";

type ServicesTableFiltersProps = {
  partGroups: ListItem[];
};

const ServicesTableFilters = ({ partGroups }: ServicesTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const serviceTypeOptions = serviceType.map((type) => ({
    value: type,
    label: type,
  }));

  const partGroupsOptions = partGroups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput
          param="search"
          size="sm"
          placeholder="Search Services"
        />
        {partGroupsOptions.length > 0 && (
          <Combobox
            size="sm"
            isClearable
            value={params.get("group") ?? ""}
            options={partGroupsOptions}
            onChange={(selected) => {
              setParams({ group: selected });
            }}
            aria-label="Groups"
            placeholder="Service Groups"
          />
        )}
        {serviceTypeOptions.length > 0 && (
          <Select
            size="sm"
            value={params.get("type") ?? ""}
            isClearable
            options={serviceTypeOptions}
            onChange={(selected) => {
              setParams({ type: selected });
            }}
            aria-label="Service Type"
            placeholder="Service Type"
          />
        )}
      </HStack>
      <HStack>
        {permissions.can("create", "parts") && (
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={path.to.newService}>New Service</Link>
          </Button>
        )}
      </HStack>
    </TableFilters>
  );
};

export default ServicesTableFilters;
