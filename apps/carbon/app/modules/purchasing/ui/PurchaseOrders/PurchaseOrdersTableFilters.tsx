import { HStack } from "@carbon/react";
import { Combobox, New, Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { purchaseOrderStatusType } from "~/modules/purchasing";
import { useSuppliers } from "~/stores";
import { path } from "~/utils/path";

const PurchaseOrdersTableFilters = () => {
  const [suppliers] = useSuppliers();
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const supplierOptions = suppliers
    .filter((supplier) => supplier.id && supplier.name)
    .map((supplier) => ({
      label: supplier.name,
      value: supplier.id,
    }));

  const purchaseOrderStatusOptions = purchaseOrderStatusType.map((status) => ({
    label: status,
    value: status,
  }));

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="search" size="sm" placeholder="Search" />
        <Select
          size="sm"
          value={params.get("status") ?? ""}
          isClearable
          options={purchaseOrderStatusOptions}
          onChange={(selected) => {
            setParams({ status: selected });
          }}
          aria-label="Status"
          placeholder="Status"
        />
        <Combobox
          size="sm"
          value={params.get("supplierId") ?? ""}
          isClearable
          options={supplierOptions}
          onChange={(selected) => {
            setParams({ supplierId: selected });
          }}
          aria-label="Supplier"
          placeholder="Supplier"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "purchasing") && (
          <New label="Purchase Order" to={path.to.newPurchaseOrder} />
        )}
      </HStack>
    </TableFilters>
  );
};

export default PurchaseOrdersTableFilters;
