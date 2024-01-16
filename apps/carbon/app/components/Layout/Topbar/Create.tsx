import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@carbon/react";
import { Link } from "@remix-run/react";
import useCreate from "./useCreate";

const Create = () => {
  const createLinks = useCreate();

  if (!createLinks.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Create</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-48">
        {createLinks.map((link) => (
          <DropdownMenuItem key={link.to} asChild>
            <Link to={link.to}>
              {link.icon && <DropdownMenuIcon icon={link.icon} />}
              {link.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Create;
