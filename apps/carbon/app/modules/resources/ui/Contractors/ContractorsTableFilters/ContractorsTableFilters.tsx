import { Button, HStack, Select } from "@carbon/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
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
    abilities?.map((a) => ({
      value: a.id,
      label: a.name,
    })) ?? [];

  return (
    <HStack
      className="px-4 py-3 justify-between border-b border-border w-full"
      spacing={4}
    >
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
        <Select
          size="sm"
          value={abilitiesOptions.find(
            (type) => type.value === params.get("ability")
          )}
          isClearable
          options={abilitiesOptions}
          onChange={(selected) => {
            setParams({ ability: selected?.value });
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
    </HStack>
  );
};

export default ContractorsTableFilters;
