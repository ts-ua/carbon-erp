import { HStack } from "@carbon/react";
import { Combobox } from "~/components";
import { TableFilters } from "~/components/Layout";
import { useUrlParams } from "~/hooks";
import type { ListItem } from "~/types";

type PurchasingPostingGroupsFiltersProps = {
  partGroups: ListItem[];
  supplierTypes: ListItem[];
};

const PurchasingPostingGroupsFilters = ({
  partGroups,
  supplierTypes,
}: PurchasingPostingGroupsFiltersProps) => {
  const [params, setParams] = useUrlParams();

  const partGroupOptions = partGroups.map((partGroup) => ({
    label: partGroup.name,
    value: partGroup.id,
  }));

  const supplierTypeOptions = supplierTypes.map((supplierType) => ({
    label: supplierType.name,
    value: supplierType.id,
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
          value={params.get("supplierType") ?? ""}
          options={supplierTypeOptions}
          onChange={(selected) => {
            setParams({ supplierType: selected });
          }}
          placeholder="Supplier Type"
        />
      </HStack>
    </TableFilters>
  );
};

export default PurchasingPostingGroupsFilters;
