import { Button, HStack } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { Combobox } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

type HolidaysTableFiltersProps = {
  years: number[];
};

const HolidaysTableFilters = ({ years }: HolidaysTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const yearsOptions = years.map<{ label: string; value: string }>((year) => ({
    label: year.toString(),
    value: year.toString(),
  }));

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
        <Combobox
          size="sm"
          value={params.get("year") ?? ""}
          options={yearsOptions}
          isClearable
          onChange={(selected) => {
            setParams({ year: selected });
          }}
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
    </TableFilters>
  );
};

export default HolidaysTableFilters;
