import { Button, HStack } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { Combobox, Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { quoteStatusType } from "~/modules/sales";
import { useCustomers, useParts } from "~/stores";
import { path } from "~/utils/path";

const QuotesTableFilters = () => {
  const [customers] = useCustomers();
  const [parts] = useParts();
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const customerOptions = customers
    .filter((customer) => customer.id && customer.name)
    .map((customer) => ({
      label: customer.name,
      value: customer.id,
    }));

  const partOptions = parts
    .filter((part) => part.id && part.name)
    .map((part) => ({
      label: part.name,
      value: part.id,
    }));

  const quoteStatusOptions = quoteStatusType.map((status) => ({
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
          options={quoteStatusOptions}
          onChange={(selected) => {
            setParams({ status: selected });
          }}
          aria-label="Status"
          placeholder="Status"
        />
        <Combobox
          size="sm"
          value={params.get("customerId") ?? ""}
          isClearable
          options={customerOptions}
          onChange={(selected) => {
            setParams({ customerId: selected });
          }}
          aria-label="Customer"
          placeholder="Customer"
        />
        <Combobox
          size="sm"
          value={params.get("partId") ?? ""}
          isClearable
          options={partOptions}
          onChange={(selected) => {
            setParams({ partId: selected });
          }}
          aria-label="Part"
          placeholder="Part"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "sales") && (
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={path.to.newQuote}>New Quote</Link>
          </Button>
        )}
      </HStack>
    </TableFilters>
  );
};

export default QuotesTableFilters;
