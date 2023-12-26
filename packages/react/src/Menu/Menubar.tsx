import type { ButtonProps, MenuButtonProps } from "@chakra-ui/react";
import { Button, MenuButton } from "@chakra-ui/react";
import { forwardRef } from "react";
import { MdExpandMore } from "react-icons/md";
import type { HStackProps } from "~/HStack";
import { HStack } from "~/HStack";

const Menubar = forwardRef<HTMLDivElement, HStackProps>(
  ({ children, ...props }, ref) => {
    return (
      <HStack
        ref={ref}
        {...props}
        className="items-center bg-background border rounded-md shadow-sm justify-start p-1 w-full"
        spacing={1}
      >
        {children}
      </HStack>
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
