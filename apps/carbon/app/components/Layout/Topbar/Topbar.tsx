import { Button, HStack } from "@carbon/react";
import { BiHelpCircle } from "react-icons/bi";
import { BsChatSquare } from "react-icons/bs";
import { Search } from "~/components/Search";
import AvatarMenu from "./AvatarMenu";
import Breadcrumbs from "./Breadcrumbs";
import Create from "./Create";

const Topbar = () => {
  return (
    <div className="grid bg-background text-foreground border-b border-border px-4 top-0 sticky z-10 space-x-4 grid-cols-[1fr_auto_1fr] items-center">
      <Breadcrumbs />
      <Search />
      <HStack spacing={1} className="justify-end py-2">
        <Create />
        <Button asChild leftIcon={<BiHelpCircle />} variant="secondary">
          <a
            target="_blank"
            href="https://github.com/barbinbrad/carbon/issues/new/choose"
            rel="noreferrer"
          >
            Help
          </a>
        </Button>
        <Button asChild leftIcon={<BsChatSquare />} variant="secondary">
          <a
            target="_blank"
            href="https://github.com/barbinbrad/carbon/discussions/new/choose"
            rel="noreferrer"
          >
            Feedback
          </a>
        </Button>
        <AvatarMenu />
      </HStack>
    </div>
  );
};

export default Topbar;
