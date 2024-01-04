import { Button, HStack } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

const ShippingMethodsTableFilters = () => {
  const [params] = useUrlParams();
  const permissions = usePermissions();

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
      </HStack>
      <HStack>
        {permissions.can("create", "inventory") && (
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={`new?${params.toString()}`}>New Shipping Method</Link>
          </Button>
        )}
      </HStack>
    </TableFilters>
  );
};

export default ShippingMethodsTableFilters;
