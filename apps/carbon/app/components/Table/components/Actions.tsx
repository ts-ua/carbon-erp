import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@carbon/react";
import { IoMdCheckboxOutline } from "react-icons/io";
import type { TableAction } from "../types";

type ActionsProps<T> = {
  actions: TableAction<T>[];
  selectedRows: T[];
};

const Actions = <T extends Object>({
  actions,
  selectedRows,
}: ActionsProps<T>) => {
  const disabled = selectedRows.length === 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button leftIcon={<IoMdCheckboxOutline />} variant="ghost">
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            onClick={() => action.onClick(selectedRows)}
            disabled={disabled || action.disabled}
          >
            {action.icon && <DropdownMenuIcon icon={action.icon} />}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
