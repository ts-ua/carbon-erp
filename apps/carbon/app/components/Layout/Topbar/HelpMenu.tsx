import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
} from "@carbon/react";
import { BiHelpCircle } from "react-icons/bi";
import { BsChatSquare } from "react-icons/bs";

const HelpMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton aria-label="Help" icon={<BiHelpCircle />} variant="ghost" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <a
            href="https://github.com/barbinbrad/carbon/issues/new/choose"
            target="_blank"
            rel="noreferrer"
          >
            <DropdownMenuIcon icon={<BiHelpCircle />} />
            Help
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href="https://github.com/barbinbrad/carbon/discussions/new/choose"
            target="_blank"
            rel="noreferrer"
          >
            <DropdownMenuIcon icon={<BsChatSquare />} />
            Feedback
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HelpMenu;
