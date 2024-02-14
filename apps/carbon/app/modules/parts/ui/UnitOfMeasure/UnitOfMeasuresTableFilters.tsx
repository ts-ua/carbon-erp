import { HStack } from "@carbon/react";
import { New } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

const UnitOfMeasuresTableFilters = () => {
  const [params] = useUrlParams();
  const permissions = usePermissions();
  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
      </HStack>
      <HStack>
        {permissions.can("create", "parts") && (
          <New label="Unit of Measure" to={`new?${params.toString()}`} />
        )}
      </HStack>
    </TableFilters>
  );
};

export default UnitOfMeasuresTableFilters;
