import { Button, HStack } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { Combobox, Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { requestForQuoteStatusType } from "~/modules/purchasing";
import { useParts, useSuppliers } from "~/stores";
import { path } from "~/utils/path";

const RequestForQuotesTableFilters = () => {
  const [suppliers] = useSuppliers();
  const [parts] = useParts();
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const supplierOptions = suppliers
    .filter((supplier) => supplier.id && supplier.name)
    .map((supplier) => ({
      label: supplier.name,
      value: supplier.id,
    }));

  const partOptions = parts
    .filter((part) => part.id && part.name)
    .map((part) => ({
      label: part.name,
      value: part.id,
    }));

  const requestForQuoteStatusOptions = requestForQuoteStatusType.map(
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
          options={requestForQuoteStatusOptions}
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
        {permissions.can("create", "purchasing") && (
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={path.to.newRequestForQuote}>New RFQ</Link>
          </Button>
        )}
      </HStack>
    </TableFilters>
  );
};

export default RequestForQuotesTableFilters;
