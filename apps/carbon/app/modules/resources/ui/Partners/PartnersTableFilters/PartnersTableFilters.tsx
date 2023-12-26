import { HStack, Select } from "@carbon/react";
import { Button } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Ability } from "~/modules/resources/types";

type PartnersTableFiltersProps = {
  abilities: Partial<Ability>[];
};

const PartnersTableFilters = ({ abilities }: PartnersTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const abilitiesOptions =
    abilities?.map((ability) => ({
      value: ability.id,
      label: ability.name,
    })) ?? [];

  return (
    <HStack className="px-4 py-3 justify-between border-b w-full" spacing={4}>
      <HStack>
        <DebouncedInput
          param="name"
          size="sm"
          minW={180}
          placeholder="Search"
        />
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
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Partner
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default PartnersTableFilters;
