import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "./utils/cn";

const Hyperlink = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
  ({ className, href, children, ...props }, ref) => {
    const hasHref = !!href;
    return hasHref ? (
      <a
        {...props}
        href={href}
        ref={ref}
        className={cn(
          "text-foreground hover:underline cursor-pointer",
          className
        )}
      >
        {children}
      </a>
    ) : (
      <span
        {...props}
        ref={ref}
        className={cn(
          "text-foreground hover:underline cursor-pointer",
          className
        )}
      >
        {children}
      </span>
    );
  }
);
Hyperlink.displayName = "Hyperlink";

export { Hyperlink };
