import type { ReactElement } from "react";
import { cloneElement, forwardRef, isValidElement } from "react";

import type { ButtonProps } from "~/Button";
import { Button } from "~/Button";

export interface IconButtonProps
  extends Omit<ButtonProps, "leftIcon" | "rightIcon"> {
  "aria-label": string;
  icon: ReactElement;
  isRound?: boolean;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, "aria-label": ariaLabel, isRound, children, ...props }, ref) => {
    /**
     * Passing the icon as prop or children should work
     */
    const element = icon || children;
    const _children = isValidElement(element)
      ? cloneElement(element as any, {
          "aria-hidden": true,
          focusable: false,
          className: "w-5 h-5",
        })
      : null;

    return (
      <Button
        aria-label={ariaLabel}
        ref={ref}
        isIcon
        isRound={isRound}
        {...props}
      >
        {_children}
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton };
