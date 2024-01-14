import type { PropsWithChildren } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./Dropdown";
import { IconButton } from "./IconButton";
import { Menu } from "./Menu";

type ActionMenuProps = PropsWithChildren<{
  icon?: JSX.Element;
  disabled?: boolean;
}>;

const ActionMenu = ({ children, ...props }: ActionMenuProps) => {
  return (
    <Menu type="dropdown">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            aria-label="Open"
            variant="secondary"
            icon={<BsThreeDotsVertical />}
            {...props}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </Menu>
  );
};

export { ActionMenu };
