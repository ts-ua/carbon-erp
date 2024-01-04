import { cn } from "@carbon/react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

const TableFilters = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex px-4 py-3 items-center space-x-4 justify-between border-b border-border w-full",
        className
      )}
      {...props}
    />
  );
});
TableFilters.displayName = "TableFilters";

export default TableFilters;
