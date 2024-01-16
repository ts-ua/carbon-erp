import type { Table } from "@tanstack/react-table";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Button } from "~/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/Dropdown";
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            {table.getState().pagination.pageSize} {pageSizeLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          {pageSizes.map((size) => (
            <DropdownMenuItem
              key={`${size}`}
              onClick={() => {
                table.setPageSize(Number(size));
              }}
            >
              {size} {pageSizeLabel}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
