import { Button, HStack, Select } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { accountClassTypes, incomeBalanceTypes } from "~/modules/accounting";

const AttributeCategoriesTableFilters = () => {
  const permissions = usePermissions();
  const [params, setParams] = useUrlParams();

  return (
    <HStack
      spacing={4}
      className="px-4 py-3 justify-between border-b border-border w-full"
    >
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
        <Select
          size="sm"
          placeholder="Income Balance"
          value={incomeBalanceTypes
            .map((incomeBalance) => ({
              value: incomeBalance,
              label: incomeBalance,
            }))
            .filter((type) => type.value === params.get("incomeBalance"))}
          isClearable
          options={incomeBalanceTypes.map((incomeBalance) => ({
            value: incomeBalance,
            label: incomeBalance,
          }))}
          onChange={(selected) => {
            setParams({ incomeBalance: selected?.value });
          }}
        />
        <Select
          size="sm"
          placeholder="Normal Balance"
          value={accountClassTypes
            .map((accountClass) => ({
              value: accountClass,
              label: accountClass,
            }))
            .filter((type) => type.value === params.get("accountClass"))}
          isClearable
          options={accountClassTypes.map((accountClass) => ({
            value: accountClass,
            label: accountClass,
          }))}
          onChange={(selected) => {
            setParams({ accountClass: selected?.value });
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
    </HStack>
  );
};

export default AttributeCategoriesTableFilters;
