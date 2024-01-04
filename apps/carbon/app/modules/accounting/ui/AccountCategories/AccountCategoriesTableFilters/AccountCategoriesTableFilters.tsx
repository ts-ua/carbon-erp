import { Button, HStack } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { accountClassTypes, incomeBalanceTypes } from "~/modules/accounting";

const AccountCategoriesTableFilters = () => {
  const permissions = usePermissions();
  const [params, setParams] = useUrlParams();

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
        <Select
          size="sm"
          placeholder="Income Balance"
          value={params.get("incomeBalance") ?? ""}
          isClearable
          options={incomeBalanceTypes.map((incomeBalance) => ({
            value: incomeBalance,
            label: incomeBalance,
          }))}
          onChange={(selected) => {
            setParams({ incomeBalance: selected });
          }}
        />
        <Select
          size="sm"
          placeholder="Account Class"
          value={params.get("accountClass") ?? ""}
          isClearable
          options={accountClassTypes.map((accountClass) => ({
            value: accountClass,
            label: accountClass,
          }))}
          onChange={(selected) => {
            setParams({ accountClass: selected });
          }}
        />
      </HStack>
      <HStack>
        {permissions.can("update", "resources") && (
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={`new?${params.toString()}`}>New Account Category</Link>
          </Button>
        )}
      </HStack>
    </TableFilters>
  );
};

export default AccountCategoriesTableFilters;
