import { HStack } from "@carbon/react";
import { New } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

const LocationsTableFilters = () => {
  const [params] = useUrlParams();
  const permissions = usePermissions();

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
      </HStack>
      <HStack>
        {permissions.can("create", "resources") && (
          <New label="Location" to={`new?${params.toString()}`} />
        )}
      </HStack>
    </TableFilters>
  );
};

export default LocationsTableFilters;
