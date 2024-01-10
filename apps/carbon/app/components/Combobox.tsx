import {
  Command,
  CommandEmpty,
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
import { forwardRef } from "react";
import { MdClose } from "react-icons/md";
import { RxCheck } from "react-icons/rx";

export type ComboboxProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "onChange"
> & {
  size?: "sm" | "md" | "lg";
  value?: string;
  options: {
    label: string;
    value: string;
  }[];
  isClearable?: boolean;
  isReadOnly?: boolean;
  placeholder?: string;
  onChange?: (selected: string) => void;
};

const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      size,
      value,
      options,
      isClearable,
      isReadOnly,
      placeholder,
      onChange,
      ...props
    },
    ref
  ) => {
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
              {value ? (
                options.find((option) => option.value === value)?.label
              ) : (
                <span className="text-muted-foreground">
                  {placeholder ?? "Select"}
                </span>
              )}
            </CommandTrigger>
          </PopoverTrigger>
          <PopoverContent className="min-w-[200px] w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search..." className="h-9" />
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    value={option.label}
                    key={option.value}
                    onSelect={() => {
                      onChange?.(option.value);
                    }}
                  >
                    {option.label}
                    <RxCheck
                      className={cn(
                        "ml-auto h-4 w-4",
                        option.value === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
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
Combobox.displayName = "Combobox";

export default Combobox;
