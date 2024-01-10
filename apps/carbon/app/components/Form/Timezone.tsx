import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Select as SelectBase,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@carbon/react";
import { MdClose } from "react-icons/md";
import { useControlField, useField } from "remix-validated-form";
import {} from "~/components";
import type { SelectProps } from "./Select";

const timezones: {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
}[] = [
  {
    label: "North America",
    options: [
      {
        label: "Eastern Time",
        value: "America/New_York",
      },
      {
        label: "Central Time",
        value: "America/Chicago",
      },
      {
        label: "Mountain Time",
        value: "America/Denver",
      },
      {
        label: "Pacific Time",
        value: "America/Los_Angeles",
      },
      {
        label: "Alaska Time",
        value: "America/Anchorage",
      },
      {
        label: "Hawaii Time",
        value: "Pacific/Honolulu",
      },
    ],
  },
  {
    label: "Europe & Africa",
    options: [
      {
        label: "Greenwich Mean Time",
        value: "Europe/London",
      },
      {
        label: "Central European Time",
        value: "Europe/Berlin",
      },
      {
        label: "Eastern European Time",
        value: "Europe/Moscow",
      },
      {
        label: "Western European Summer Time",
        value: "Europe/Lisbon",
      },
      {
        label: "Central Africa Time",
        value: "Africa/Nairobi",
      },
      {
        label: "East Africa Time",
        value: "Africa/Addis_Ababa",
      },
      {
        label: "South Africa Standard Time",
        value: "Africa/Johannesburg",
      },
    ],
  },
  {
    label: "Asia",
    options: [
      {
        label: "Moscow Standard Time",
        value: "Europe/Moscow",
      },
      {
        label: "India Standard Time",
        value: "Asia/Kolkata",
      },
      {
        label: "China Standard Time",
        value: "Asia/Shanghai",
      },
      {
        label: "Japan Standard Time",
        value: "Asia/Tokyo",
      },
      {
        label: "Korea Standard Time",
        value: "Asia/Seoul",
      },
      {
        label: "Singapore Standard Time",
        value: "Asia/Singapore",
      },
      {
        label: "Australia Eastern Time",
        value: "Australia/Sydney",
      },
      {
        label: "Australia Central Time",
        value: "Australia/Darwin",
      },
      {
        label: "Australia Western Time",
        value: "Australia/Perth",
      },
      {
        label: "Indonesia Standard Time",
        value: "Asia/Jakarta",
      },
    ],
  },
  {
    label: "Australia & Pacific",
    options: [
      {
        label: "Australia Eastern Time",
        value: "Australia/Sydney",
      },
      {
        label: "Australia Central Time",
        value: "Australia/Darwin",
      },
      {
        label: "Australia Western Time",
        value: "Australia/Perth",
      },
      {
        label: "New Zealand Standard Time",
        value: "Pacific/Auckland",
      },
      {
        label: "Fiji Time",
        value: "Pacific/Fiji",
      },
    ],
  },
  {
    label: "South America",
    options: [
      {
        label: "Brasilia Time",
        value: "America/Sao_Paulo",
      },
      {
        label: "Argentina Time",
        value: "America/Argentina/Buenos_Aires",
      },
      {
        label: "Chile Time",
        value: "America/Santiago",
      },
      {
        label: "Peru Time",
        value: "America/Lima",
      },
      {
        label: "Colombia Time",
        value: "America/Bogota",
      },
      {
        label: "Venezuela Time",
        value: "America/Caracas",
      },
    ],
  },
];

type TimezoneProps = Omit<SelectProps, "options"> & {
  size: "sm" | "md" | "lg";
};

const Timezone = ({
  name,
  label,
  helperText,
  isReadOnly,
  isClearable,
  placeholder,
  size,
  ...props
}: TimezoneProps) => {
  const { getInputProps, error } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <input
        {...getInputProps({
          id: name,
        })}
        type="hidden"
        name={name}
        id={name}
        value={value ?? undefined}
      />
      <HStack spacing={1}>
        <SelectBase
          value={value}
          onValueChange={(value) => setValue(value)}
          disabled={isReadOnly}
        >
          <SelectTrigger size={size} className="min-w-[160px]">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {timezones.map(({ label, options }) => (
              <SelectGroup key={label}>
                <SelectLabel>{label}</SelectLabel>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </SelectBase>
        {isClearable && !isReadOnly && value && (
          <IconButton
            variant="ghost"
            aria-label="Clear"
            icon={<MdClose />}
            onClick={() => setValue("")}
            size={size === "sm" ? "md" : size}
          />
        )}
      </HStack>

      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

Timezone.displayName = "Timezone";

export default Timezone;
