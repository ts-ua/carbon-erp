import { Button, HStack } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
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
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={`new?${params.toString()}`}>New Attribute Category</Link>
          </Button>
        )}
      </HStack>
    </TableFilters>
  );
};

export default AttributeCategoriesTableFilters;
