import { HStack } from "@carbon/react";
import { Combobox } from "~/components";
import { TableFilters } from "~/components/Layout";
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
    <TableFilters>
      <HStack>
        <Combobox
          size="sm"
          isClearable
          value={params.get("partGroup") ?? ""}
          options={partGroupOptions}
          onChange={(selected) => {
            setParams({ partGroup: selected });
          }}
          placeholder="Part Group"
        />
        <Combobox
          size="sm"
          isClearable
          value={params.get("location") ?? ""}
          options={locationOptions}
          onChange={(selected) => {
            setParams({ location: selected });
          }}
          placeholder="Location"
        />
      </HStack>
    </TableFilters>
  );
};

export default InventoryPostingGroupsFilters;
