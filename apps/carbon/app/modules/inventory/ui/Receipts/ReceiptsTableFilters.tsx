import { HStack } from "@carbon/react";
import { Combobox, New } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { receiptSourceDocumentType } from "~/modules/inventory";
import type { ListItem } from "~/types";

type ReceiptsTableFiltersProps = {
  locations: ListItem[];
};

const ReceiptsTableFilters = ({ locations }: ReceiptsTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const sourceDocumentOptions = receiptSourceDocumentType.map((type) => ({
    label: type,
    value: type,
  }));

  const locationOptions = locations.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="search" size="sm" placeholder="Search" />
        <Combobox
          size="sm"
          value={params.get("document") ?? ""}
          isClearable
          options={sourceDocumentOptions}
          onChange={(selected) => {
            setParams({ document: selected });
          }}
          aria-label="Source Document"
          placeholder="Source Document"
        />
        <Combobox
          size="sm"
          value={params.get("location") ?? ""}
          isClearable
          options={locationOptions}
          onChange={(selected) => {
            setParams({ location: selected });
          }}
          placeholder="Location"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "inventory") && (
          <New label="Receipt" to={`new?${params.toString()}`} />
        )}
      </HStack>
    </TableFilters>
  );
};

export default ReceiptsTableFilters;
