import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "./utils/cn";

const Hyperlink = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
  ({ className, ...props }, ref) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...props}
      ref={ref}
      className={cn("text-primary hover:underline cursor-pointer", className)}
    />
  )
);
Hyperlink.displayName = "Hyperlink";

export { Hyperlink };
