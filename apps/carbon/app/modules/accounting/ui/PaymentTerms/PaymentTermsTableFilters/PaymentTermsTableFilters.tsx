import { HStack } from "@carbon/react";
import { Button } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

const PaymentTermsTableFilters = () => {
  const [params] = useUrlParams();
  const permissions = usePermissions();

  return (
    <HStack spacing={4} className="px-4 py-3 justify-between border-b w-full">
      <HStack>
        <DebouncedInput
          param="name"
          size="sm"
          minW={180}
          placeholder="Search"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "accounting") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Payment Term
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default PaymentTermsTableFilters;
