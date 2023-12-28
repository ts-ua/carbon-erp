import { Button, HStack, Select } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
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
    <HStack
      className="px-4 py-3 justify-between border-b border-border w-full"
      spacing={4}
    >
      <HStack>
        <DebouncedInput
          param="search"
          size="sm"
          minW={180}
          placeholder="Search Services"
        />
        {partGroupsOptions.length > 0 && (
          <Select
            size="sm"
            isClearable
            value={partGroupsOptions.find(
              (type) => type.value === params.get("group")
            )}
            options={partGroupsOptions}
            onChange={(selected) => {
              setParams({ group: selected?.value });
            }}
            aria-label="Groups"
            placeholder="Service Groups"
          />
        )}
        {serviceTypeOptions.length > 0 && (
          <Select
            size="sm"
            value={serviceTypeOptions.find(
              (type) => type.value === params.get("type")
            )}
            isClearable
            options={serviceTypeOptions}
            onChange={(selected) => {
              setParams({ type: selected?.value });
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
    </HStack>
  );
};

export default ServicesTableFilters;
