import { HStack } from "@carbon/react";
import { New } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

const AttributeCategoriesTableFilters = () => {
  const permissions = usePermissions();
  const [params] = useUrlParams();

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
      </HStack>
      <HStack>
        {permissions.can("update", "resources") && (
          <New label="Attribute Category" to={`new?${params.toString()}`} />
        )}
      </HStack>
    </TableFilters>
  );
};

export default AttributeCategoriesTableFilters;
