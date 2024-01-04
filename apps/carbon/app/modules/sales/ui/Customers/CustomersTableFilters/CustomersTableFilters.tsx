import { Button, HStack } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { Combobox, Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { CustomerStatus, CustomerType } from "~/modules/sales";
import { path } from "~/utils/path";

type CustomersTableFiltersProps = {
  customerTypes: Partial<CustomerType>[];
  customerStatuses: CustomerStatus[];
};

const CustomersTableFilters = ({
  customerTypes,
  customerStatuses,
}: CustomersTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const customerTypeOptions =
    customerTypes?.map<{ value: string; label: string }>((type) => ({
      value: type.id!,
      label: type.name!,
    })) ?? [];

  const customerStatusOptions =
    customerStatuses?.map((status) => ({
      value: status.id,
      label: status.name,
    })) ?? [];

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
        {customerTypeOptions.length > 0 && (
          <Combobox
            size="sm"
            value={params.get("type") ?? ""}
            isClearable
            options={customerTypeOptions}
            onChange={(selected) => {
              setParams({ type: selected });
            }}
            aria-label="Customer Type"
            placeholder="Customer Type"
          />
        )}
        {customerStatusOptions && (
          <Select
            size="sm"
            isClearable
            value={params.get("status") ?? ""}
            options={customerStatusOptions}
            onChange={(selected) => {
              setParams({ status: selected });
            }}
            aria-label="Status"
            placeholder="Customer Status"
          />
        )}
      </HStack>
      <HStack>
        {permissions.can("create", "sales") && (
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={`${path.to.newCustomer}?${params.toString()}`}>
              New Customer
            </Link>
          </Button>
        )}
      </HStack>
    </TableFilters>
  );
};

export default CustomersTableFilters;
