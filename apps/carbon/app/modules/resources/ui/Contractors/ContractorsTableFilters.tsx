import { Button, HStack } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { Combobox } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Ability } from "~/modules/resources/types";

type ContractorsTableFiltersProps = {
  abilities: Partial<Ability>[];
};

const ContractorsTableFilters = ({
  abilities,
}: ContractorsTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const abilitiesOptions =
    abilities?.map<{ label: string; value: string }>((a) => ({
      value: a.id!,
      label: a.name!,
    })) ?? [];

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
        <Combobox
          size="sm"
          value={params.get("ability") ?? ""}
          isClearable
          options={abilitiesOptions}
          onChange={(selected) => {
            setParams({ ability: selected });
          }}
          aria-label="Ability"
          placeholder="Ability"
        />
      </HStack>
      <HStack>
        {permissions.can("create", "resources") && (
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={`new?${params.toString()}`}>New Contractor</Link>
          </Button>
        )}
      </HStack>
    </TableFilters>
  );
};

export default ContractorsTableFilters;
