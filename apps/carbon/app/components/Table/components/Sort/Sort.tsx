import { HStack } from "@carbon/react";
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Switch,
} from "@chakra-ui/react";
import { Reorder } from "framer-motion";
import { BsChevronDown, BsListUl } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { MdOutlineDragIndicator } from "react-icons/md";
import { useSort } from "./useSort";

type SortProps = {
  columnAccessors: Record<string, string>;
};

const Sort = ({ columnAccessors }: SortProps) => {
  const {
    sorts,
    removeSortBy,
    reorderSorts,
    toggleSortBy,
    toggleSortByDirection,
  } = useSort();
  const hasNoSorts = sorts.length === 0;

  return (
    <Popover placement="bottom" closeOnBlur>
      <PopoverTrigger>
        <Button
          colorScheme={hasNoSorts ? undefined : "brand"}
          variant={hasNoSorts ? "ghost" : "solid"}
          leftIcon={<BsListUl />}
        >
          {hasNoSorts ? "Sort" : "Sorted"}
        </Button>
      </PopoverTrigger>
      <PopoverContent w={420} boxShadow="xl">
        {hasNoSorts && (
          <PopoverHeader>
            <p className="text-sm">No sorts applied to this view</p>
            <p className="text-xs text-muted-foreground">
              Add a column below to sort the view
            </p>
          </PopoverHeader>
        )}
        <PopoverArrow />
        {!hasNoSorts && (
          <PopoverBody>
            <Reorder.Group
              axis="y"
              values={sorts}
              onReorder={reorderSorts}
              className="space-y-2"
            >
              {sorts.map((sort) => {
                const [column, direction] = sort.split(":");
                return (
                  <Reorder.Item key={sort} value={sort} className="rounded-lg">
                    <HStack>
                      <IconButton
                        aria-label="Drag handle"
                        icon={<MdOutlineDragIndicator />}
                        variant="ghost"
                      />
                      <span className="text-sm flex-grow">
                        <>{columnAccessors[column] ?? ""}</>
                      </span>
                      <Switch
                        isChecked={direction === "asc"}
                        onChange={() => toggleSortByDirection(column)}
                      />
                      <span className="text-sm text-muted-foreground">
                        Ascending
                      </span>
                      <IconButton
                        aria-label="Remove sort by column"
                        icon={<IoMdClose />}
                        onClick={() => removeSortBy(sort)}
                        variant="ghost"
                      />
                    </HStack>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </PopoverBody>
        )}

        <PopoverFooter>
          <Menu isLazy>
            <MenuButton
              as={Button}
              rightIcon={<BsChevronDown />}
              colorScheme="gray"
              variant="outline"
            >
              Pick a column to sort by
            </MenuButton>
            <MenuList fontSize="sm" boxShadow="xl">
              {Object.keys(columnAccessors)
                .filter((columnAccessor) => {
                  return !sorts
                    .map((sort) => sort.split(":")[0])
                    .includes(columnAccessor);
                })
                .map((columnAccessor) => {
                  return (
                    <MenuItem
                      key={columnAccessor}
                      onClick={() => toggleSortBy(columnAccessor)}
                      icon={<BsListUl />}
                    >
                      {columnAccessors[columnAccessor]}
                    </MenuItem>
                  );
                })}
            </MenuList>
          </Menu>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default Sort;
