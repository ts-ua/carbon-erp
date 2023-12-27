import { HStack, Select } from "@carbon/react";
import { Button } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { SupplierType } from "~/modules/purchasing";

type SupplierAccountsTableFiltersProps = {
  supplierTypes: Partial<SupplierType>[];
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
    <HStack
      className="px-4 py-3 justify-between border-b border-border w-full"
      spacing={4}
    >
      <HStack>
        <DebouncedInput
          param="name"
          size="sm"
          minW={180}
          placeholder="Search"
        />
        <Select
          size="sm"
          value={supplierTypeOptions.find(
            (type) => type.value === params.get("type")
          )}
          isClearable
          options={supplierTypeOptions}
          onChange={(selected) => {
            setParams({ type: selected?.value });
          }}
          aria-label="Supplier Type"
          placeholder="Supplier Type"
        />
        <Select
          size="sm"
          value={
            params.get("active") === "false"
              ? { value: "false", label: "Inactive" }
              : { value: "true", label: "Active" }
          }
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
            setParams({ active: selected?.value });
          }}
          aria-label="Active"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "users") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Supplier
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default SupplierAccountsTableFilters;
