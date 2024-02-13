import { HStack } from "@carbon/react";
import { Combobox, New, Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { partTypes } from "~/modules/parts";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";

type PartsTableFiltersProps = {
  partGroups: ListItem[];
};

const PartsTableFilters = ({ partGroups }: PartsTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const partTypeOptions = partTypes.map((type) => ({
    value: type,
    label: type,
  }));

  const partGroupsOptions = partGroups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="search" size="sm" placeholder="Search Parts" />
        {partGroupsOptions.length > 0 && (
          <Combobox
            size="sm"
            isClearable
            value={params.get("group") ?? ""}
            options={partGroupsOptions}
            onChange={(selected) => {
              setParams({ group: selected });
            }}
            aria-label="Groups"
            placeholder="Part Groups"
          />
        )}
        {partTypeOptions.length > 0 && (
          <Select
            size="sm"
            value={params.get("type") ?? ""}
            isClearable
            options={partTypeOptions}
            onChange={(selected) => {
              setParams({ type: selected });
            }}
            aria-label="Part Type"
            placeholder="Part Type"
          />
        )}
      </HStack>
      <HStack>
        {permissions.can("create", "parts") && (
          <New to={path.to.newPart} label="Part" />
        )}
      </HStack>
    </TableFilters>
  );
};

export default PartsTableFilters;
