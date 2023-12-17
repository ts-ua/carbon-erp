import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { serviceType } from "~/modules/parts";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";

type ServicesTableFiltersProps = {
  partGroups: ListItem[];
};

const ServicesTableFilters = ({ partGroups }: ServicesTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const serviceTypeOptions = serviceType.map((type) => ({
    value: type,
    label: type,
  }));

  const partGroupsOptions = partGroups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  const borderColor = useColor("gray.200");

  return (
    <HStack
      px={4}
      py={3}
      justifyContent="space-between"
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      w="full"
    >
      <HStack spacing={2}>
        <DebouncedInput
          param="search"
          size="sm"
          minW={180}
          placeholder="Search Services"
        />
        {partGroupsOptions.length > 0 && (
          <Select
            size="sm"
            isClearable
            value={partGroupsOptions.find(
              (type) => type.value === params.get("group")
            )}
            options={partGroupsOptions}
            onChange={(selected) => {
              setParams({ group: selected?.value });
            }}
            aria-label="Groups"
            placeholder="Service Groups"
          />
        )}
        {serviceTypeOptions.length > 0 && (
          <Select
            size="sm"
            value={serviceTypeOptions.find(
              (type) => type.value === params.get("type")
            )}
            isClearable
            options={serviceTypeOptions}
            onChange={(selected) => {
              setParams({ type: selected?.value });
            }}
            aria-label="Service Type"
            placeholder="Service Type"
          />
        )}
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "parts") && (
          <Button
            as={Link}
            to={path.to.newService}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Service
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default ServicesTableFilters;
