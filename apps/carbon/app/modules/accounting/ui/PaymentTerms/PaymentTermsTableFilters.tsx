import { Button, HStack } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

const PaymentTermsTableFilters = () => {
  const [params] = useUrlParams();
  const permissions = usePermissions();

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
      </HStack>
      <HStack>
        {permissions.can("create", "accounting") && (
          <Button leftIcon={<IoMdAdd />}>
            <Link to={`new?${params.toString()}`}>New Payment Term</Link>
          </Button>
        )}
      </HStack>
    </TableFilters>
  );
};

export default PaymentTermsTableFilters;
