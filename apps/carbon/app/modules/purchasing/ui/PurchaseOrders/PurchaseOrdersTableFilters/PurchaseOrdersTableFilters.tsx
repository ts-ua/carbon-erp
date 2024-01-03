import { Button, HStack, Select } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
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
    <HStack
      className="px-4 py-3 justify-between border-b border-border w-full"
      spacing={4}
    >
      <HStack>
        <DebouncedInput param="search" size="sm" placeholder="Search" />
        <Select
          size="sm"
          value={purchaseOrderStatusOptions.find(
            (type) => type.value === params.get("status")
          )}
          isClearable
          options={purchaseOrderStatusOptions}
          onChange={(selected) => {
            setParams({ status: selected?.value });
          }}
          aria-label="Status"
          placeholder="Status"
        />
        <Select
          size="sm"
          value={supplierOptions.find(
            (supplier) => supplier.value === params.get("supplierId")
          )}
          isClearable
          options={supplierOptions}
          onChange={(selected) => {
            setParams({ supplierId: selected?.value });
          }}
          aria-label="Supplier"
          placeholder="Supplier"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "purchasing") && (
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={path.to.newPurchaseOrder}>New Purchase Order</Link>
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default PurchaseOrdersTableFilters;
