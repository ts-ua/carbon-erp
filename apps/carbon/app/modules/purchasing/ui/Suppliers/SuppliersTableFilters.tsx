import { HStack } from "@carbon/react";
import { Combobox, New, Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { SupplierStatus, SupplierType } from "~/modules/purchasing";
import { path } from "~/utils/path";

type SuppliersTableFiltersProps = {
  supplierTypes: Partial<SupplierType>[];
  supplierStatuses: SupplierStatus[];
};

const SuppliersTableFilters = ({
  supplierTypes,
  supplierStatuses,
}: SuppliersTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const supplierTypeOptions =
    supplierTypes?.map<{ value: string; label: string }>((type) => ({
      value: type.id!,
      label: type.name!,
    })) ?? [];

  const supplierStatusOptions =
    supplierStatuses?.map((status) => ({
      value: status.id.toString(),
      label: status.name,
    })) ?? [];

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
        {supplierTypeOptions.length > 0 && (
          <Combobox
            size="sm"
            value={params.get("type") ?? ""}
            isClearable
            options={supplierTypeOptions}
            onChange={(selected) => {
              setParams({ type: selected });
            }}
            placeholder="Supplier Type"
          />
        )}
        {supplierStatusOptions && (
          <Select
            size="sm"
            isClearable
            value={params.get("status") ?? ""}
            options={supplierStatusOptions}
            onChange={(selected) => {
              setParams({ status: selected });
            }}
            placeholder="Supplier Status"
          />
        )}
      </HStack>
      <HStack>
        {permissions.can("create", "purchasing") && (
          <New label="Supplier" to={path.to.newSupplier} />
        )}
      </HStack>
    </TableFilters>
  );
};

export default SuppliersTableFilters;
