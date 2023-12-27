import { VStack } from "@carbon/react";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { BsFilter, BsPlus } from "react-icons/bs";
import { useUrlParams } from "~/hooks";
import FilterRow from "./FilterRow";

type FilterProps = {
  columnAccessors: Record<string, string>;
};

const Filter = ({ columnAccessors }: FilterProps) => {
  const [params, setParams] = useUrlParams();
  const filters = params.getAll("filter");

  const addFilter = () => {
    const defaultFilter = `${Object.keys(columnAccessors)[0]}:contains:`;
    setParams({ filter: filters.concat(defaultFilter) });
  };

  const removeFilter = (filterIndex: number) => {
    setParams({
      filter: filters.filter((_, index) => index !== filterIndex),
    });
  };

  const updateFilter = (filterIndex: number, newFilter: string) => {
    setParams({
      filter: filters.map((filter, index) =>
        index === filterIndex ? newFilter : filter
      ),
    });
  };

  return (
    <Popover placement="bottom" closeOnBlur>
      <PopoverTrigger>
        <Button
          colorScheme={filters.length === 0 ? undefined : "brand"}
          variant={filters.length === 0 ? "ghost" : "solid"}
          leftIcon={<BsFilter />}
        >
          {filters.length === 0 ? "Filter" : "Filtered"}
        </Button>
      </PopoverTrigger>
      <PopoverContent w={480} boxShadow="xl">
        {filters.length === 0 && (
          <PopoverHeader>
            <p className="text-sm">No filters applied to this view</p>
            <p className="text-xs text-muted-foreground">
              Add a column below to sort the view
            </p>
          </PopoverHeader>
        )}
        <PopoverArrow />

        {filters.length > 0 && (
          <PopoverBody>
            <VStack>
              {filters.reduce<JSX.Element[]>((acc, filter, index) => {
                const [column, operator, searchValue] = filter.split(":");
                if (!column || !operator) return acc;
                acc.push(
                  <FilterRow
                    key={`filter-${column}-${[index]}`}
                    column={column}
                    columnAccessors={columnAccessors}
                    operator={operator}
                    searchValue={searchValue}
                    onRemove={() => removeFilter(index)}
                    onUpdate={(newFilter) => updateFilter(index, newFilter)}
                  />
                );
                return acc;
              }, [])}
            </VStack>
          </PopoverBody>
        )}
        <PopoverFooter>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<BsPlus />}
            onClick={addFilter}
          >
            Add Filter
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
