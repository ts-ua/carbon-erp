import { HStack } from "@carbon/react";
import { DebouncedInput } from "~/components/Search";

const SequencesTableFilters = () => {
  return (
    <HStack className="px-4 py-3 justify-between border-b border-border w-full">
      <HStack>
        <DebouncedInput
          param="name"
          size="sm"
          minW={180}
          placeholder="Search"
        />
      </HStack>
    </HStack>
  );
};

export default SequencesTableFilters;
