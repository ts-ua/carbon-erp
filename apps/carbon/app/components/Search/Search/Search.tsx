import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
  HStack,
  Kbd,
  Modal,
  ModalContent,
  useDebounce,
  useDisclosure,
  useKeyboardShortcuts,
} from "@carbon/react";
import { useNavigate } from "@remix-run/react";
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

  const moduleResults = useSidebar();

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

  const onSelect = (location: string) => {
    navigate(location);
    onClose();
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
            {loading && <CommandLoading />}
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Modules">
              {moduleResults.map((module) => (
                <CommandItem
                  key={module.name}
                  onSelect={() => onSelect(module.to)}
                >
                  <module.icon className="mr-2 w-4 h-4" />
                  <span>{module.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            {searchResults.length > 0 && (
              <CommandGroup heading="Search Results">
                {searchResults.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={`${input}${result.id}`}
                    onSelect={() => onSelect(result.link)}
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
        className=" w-[200px] px-2"
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

export default SearchButton;
