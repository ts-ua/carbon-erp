import { HStack } from "@carbon/react";
import { Combobox, New, Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { purchaseInvoiceStatusType } from "~/modules/invoicing";
import { useSuppliers } from "~/stores";
import { path } from "~/utils/path";

const PurchaseInvoicesTableFilters = () => {
  const [suppliers] = useSuppliers();
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const supplierOptions = suppliers
    .filter((supplier) => supplier.id && supplier.name)
    .map((supplier) => ({
      label: supplier.name,
      value: supplier.id,
    }));

  const purchaseInvoiceStatusOptions = purchaseInvoiceStatusType.map(
    (status) => ({
      label: status,
      value: status,
    })
  );

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="search" size="sm" placeholder="Search" />
        <Select
          size="sm"
          value={params.get("status") ?? ""}
          isClearable
          options={purchaseInvoiceStatusOptions}
          onChange={(selected) => {
            setParams({ status: selected });
          }}
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
          placeholder="Supplier"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "invoicing") && (
          <New label="Purchase Invoice" to={path.to.newPurchaseInvoice} />
        )}
      </HStack>
    </TableFilters>
  );
};

export default PurchaseInvoicesTableFilters;
