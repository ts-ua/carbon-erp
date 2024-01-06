import { HStack, Loading, cn } from "@carbon/react";
import { Box, Icon, List, ListItem } from "@chakra-ui/react";
import { FaChevronRight } from "react-icons/fa";
import { RxCheck } from "react-icons/rx";
import useUserSelectContext from "../provider";
import type { IndividualOrGroup, OptionGroup } from "../types";
import { useGroupStyles, useOptionStyles } from "./useUserSelectStyles";

const UserTreeSelect = () => {
  const {
    aria: { listBoxProps },
    groups,
    innerProps: { isMulti },
    loading,
    onMouseOver,
    refs: { listBoxRef },
  } = useUserSelectContext();

  return (
    <List
      {...listBoxProps}
      aria-multiselectable={isMulti}
      ref={listBoxRef}
      onMouseOver={onMouseOver}
      overflow="auto"
      maxH={300}
      my="1"
      display="flex"
      flexDirection="column"
    >
      {loading ? (
        <Loading />
      ) : groups.length > 0 ? (
        groups.map((group) => <Group key={group.uid} group={group} />)
      ) : (
        <p className="text-center">No options found</p>
      )}
    </List>
  );
};

const MoreIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <Icon
    as={FaChevronRight}
    w={4}
    h={4}
    transition="transform .25s ease"
    transform={isExpanded ? "rotate(-0.25turn)" : undefined}
  />
);

const Group = ({ group }: { group: OptionGroup }) => {
  const {
    innerProps: { alwaysSelected },
    onGroupCollapse,
    onGroupExpand,
    focusedId,
    onSelect,
    onDeselect,
    selectionItemsById,
  } = useUserSelectContext();

  const isFocused = group.uid === focusedId;
  const isExpanded = group.expanded && group.items.length > 0;
  const sx = useGroupStyles(isFocused, isExpanded);

  return (
    <ListItem
      as="li"
      id={group.uid}
      tabIndex={0}
      role="treeitem"
      aria-expanded={isExpanded}
      borderRadius="md"
      outline="none"
    >
      <Box
        role="treeitem"
        aria-selected={isExpanded ? "true" : "false"}
        onClick={() =>
          group.expanded ? onGroupCollapse(group.uid) : onGroupExpand(group.uid)
        }
        sx={sx}
      >
        <span className="line-clamp-1">{group.name}</span>
        <MoreIcon isExpanded={isExpanded} />
      </Box>
      {isExpanded && (
        <List role="group" display="flex" flexDirection="column">
          {group.items.map((item) => {
            const isDisabled = item.id in []; // TODO
            const isFocused = item.uid === focusedId;
            const isSelected = item.id in selectionItemsById;

            return (
              <Option
                key={item.uid}
                id={item.uid}
                item={item}
                isDisabled={isDisabled}
                isFocused={isFocused}
                isSelected={isSelected}
                onClick={
                  !alwaysSelected.includes(item.id)
                    ? () => (isSelected ? onDeselect(item) : onSelect(item))
                    : undefined
                }
              />
            );
          })}
        </List>
      )}
    </ListItem>
  );
};

const Option = ({
  id,
  item,
  isDisabled,
  isFocused,
  isSelected,
  onClick,
}: {
  id?: string;
  item: IndividualOrGroup;
  isDisabled: boolean;
  isFocused: boolean;
  isSelected: boolean;
  onClick?: () => void;
}) => {
  const sx = useOptionStyles(isFocused, isSelected, isDisabled);
  const name = item.label;

  return (
    <ListItem
      as="li"
      id={id}
      background={"red.100"}
      tabIndex={0}
      aria-selected={isSelected}
      role="treeitem"
      onClick={onClick}
      sx={sx}
    >
      <HStack spacing={1} className="w-full items-center">
        <RxCheck
          className={cn(
            "block mr-[0.75rem] text-[0.8rem] w-4 h-4",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
        <span className="line-clamp-1">{name}</span>
      </HStack>
    </ListItem>
  );
};

export default UserTreeSelect;
