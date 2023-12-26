import { HStack, Select } from "@carbon/react";
import { Button } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams, useUser } from "~/hooks";
import { receiptSourceDocumentType } from "~/modules/inventory";
import type { ListItem } from "~/types";

type ReceiptsTableFiltersProps = {
  locations: ListItem[];
};

const ReceiptsTableFilters = ({ locations }: ReceiptsTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const {
    defaults: { locationId },
  } = useUser();

  const sourceDocumentOptions = receiptSourceDocumentType.map((type) => ({
    label: type,
    value: type,
  }));

  const locationOptions = locations.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  return (
    <HStack className="px-4 py-3 justify-between border-b w-full" spacing={4}>
      <HStack>
        <DebouncedInput
          param="search"
          size="sm"
          minW={180}
          placeholder="Search"
        />
        <Select
          size="sm"
          value={sourceDocumentOptions.find(
            (document) => document.value === params.get("document")
          )}
          isClearable
          options={sourceDocumentOptions}
          onChange={(selected) => {
            setParams({ document: selected?.value });
          }}
          aria-label="Source Document"
          placeholder="Source Document"
        />
        <Select
          size="sm"
          value={
            params.get("location")
              ? locationOptions.find(
                  (location) => location.value === params.get("location")
                )
              : locationOptions.find(
                  (location) => location.value === locationId
                )
          }
          options={locationOptions}
          onChange={(selected) => {
            setParams({ location: selected?.value });
          }}
          aria-label="Location"
          placeholder="Location"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "inventory") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Receipt
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default ReceiptsTableFilters;
