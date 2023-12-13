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
  serviceGroups: ListItem[];
};

const ServicesTableFilters = ({ serviceGroups }: ServicesTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const serviceTypeOptions = serviceType.map((type) => ({
    value: type,
    label: type,
  }));

  const serviceGroupsOptions = serviceGroups.map((group) => ({
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
        {serviceGroupsOptions.length > 0 && (
          <Select
            size="sm"
            isClearable
            value={serviceGroupsOptions.find(
              (type) => type.value === params.get("group")
            )}
            options={serviceGroupsOptions}
            onChange={(selected) => {
              setParams({ group: selected?.value });
            }}
            aria-label="Groups"
            placeholder="Part Groups"
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
            aria-label="Part Type"
            placeholder="Part Type"
          />
        )}
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "services") && (
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
