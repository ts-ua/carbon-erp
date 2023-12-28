import type { ButtonProps, MenuButtonProps } from "@chakra-ui/react";
import { Button, MenuButton } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import { forwardRef } from "react";
import { MdExpandMore } from "react-icons/md";

const Menubar = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ children, ...props }, ref) => {
    return (
      <div
        {...props}
        className="flex items-center bg-background border border-border rounded-md shadow-sm justify-start p-1 w-full space-x-1"
      >
        {children}
      </div>
    );
  }
);
Menubar.displayName = "Menubar";

const MenubarTrigger = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <MenuButton
        ref={ref}
        as={Button}
        size="sm"
        variant="ghost"
        rightIcon={<MdExpandMore />}
        {...props}
      >
        {children}
      </MenuButton>
    );
  }
);
MenubarTrigger.displayName = "MenubarTrigger";

const MenubarItem = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <Button ref={ref} size="sm" variant="ghost" {...props}>
        {children}
      </Button>
    );
  }
);
MenubarItem.displayName = "MenubarItem";

export { Menubar, MenubarItem, MenubarTrigger };
