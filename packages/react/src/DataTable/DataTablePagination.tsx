import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import type { Table } from "@tanstack/react-table";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Button } from "~/Button";
import { HStack } from "~/HStack";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const pageSizes = [15, 25, 50, 100];
  const pageSizeLabel = "results per page";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <HStack
      className="text-center bg-background border-t border-border justify-between px-4 py-2 w-full z-[1]"
      spacing={6}
    >
      <Menu>
        <MenuButton as={Button} variant="ghost">
          {table.getState().pagination.pageSize} {pageSizeLabel}
        </MenuButton>
        <MenuList fontSize="sm" boxShadow="xl" minW={48}>
          {pageSizes.map((size) => (
            <MenuItem
              key={`${size}`}
              onClick={() => {
                table.setPageSize(Number(size));
              }}
            >
              {size} {pageSizeLabel}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <HStack>
        <div className="flex text-sm font-md h-8 items-center">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <Button
          variant="secondary"
          isDisabled={!table.getCanPreviousPage()}
          onClick={() => {
            table.previousPage();
            scrollToTop();
          }}
          leftIcon={<BsChevronLeft />}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          isDisabled={!table.getCanNextPage()}
          onClick={() => {
            table.nextPage();
            scrollToTop();
          }}
          rightIcon={<BsChevronRight />}
        >
          Next
        </Button>
      </HStack>
    </HStack>
  );
}
