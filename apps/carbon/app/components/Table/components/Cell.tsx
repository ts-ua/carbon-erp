import { Td, cn } from "@carbon/react";
import type { Cell as CellType } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { memo, useState } from "react";
import type { EditableTableCellComponent } from "~/components/Editable";
import { useMovingCellRef } from "~/hooks";
import { getAccessorKey } from "../utils";

type CellProps<T> = {
  cell: CellType<T, unknown>;
  columnIndex: number;
  editableComponents?: Record<string, EditableTableCellComponent<T>>;
  editedCells?: string[];
  isEditing: boolean;
  isEditMode: boolean;
  isRowSelected: boolean;
  isSelected: boolean;
  onClick?: () => void;
  onUpdate?: (columnId: string, value: unknown) => void;
};

const Cell = <T extends object>({
  cell,
  columnIndex,
  editableComponents,
  editedCells,
  isEditing,
  isEditMode,
  isSelected,
  onClick,
  onUpdate,
}: CellProps<T>) => {
  const { ref, tabIndex, onFocus } = useMovingCellRef(isSelected);
  const [hasError, setHasError] = useState(false);
  const accessorKey = getAccessorKey(cell.column.columnDef);

  const wasEdited =
    !!editedCells && !!accessorKey && editedCells.includes(accessorKey);

  const hasEditableTableCellComponent =
    accessorKey !== undefined &&
    editableComponents &&
    accessorKey in editableComponents;

  const editableCell = hasEditableTableCellComponent
    ? editableComponents[accessorKey]
    : null;

  return (
    <Td
      className={cn(
        "relative px-4 whitespace-nowrap text-sm outline-none",
        wasEdited && "bg-yellow-100 dark:bg-yellow-900",
        isEditing &&
          !hasEditableTableCellComponent &&
          "bg-zinc-50 dark:bg-zinc-950",
        isEditMode && "border-border border-r",
        hasError && "ring-inset ring-2 ring-red-500",
        isSelected && "ring-inset ring-2 ring-ring"
      )}
      ref={ref}
      data-row={cell.row.index}
      data-column={columnIndex}
      tabIndex={tabIndex}
      onClick={onClick}
      onFocus={onFocus}
    >
      {isSelected && isEditing && hasEditableTableCellComponent ? (
        <div className="mx-[-1rem] my-[-0.5rem]">
          {hasEditableTableCellComponent
            ? flexRender(editableCell, {
                accessorKey,
                value: cell.renderValue(),
                row: cell.row.original,
                onUpdate: onUpdate
                  ? onUpdate
                  : () => console.error("No update function provided"),
                onError: () => {
                  setHasError(true);
                },
              })
            : null}
        </div>
      ) : (
        <div ref={ref}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      )}
    </Td>
  );
};

const MemoizedCell = memo(
  Cell,
  (prev, next) =>
    next.isRowSelected === prev.isRowSelected &&
    next.isSelected === prev.isSelected &&
    next.isEditing === prev.isEditing &&
    next.isEditMode === prev.isEditMode &&
    next.cell.getValue() === prev.cell.getValue() &&
    next.cell.getContext() === prev.cell.getContext()
) as typeof Cell;

export default MemoizedCell;
