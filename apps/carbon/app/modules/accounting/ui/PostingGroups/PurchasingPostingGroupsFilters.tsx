import { HStack, Select } from "@carbon/react";
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
    <HStack className="px-4 py-3 justify-between border-b w-full" spacing={4}>
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
        value={supplierTypeOptions.find(
          (supplierType) => supplierType.value === params.get("supplierType")
        )}
        options={supplierTypeOptions}
        onChange={(selected) => {
          setParams({ supplierType: selected?.value });
        }}
        aria-label="Supplier Type"
        placeholder="Supplier Type"
      />
    </HStack>
  );
};

export default PurchasingPostingGroupsFilters;
