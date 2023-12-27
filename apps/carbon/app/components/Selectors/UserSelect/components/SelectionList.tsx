import { useColor } from "@carbon/react";
import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  Tooltip,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { MdOutlineClear, MdPlaylistAdd } from "react-icons/md";
import { Avatar } from "~/components";
import useUserSelectContext from "../provider";
import { isGroup } from "../useUserSelect";

const SelectionList = () => {
  const {
    innerProps: {
      alwaysSelected,
      checkedSelections,
      readOnly,
      selectionsMaxHeight,
      width,
    },
    instanceId,
    selectionItemsById,
    onDeselect,
    onExplode,
    onToggleChecked,
  } = useUserSelectContext();

  const selected = useMemo(
    () =>
      Object.values(selectionItemsById).sort((a, b) =>
        a.label < b.label ? -1 : 0
      ),
    [selectionItemsById]
  );

  const background = useColor("gray.100");

  return (
    <List
      w="full"
      maxW={width}
      mt={1}
      maxH={selectionsMaxHeight}
      overflowY={selectionsMaxHeight ? "auto" : undefined}
    >
      {selected.map((item) => {
        const id = `UserSelection:SelectedItem-${item.id}`;
        const canExpand = !checkedSelections && !readOnly && isGroup(item);

        return (
          <ListItem
            key={item.id}
            p={2}
            borderRadius="md"
            _hover={{ background }}
          >
            <div className="flex space-x-2">
              {checkedSelections ? (
                <>
                  <Checkbox
                    id={`${instanceId}:${id}:checkbox`}
                    data-testid={id}
                    isChecked={item.isChecked}
                    onChange={() => onToggleChecked(item)}
                    size="lg"
                    flexGrow={2}
                  >
                    <p className="text-sm line-clamp-1">{item.label}</p>
                  </Checkbox>
                </>
              ) : (
                <>
                  {"fullName" in item ? (
                    <Avatar
                      name={item.fullName ?? undefined}
                      path={item.avatarUrl}
                      size="sm"
                    />
                  ) : (
                    <Avatar name={item.name} path={null} size="sm" />
                  )}

                  <div className="flex items-center flex-grow">
                    <p className="text-sm line-clamp-1">{item.label}</p>
                  </div>
                </>
              )}

              {!!canExpand && (
                <Tooltip label="Expand">
                  <IconButton
                    aria-label={`Expand ${item.label}`}
                    icon={<MdPlaylistAdd />}
                    size="sm"
                    onClick={() => onExplode(item)}
                    variant="outline"
                  />
                </Tooltip>
              )}

              {!readOnly && !alwaysSelected.includes(item.id) && (
                <Tooltip label="Remove">
                  <IconButton
                    aria-label={`Remove ${item.label}`}
                    icon={<MdOutlineClear />}
                    size="sm"
                    onClick={() => onDeselect(item)}
                    variant="outline"
                  />
                </Tooltip>
              )}
            </div>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SelectionList;
