import { Button, HStack } from "@carbon/react";
import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import type { Column, ColumnOrderState } from "@tanstack/react-table";
import { Reorder } from "framer-motion";
import {
  BsEyeFill,
  BsEyeSlash,
  BsLayoutThreeColumns,
  BsPin,
  BsPinFill,
} from "react-icons/bs";
import { MdOutlineDragIndicator } from "react-icons/md";

type ColumnsProps<T> = {
  columns: Column<T, unknown>[];
  columnOrder: ColumnOrderState;
  withSelectableRows: boolean;
  setColumnOrder: (newOrder: ColumnOrderState) => void;
};

const Columns = <T extends object>({
  columns,
  columnOrder,
  withSelectableRows,
  setColumnOrder,
}: ColumnsProps<T>) => {
  return (
    <Popover placement="bottom" closeOnBlur>
      <PopoverTrigger>
        <Button variant="ghost" leftIcon={<BsLayoutThreeColumns />}>
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent w={360} boxShadow="xl">
        <PopoverHeader>
          <p className="text-sm">Edit column view</p>
          <p className="text-xs text-muted-foreground">
            Manage and reorder columns
          </p>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverBody maxH="50vh" overflow="auto">
          <Reorder.Group
            axis="y"
            values={columnOrder}
            onReorder={(newOrder: ColumnOrderState) => {
              if (withSelectableRows) newOrder.unshift("select");
              setColumnOrder(newOrder);
            }}
            className="space-y-2"
          >
            {columns.reduce<JSX.Element[]>((acc, column) => {
              if (isColumnToggable(column))
                acc.push(
                  <Reorder.Item
                    key={column.id}
                    value={column.id}
                    className="rounded-lg"
                  >
                    <HStack>
                      <IconButton
                        aria-label="Drag handle"
                        icon={<MdOutlineDragIndicator />}
                        variant="ghost"
                      />
                      <span className="text-sm flex-grow">
                        <>{column.columnDef.header}</>
                      </span>
                      <IconButton
                        aria-label="Toggle column"
                        icon={column.getIsPinned() ? <BsPinFill /> : <BsPin />}
                        onClick={(e) => {
                          if (column.getIsPinned()) {
                            column.pin(false);
                          } else {
                            column.pin("left");
                            // when a column is pinned, we assure that it's visible
                            if (!column.getIsVisible()) {
                              column.getToggleVisibilityHandler()(e);
                            }
                          }
                        }}
                        variant="ghost"
                      />
                      <IconButton
                        aria-label="Toggle column"
                        icon={
                          column.getIsVisible() ? <BsEyeFill /> : <BsEyeSlash />
                        }
                        onClick={column.getToggleVisibilityHandler()}
                        variant="ghost"
                      />
                    </HStack>
                  </Reorder.Item>
                );
              return acc;
            }, [])}
          </Reorder.Group>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

function isColumnToggable<T>(column: Column<T, unknown>): boolean {
  return (
    column.columnDef.id !== "select" &&
    typeof column.columnDef.header === "string" &&
    column.columnDef.header !== ""
  );
}

export default Columns;
