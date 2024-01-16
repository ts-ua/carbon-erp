import { HStack } from "@carbon/react";
import { Combobox } from "~/components";
import { TableFilters } from "~/components/Layout";
import { useUrlParams } from "~/hooks";
import type { ListItem } from "~/types";

type SalesPostingGroupsFiltersProps = {
  partGroups: ListItem[];
  customerTypes: ListItem[];
};

const SalesPostingGroupsFilters = ({
  partGroups,
  customerTypes,
}: SalesPostingGroupsFiltersProps) => {
  const [params, setParams] = useUrlParams();

  const partGroupOptions = partGroups.map((partGroup) => ({
    label: partGroup.name,
    value: partGroup.id,
  }));

  const customerTypeOptions = customerTypes.map((customerType) => ({
    label: customerType.name,
    value: customerType.id,
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
          value={params.get("customerType") ?? ""}
          options={customerTypeOptions}
          onChange={(selected) => {
            setParams({ customerType: selected });
          }}
          placeholder="Customer Type"
        />
      </HStack>
    </TableFilters>
  );
};

export default SalesPostingGroupsFilters;
