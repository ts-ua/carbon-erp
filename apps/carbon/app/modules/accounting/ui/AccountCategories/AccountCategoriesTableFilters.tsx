import { HStack } from "@carbon/react";
import { New, Select } from "~/components";
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
          <New label="Account Category" to={`new?${params.toString()}`} />
        )}
      </HStack>
    </TableFilters>
  );
};

export default AccountCategoriesTableFilters;
