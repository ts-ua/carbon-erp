import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  VStack,
  useDebounce,
  useDisclosure,
  useKeyboardShortcuts,
} from "@carbon/react";
import { clip } from "@carbon/utils";
import { Link, useNavigate } from "@remix-run/react";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import { BiListCheck } from "react-icons/bi";
import { BsArrowReturnLeft, BsCartDash, BsCartPlus } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { PiShareNetworkFill } from "react-icons/pi";
import { RxMagnifyingGlass } from "react-icons/rx";
import { useSidebar } from "~/components/Layout/Sidebar/useSidebar";
import { useSupabase } from "~/lib/supabase";
import type { NavItem } from "~/types";

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

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);

  const defaultResults = useSidebar();
  const [moduleResults, setModuleResults] = useState<NavItem[]>(defaultResults);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const listboxRef = useRef<HTMLUListElement>(null);

  const onResultClick = () => {
    onClose();
    setQuery("");
  };

  const getSearchResults = useCallback(
    async (q: string) => {
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
    },
    [supabase]
  );

  const getModuleResults = useCallback((q: string) => {
    setModuleResults(
      defaultResults.filter((item) => {
        return item.name.toLowerCase().includes(q.toLowerCase());
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const results = [...moduleResults, ...searchResults];

      const scrollToListItem = (index: number) => {
        const listbox = listboxRef.current;
        if (listbox) {
          const listItem = listbox.children[index] as HTMLLIElement;
          if (listItem) {
            listItem.scrollIntoView({
              block: "nearest",
            });
          }
        }
      };

      const next = () => {
        setSelectedIndex((prev) => {
          const newIndex = clip(prev + 1, 0, results.length - 1);
          scrollToListItem(newIndex);
          return newIndex;
        });
      };

      const prev = () => {
        setSelectedIndex((prev) => {
          const newIndex = clip(prev - 1, 0, results.length - 1);
          scrollToListItem(newIndex);
          return newIndex;
        });
      };

      switch (event.code) {
        case "Tab":
          event.preventDefault();
          if (event.shiftKey) {
            prev();
          } else {
            next();
          }
          break;
        case "ArrowDown":
          next();
          break;
        case "ArrowUp":
          prev();
          break;
        case "Enter":
          const selectedResult = results[selectedIndex];
          if (selectedResult) {
            if ("link" in selectedResult) {
              navigate(selectedResult.link);
            } else {
              navigate(selectedResult.to);
            }
            onResultClick();
          }
          break;
        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedQuery.length, navigate, searchResults, selectedIndex]
  );

  useEffect(() => {
    setSelectedIndex(0);
    if (debouncedQuery) {
      getSearchResults(debouncedQuery).then(() => {
        getModuleResults(debouncedQuery);
      });
    } else {
      setSearchResults([]);
      setModuleResults(defaultResults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, getModuleResults, getSearchResults]);

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        setQuery("");
        if (!open) onClose();
      }}
    >
      <ModalContent className="rounded-lg top-[10vh] translate-y-0 p-0">
        <ModalBody className="max-h-[66vh]">
          <InputGroup
            size="lg"
            className="ring-0 focus-within:ring-0 shadow-none border-0"
          >
            <InputLeftElement className="pointer-events-none">
              <RxMagnifyingGlass className="text-muted-foreground" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </InputGroup>

          <div className="h-[calc(100%-3rem)] overflow-y-scroll p-4 pt-0">
            <ul role="listbox" ref={listboxRef}>
              {moduleResults.map((item, itemIndex) => (
                <Module
                  key={item.to}
                  item={item}
                  selected={selectedIndex === itemIndex}
                  onClick={onResultClick}
                  onHover={() => setSelectedIndex(itemIndex)}
                />
              ))}

              {searchResults.map((result, resultIndex) => (
                <Result
                  key={result.uuid}
                  result={result}
                  selected={
                    selectedIndex === resultIndex + moduleResults.length
                  }
                  onClick={onResultClick}
                  onHover={() =>
                    setSelectedIndex(resultIndex + moduleResults.length)
                  }
                />
              ))}
            </ul>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

function ResultIcon({ entity }: { entity: SearchResult["entity"] | "Module" }) {
  switch (entity) {
    case "Customer":
      return (
        <PiShareNetworkFill className="w-8 h-8 mr-4 text-muted-foreground" />
      );
    case "Document":
      return (
        <HiOutlineDocumentDuplicate className="w-8 h-8 mr-4 text-muted-foreground" />
      );
    case "Job":
      return <BiListCheck className="w-8 h-8 mr-4 text-muted-foreground" />;
    case "Part":
      return (
        <AiOutlinePartition className="w-8 h-8 mr-4 text-muted-foreground" />
      );
    case "Person":
      return <CgProfile className="w-8 h-8 mr-4 text-muted-foreground" />;
    case "Resource":
      return <CgProfile className="w-8 h-8 mr-4 text-muted-foreground" />;
    case "Purchase Order":
      return <BsCartDash className="w-8 h-8 mr-4 text-muted-foreground" />;
    case "Sales Order":
      return <BsCartPlus className="w-8 h-8 mr-4 text-muted-foreground" />;
    case "Supplier":
      return (
        <PiShareNetworkFill className="w-8 h-8 mr-4 text-muted-foreground" />
      );
    default:
      return null;
  }
}

function EnterIcon() {
  return <BsArrowReturnLeft className="w-6 h-6 text-muted-foreground" />;
}

function Result({
  result,
  selected,
  onClick,
  onHover,
}: {
  result: SearchResult;
  selected: boolean;
  onClick: () => void;
  onHover: () => void;
}) {
  return (
    <Link to={result.link} onClick={onClick}>
      <li
        className={clsx(
          "flex w-full items-center bg-card rounded-lg  min-h-[4rem] mt-2 p-2",
          {
            "bg-primary text-primary-foreground": selected,
            "bg-muted text-foreground": !selected,
          }
        )}
        role="option"
        aria-selected={selected}
        onMouseEnter={onHover}
      >
        <ResultIcon entity={result.entity} />
        <VStack spacing={0} className="flex-1">
          <p
            className={clsx("text-sm", {
              "text-primary-foreground/60": selected,
              "text-muted-foreground": !selected,
            })}
          >
            {result.entity}
          </p>
          <p className="font-bold">{result.name}</p>
        </VStack>
        <EnterIcon />
      </li>
    </Link>
  );
}

function Module({
  item,
  selected,
  onClick,
  onHover,
}: {
  item: NavItem;
  selected: boolean;
  onClick: () => void;
  onHover: () => void;
}) {
  return (
    <Link to={item.to} onClick={onClick}>
      <li
        className={clsx(
          "flex w-full items-center bg-card rounded-lg  min-h-[4rem] mt-2 p-2",
          {
            "bg-primary text-primary-foreground": selected,
            "bg-muted text-foreground": !selected,
          }
        )}
        role="option"
        aria-selected={selected}
        onMouseEnter={onHover}
      >
        <VStack spacing={0} className="flex-1">
          <p
            className={clsx("text-sm", {
              "text-primary-foreground/60": selected,
              "text-muted-foreground": !selected,
            })}
          >
            Module
          </p>
          <p className="font-bold">{item.name}</p>
        </VStack>
        <EnterIcon />
      </li>
    </Link>
  );
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
        className="text-muted-foreground w-[200px] px-2"
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
