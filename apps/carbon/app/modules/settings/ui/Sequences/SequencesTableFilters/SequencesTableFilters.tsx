import { HStack } from "@carbon/react";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";

const SequencesTableFilters = () => {
  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
      </HStack>
    </TableFilters>
  );
};

export default SequencesTableFilters;
