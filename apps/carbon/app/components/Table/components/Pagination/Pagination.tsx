import { Button, HStack, IconButton } from "@carbon/react";
import type { ThemeTypings } from "@chakra-ui/react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

export type PaginationProps = {
  count: number;
  offset: number;
  pageIndex: number;
  pageSize: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
  gotoPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  colorScheme?: ThemeTypings["colorSchemes"];
};

const Pagination = (props: PaginationProps) => {
  const { pageSize, setPageSize } = props;

  const pageSizes = [15, 25, 50, 100];
  const pageSizeLabel = "results per page";
  if (!pageSizes.includes(pageSize)) {
    pageSizes.push(pageSize);
    pageSizes.sort();
  }

  return (
    <HStack
      className="text-center bg-background border-t justify-between px-4 py-2 w-full z-[1]"
      spacing={6}
    >
      <Menu>
        <MenuButton as={Button} variant="ghost">
          {pageSize} {pageSizeLabel}
        </MenuButton>
        <MenuList fontSize="sm" boxShadow="xl" minW={48}>
          {pageSizes.map((size) => (
            <MenuItem
              key={`${size}`}
              onClick={() => {
                setPageSize(size);
              }}
            >
              {size} {pageSizeLabel}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <HStack>
        <PaginationButtons {...props} />
      </HStack>
    </HStack>
  );
};

export const PaginationButtons = ({
  condensed = false,
  canNextPage,
  canPreviousPage,
  count,
  nextPage,
  offset,
  pageSize,
  previousPage,
}: PaginationProps & { condensed?: boolean }) => {
  return (
    <>
      {condensed ? (
        <>
          <IconButton
            aria-label="Previous"
            icon={<BsChevronLeft />}
            isDisabled={!canPreviousPage}
            onClick={previousPage}
            variant="secondary"
          />
          <IconButton
            aria-label="Next"
            icon={<BsChevronRight />}
            isDisabled={!canNextPage}
            onClick={nextPage}
            variant="secondary"
          />
        </>
      ) : (
        <>
          <div className="flex font-sm font-medium align-center">
            {count > 0 ? offset + 1 : 0} - {Math.min(offset + pageSize, count)}{" "}
            of {count}
          </div>
          <Button
            variant="secondary"
            isDisabled={!canPreviousPage}
            onClick={previousPage}
            leftIcon={<BsChevronLeft />}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            isDisabled={!canNextPage}
            onClick={nextPage}
            rightIcon={<BsChevronRight />}
          >
            Next
          </Button>
        </>
      )}
    </>
  );
};

export default Pagination;
