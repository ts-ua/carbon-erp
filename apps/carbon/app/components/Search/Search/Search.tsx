import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  HStack,
  Kbd,
  Modal,
  ModalContent,
  useDebounce,
  useDisclosure,
  useKeyboardShortcuts,
  useMount,
} from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import idb from "localforage";
import { useCallback, useEffect, useState } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import { BiListCheck } from "react-icons/bi";
import { BsCartDash, BsCartPlus } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { PiShareNetworkFill } from "react-icons/pi";
import { RxMagnifyingGlass } from "react-icons/rx";
import { useSidebar } from "~/components/Layout/Sidebar/useSidebar";
import { useSupabase } from "~/lib/supabase";
import { useAccountSidebar } from "~/modules/account";
import { useAccountingSidebar } from "~/modules/accounting";
import { useDocumentsSidebar } from "~/modules/documents";
import { useInventorySidebar } from "~/modules/inventory";
import { useInvoicingSidebar } from "~/modules/invoicing";
import { usePartsSidebar } from "~/modules/parts";
import { usePurchasingSidebar } from "~/modules/purchasing";
import { useSalesSidebar } from "~/modules/sales";
import { useSettingsSidebar } from "~/modules/settings";
import { useUsersSidebar } from "~/modules/users";
import type { Authenticated, Route } from "~/types";

type SearchResult = {
  id: number;
  name: string;
  entity:
    | "Person"
    | "Resource"
    | "Customer"
    | "Supplier"
    | "Job"
    | "Part"
    | "Purchase Order"
    | "Sales Order"
    | "Document"
    | null;
  uuid: string | null;
  link: string;
  description: string | null;
};

const SearchModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState("");
  const [debouncedInput] = useDebounce(input, 500);

  useEffect(() => {
    if (isOpen) {
      setInput("");
    }
  }, [isOpen]);

  const staticResults = useGroupedSubmodules();

  const [recentResults, setRecentResults] = useState<Route[]>([]);
  useMount(async () => {
    const recentResultsFromStorage = await idb.getItem<Route[]>(
      "recentSearches"
    );
    if (recentResultsFromStorage) {
      setRecentResults(recentResultsFromStorage);
    }
  });

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const getSearchResults = useCallback(
    async (q: string) => {
      setLoading(true);
      const tokens = q.split(" ");
      const search =
        tokens.length > 1
          ? tokens.map((token) => `"${token}"`).join(" <-> ")
          : q;

      const result = await supabase
        ?.from("search")
        .select()
        .textSearch("fts", `${search}:*`)
        .limit(20);

      if (result?.data) {
        setSearchResults(result.data);
      } else {
        setSearchResults([]);
      }
      setLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    if (debouncedInput) {
      getSearchResults(debouncedInput);
    } else {
      setSearchResults([]);
    }
  }, [debouncedInput, getSearchResults]);

  const onInputChange = (value: string) => {
    setInput(value);
  };

  const onSelect = async (route: Route) => {
    const { to, name } = route;
    navigate(route.to);
    onClose();
    const newRecentSearches = [
      { to, name },
      ...((await idb.getItem<Route[]>("recentSearches"))?.filter(
        (item) => item.to !== to
      ) ?? []),
    ].slice(0, 5);

    setRecentResults(newRecentSearches);
    idb.setItem("recentSearches", newRecentSearches);
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        setInput("");
        if (!open) onClose();
      }}
    >
      <ModalContent className="rounded-lg top-[10vh] translate-y-0 p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Type a command or search..."
            value={input}
            onValueChange={onInputChange}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading..." : "No results found."}
            </CommandEmpty>
            {recentResults.length > 0 && (
              <>
                <CommandGroup heading="Recent Searches">
                  {recentResults.map((result) => (
                    <CommandItem
                      key={result.to}
                      onSelect={() => onSelect(result)}
                      // append with : so we're not sharing a value with a static result
                      value={`:${result.to}`}
                    >
                      <RxMagnifyingGlass className="w-4 h-4 mr-2 " />
                      {result.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            {Object.entries(staticResults).map(([module, submodules]) => (
              <>
                <CommandGroup heading={module} key={module}>
                  {submodules.map((submodule) => (
                    <CommandItem
                      key={`${submodule.to}-${submodule.name}`}
                      onSelect={() => onSelect(submodule)}
                      value={`${module} ${submodule.name}`}
                    >
                      {submodule.icon && (
                        <submodule.icon className="w-4 h-4 mr-2 " />
                      )}
                      <span>{submodule.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            ))}
            {searchResults.length > 0 && (
              <CommandGroup heading="Search Results">
                {searchResults.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={`${input}${result.id}`}
                    onSelect={() =>
                      onSelect({
                        to: result.link,
                        name: result.name,
                      })
                    }
                  >
                    <ResultIcon entity={result.entity} />
                    <span>{result.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </ModalContent>
    </Modal>
  );
};

function ResultIcon({ entity }: { entity: SearchResult["entity"] | "Module" }) {
  switch (entity) {
    case "Customer":
      return <PiShareNetworkFill className="w-4 h-4 mr-2 " />;
    case "Document":
      return <HiOutlineDocumentDuplicate className="w-4 h-4 mr-2 " />;
    case "Job":
      return <BiListCheck className="w-4 h-4 mr-2 " />;
    case "Part":
      return <AiOutlinePartition className="w-4 h-4 mr-2 " />;
    case "Person":
      return <CgProfile className="w-4 h-4 mr-2 " />;
    case "Resource":
      return <CgProfile className="w-4 h-4 mr-2 " />;
    case "Purchase Order":
      return <BsCartDash className="w-4 h-4 mr-2 " />;
    case "Sales Order":
      return <BsCartPlus className="w-4 h-4 mr-2 " />;
    case "Supplier":
      return <PiShareNetworkFill className="w-4 h-4 mr-2 " />;
    default:
      return null;
  }
}

const SearchButton = () => {
  const searchModal = useDisclosure();
  useKeyboardShortcuts({
    "/": searchModal.onOpen,
  });

  return (
    <>
      <Button
        leftIcon={<RxMagnifyingGlass />}
        variant="secondary"
        className="font-normal w-[200px] px-2"
        onClick={searchModal.onOpen}
      >
        <HStack className="w-full">
          <div className="flex flex-grow">Search</div>
          <Kbd>/</Kbd>
        </HStack>
      </Button>
      <SearchModal isOpen={searchModal.isOpen} onClose={searchModal.onClose} />
    </>
  );
};

function useGroupedSubmodules() {
  const modules = useSidebar();
  const parts = usePartsSidebar();
  // const jobs = useJobsSidebar();
  const inventory = useInventorySidebar();
  // const scheduling = useSchedulingSidebar();
  // const timecards = useTimecardsSidebar();
  const sales = useSalesSidebar();
  const purchasing = usePurchasingSidebar();
  const documents = useDocumentsSidebar();
  // const messages = useMessagesSidebar();
  const accounting = useAccountingSidebar();
  const invoicing = useInvoicingSidebar();
  const users = useUsersSidebar();
  const settings = useSettingsSidebar();
  const account = useAccountSidebar();

  const groupedSubmodules: Record<
    string,
    {
      groups: {
        routes: Authenticated<Route>[];
        name: string;
        icon?: any;
      }[];
    }
  > = {
    parts,
    inventory,
    sales,
    purchasing,
    accounting,
    invoicing,
    users,
    settings,
  };

  const ungroupedSubmodules: Record<string, { links: Route[] }> = {
    documents,
    account,
  };

  const shortcuts = modules.reduce<Record<string, Route[]>>((acc, module) => {
    const moduleName = module.name.toLowerCase();

    if (moduleName in groupedSubmodules) {
      const groups = groupedSubmodules[moduleName].groups;
      acc = {
        ...acc,
        [module.name]: groups.flatMap((group) =>
          group.routes.map((route) => ({
            to: route.to,
            name: route.name,
            icon: module.icon,
          }))
        ),
      };
    } else if (moduleName in ungroupedSubmodules || moduleName === "account") {
      acc = {
        ...acc,
        [module.name]: ungroupedSubmodules[moduleName].links.map((link) => ({
          to: link.to,
          name: link.name,
          icon: module.icon,
        })),
      };
    }

    return acc;
  }, {});

  return shortcuts;
}

export default SearchButton;
