import { Button, HStack } from "@carbon/react";
import { GridItem } from "@chakra-ui/react";
import { BiHelpCircle } from "react-icons/bi";
import { BsChatSquare } from "react-icons/bs";
import { Search } from "~/components/Search";
import AvatarMenu from "./AvatarMenu";
import Breadcrumbs from "./Breadcrumbs";
import Create from "./Create";

const Topbar = () => {
  return (
    <GridItem
      className="grid bg-background text-foreground border-b border-border px-4 top-0 sticky z-10 space-x-4"
      gridTemplateColumns="1fr auto 1fr"
    >
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
    </GridItem>
  );
};

export default Topbar;
