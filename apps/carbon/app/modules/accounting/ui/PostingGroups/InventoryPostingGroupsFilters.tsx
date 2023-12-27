import { HStack, Select } from "@carbon/react";
import { useUrlParams } from "~/hooks";
import type { ListItem } from "~/types";

type InventoryPostingGroupsFiltersProps = {
  partGroups: ListItem[];
  locations: ListItem[];
};

const InventoryPostingGroupsFilters = ({
  partGroups,
  locations,
}: InventoryPostingGroupsFiltersProps) => {
  const [params, setParams] = useUrlParams();

  const partGroupOptions = partGroups.map((partGroup) => ({
    label: partGroup.name,
    value: partGroup.id,
  }));

  const locationOptions = locations.map((location) => ({
    label: location.name,
    value: location.id,
  }));

  return (
    <HStack
      className="px-4 py-3 justify-between border-b border-border w-full"
      spacing={4}
    >
      <Select
        size="sm"
        isClearable
        value={partGroupOptions.find(
          (partGroup) => partGroup.value === params.get("partGroup")
        )}
        options={partGroupOptions}
        onChange={(selected) => {
          setParams({ partGroup: selected?.value });
        }}
        aria-label="Part Group"
        placeholder="Part Group"
      />
      <Select
        size="sm"
        isClearable
        value={locationOptions.find(
          (location) => location.value === params.get("location")
        )}
        options={locationOptions}
        onChange={(selected) => {
          setParams({ location: selected?.value });
        }}
        aria-label="Location"
        placeholder="Location"
      />
    </HStack>
  );
};

export default InventoryPostingGroupsFilters;
