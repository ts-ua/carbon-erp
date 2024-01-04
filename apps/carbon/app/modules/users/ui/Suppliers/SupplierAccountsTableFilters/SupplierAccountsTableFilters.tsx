import { Button, HStack } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { Combobox, Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { ListItem } from "~/types";

type SupplierAccountsTableFiltersProps = {
  supplierTypes: ListItem[];
};

const SupplierAccountsTableFilters = ({
  supplierTypes,
}: SupplierAccountsTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const supplierTypeOptions =
    supplierTypes?.map((type) => ({
      value: type.id,
      label: type.name,
    })) ?? [];

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
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
        <Select
          size="sm"
          value={params.get("active") === "false" ? "false" : "true"}
          options={[
            {
              value: "true",
              label: "Active",
            },
            {
              value: "false",
              label: "Inactive",
            },
          ]}
          onChange={(selected) => {
            setParams({ active: selected });
          }}
        />
      </HStack>
      <HStack>
        {permissions.can("create", "users") && (
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={`new?${params.toString()}`}>New Supplier</Link>
          </Button>
        )}
      </HStack>
    </TableFilters>
  );
};

export default SupplierAccountsTableFilters;
