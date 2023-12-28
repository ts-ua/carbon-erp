import { Button, HStack, Select } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

type HolidaysTableFiltersProps = {
  years: number[];
};

const HolidaysTableFilters = ({ years }: HolidaysTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const yearsOptions = years.map((year) => ({
    label: year.toString(),
    value: year,
  }));

  return (
    <HStack
      className="px-4 py-3 justify-between border-b border-border w-full"
      spacing={4}
    >
      <HStack>
        <DebouncedInput
          param="name"
          size="sm"
          minW={180}
          placeholder="Search"
        />
        <Select
          size="sm"
          value={
            params.get("year")
              ? yearsOptions.find(
                  (year) => year.value.toString() === params.get("year")
                )
              : {
                  label: new Date().getFullYear().toString(),
                  value: new Date().getFullYear(),
                }
          }
          options={yearsOptions}
          onChange={(selected) => {
            setParams({ year: selected?.value });
          }}
          aria-label="Year"
          placeholder="Year"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "resources") && (
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={`new?${params.toString()}`}>New Holiday</Link>
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default HolidaysTableFilters;
