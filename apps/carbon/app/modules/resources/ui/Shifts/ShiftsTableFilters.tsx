import { HStack } from "@carbon/react";
import { Combobox, New } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { ShiftLocation } from "~/modules/resources";

type ShiftsTableFiltersProps = {
  locations: Partial<ShiftLocation>[];
};

const ShiftsTableFilters = ({ locations }: ShiftsTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const locationOptions =
    locations?.map<{ value: string; label: string }>((location) => ({
      value: location.id!,
      label: location.name!,
    })) ?? [];

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
        <Combobox
          size="sm"
          value={params.get("location") ?? ""}
          isClearable
          options={locationOptions}
          onChange={(selected) => {
            setParams({ location: selected });
          }}
          aria-label="Location"
          placeholder="Location"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "resources") && (
          <New label="Shift" to={`new?${params.toString()}`} />
        )}
      </HStack>
    </TableFilters>
  );
};

export default ShiftsTableFilters;
