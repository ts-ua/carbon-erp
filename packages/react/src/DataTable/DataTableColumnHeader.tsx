import type { Column } from "@tanstack/react-table";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
  MdDisabledVisible,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../Dropdown";

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
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between cursor-pointer">
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96">
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <DropdownMenuIcon icon={<MdKeyboardArrowUp />} />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <DropdownMenuIcon icon={<MdKeyboardArrowDown />} />
          Desc
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!column.getCanHide()}
          onClick={() => column.toggleVisibility(false)}
        >
          <DropdownMenuIcon icon={<MdDisabledVisible />} />
          Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
