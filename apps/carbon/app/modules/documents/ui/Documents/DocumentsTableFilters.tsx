import { HStack } from "@carbon/react";
import { Combobox, Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { DocumentLabel } from "~/modules/documents/types";
import { capitalize } from "~/utils/string";
import DocumentCreateForm from "./DocumentCreateForm";

type DocumentTableFiltersProps = {
  labels: DocumentLabel[];
};

const documentTypeOptions = [
  "all",
  "document",
  "presentation",
  "spreadsheet",
  "image",
  "video",
  "audio",
].map((type) => ({
  label: capitalize(type),
  value: type,
}));

const DocumentsTableFilters = ({ labels }: DocumentTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const labelOptions = labels.map<{ label: string; value: string }>((l) => ({
    value: l.label!,
    label: l.label!,
  }));

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="search" size="sm" placeholder="Search" />
        <Select
          size="sm"
          value={params.get("type") ?? ""}
          isClearable
          options={documentTypeOptions}
          onChange={(selected) => {
            setParams({ type: selected });
          }}
          aria-label="Document Type"
          placeholder="Document Type"
        />
        {labels.length > 0 && (
          <Combobox
            size="sm"
            value={params.get("label") ?? ""}
            isClearable
            options={labelOptions}
            onChange={(selected) => {
              setParams({ label: selected });
            }}
            aria-label="Label"
            placeholder="Label"
          />
        )}
      </HStack>
      <HStack>
        {permissions.can("create", "documents") && <DocumentCreateForm />}
      </HStack>
    </TableFilters>
  );
};

export default DocumentsTableFilters;
