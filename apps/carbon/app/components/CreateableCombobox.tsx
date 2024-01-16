import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandTrigger,
  HStack,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@carbon/react";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { RxCheck } from "react-icons/rx";

export type CreatableComboboxProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "onChange"
> & {
  size?: "sm" | "md" | "lg";
  value?: string;
  options: {
    label: string;
    value: string;
  }[];
  selected?: string[];
  isClearable?: boolean;
  isReadOnly?: boolean;
  placeholder?: string;
  onChange?: (selected: string) => void;
  onCreateOption?: (inputValue: string) => void;
};

const CreatableCombobox = forwardRef<HTMLButtonElement, CreatableComboboxProps>(
  (
    {
      size,
      value,
      options,
      selected,
      isClearable,
      isReadOnly,
      placeholder,
      onChange,

      ...props
    },
    ref
  ) => {
    const [search, setSearch] = useState("");
    const isExactMatch = options.some(
      (option) => option.value.toLowerCase() === search.toLowerCase()
    );

    return (
      <HStack spacing={1}>
        <Popover>
          <PopoverTrigger asChild>
            <CommandTrigger
              size={size}
              role="combobox"
              className={cn("min-w-[160px]", !value && "text-muted-foreground")}
              ref={ref}
              {...props}
            >
              {value
                ? options.find((option) => option.value === value)?.label
                : placeholder ?? "Select"}
            </CommandTrigger>
          </PopoverTrigger>
          <PopoverContent className="min-w-[200px] w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput
                value={search}
                onValueChange={setSearch}
                placeholder="Search..."
                className="h-9"
              />
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = !!selected?.includes(option.value);
                  return (
                    <CommandItem
                      value={option.label}
                      key={option.value}
                      onSelect={() => {
                        if (!isSelected) onChange?.(option.value);
                      }}
                    >
                      {option.label}
                      <RxCheck
                        className={cn(
                          "ml-auto h-4 w-4",
                          isSelected || option.value === value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
                {!isExactMatch && !!search && (
                  <CommandItem
                    onSelect={() => {
                      props.onCreateOption?.(search);
                    }}
                  >
                    <span>Create</span>
                    <span className="ml-1 font-bold">{search}</span>
                  </CommandItem>
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {isClearable && !isReadOnly && value && (
          <IconButton
            variant="ghost"
            aria-label="Clear"
            icon={<MdClose />}
            onClick={() => onChange?.("")}
            size={size === "sm" ? "md" : size}
          />
        )}
      </HStack>
    );
  }
);
CreatableCombobox.displayName = "CreatableCombobox";

export default CreatableCombobox;
