import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import type { Column } from "@tanstack/react-table";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
  MdDisabledVisible,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span>{title}</span>;
  }

  return (
    <Menu>
      <MenuButton className="flex items-center justify-between cursor-pointer">
        <div className="flex flex-start items-center text-xs text-muted-foreground">
          {title}
          <span className="pl-4">
            {column.getIsSorted() === "desc" ? (
              <FaSortDown aria-label="sorted descending" />
            ) : column.getIsSorted() === "asc" ? (
              <FaSortUp aria-label="sorted ascending" />
            ) : (
              <FaSort aria-label="sort" />
            )}
          </span>
        </div>
      </MenuButton>
      <MenuList>
        <MenuItem
          icon={<MdKeyboardArrowUp />}
          onClick={() => column.toggleSorting(false)}
        >
          Asc
        </MenuItem>
        <MenuItem
          icon={<MdKeyboardArrowDown />}
          onClick={() => column.toggleSorting(true)}
        >
          Desc
        </MenuItem>
        <MenuItem
          icon={<MdDisabledVisible />}
          disabled={!column.getCanHide()}
          onClick={() => column.toggleVisibility(false)}
        >
          Hide
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
