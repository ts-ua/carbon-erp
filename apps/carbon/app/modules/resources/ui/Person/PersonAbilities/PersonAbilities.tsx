import { Heading } from "@carbon/react";
import { formatDate } from "@carbon/utils";
import {
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  Grid,
  Icon,
  List,
  ListItem,
} from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import type { IconType } from "react-icons";

import { BsBarChartFill, BsCheckLg } from "react-icons/bs";
import { FaThumbsUp } from "react-icons/fa";
import type { EmployeeAbility } from "~/modules/resources";
import { AbilityEmployeeStatus, getTrainingStatus } from "~/modules/resources";
import { path } from "~/utils/path";

type PersonAbilitiesProps = {
  abilities: EmployeeAbility[];
};

const AbilityIcons: Record<
  AbilityEmployeeStatus,
  {
    color: string;
    bg: string;
    icon: IconType;
    description: string;
  }
> = {
  [AbilityEmployeeStatus.Complete]: {
    color: "white",
    bg: "green.500",
    icon: BsCheckLg,
    description: "Fully trained for",
  },
  [AbilityEmployeeStatus.InProgress]: {
    color: "white",
    bg: "blue.400",
    icon: BsBarChartFill,
    description: "Currently training for",
  },
  [AbilityEmployeeStatus.NotStarted]: {
    color: "gray.700",
    bg: "gray.200",
    icon: FaThumbsUp,
    description: "Not started training for",
  },
};

const PersonAbilities = ({ abilities }: PersonAbilitiesProps) => {
  return (
    <Card w="full">
      <CardHeader>
        <Heading size="h3">Abilities</Heading>
      </CardHeader>
      <CardBody>
        {abilities?.length > 0 ? (
          <List spacing={4}>
            {abilities.map((employeeAbility) => {
              const abilityStatus =
                getTrainingStatus(employeeAbility) ??
                AbilityEmployeeStatus.NotStarted;

              const { color, bg, icon, description } =
                AbilityIcons[abilityStatus];

              if (
                !employeeAbility.ability ||
                Array.isArray(employeeAbility.ability)
              ) {
                return null;
              }

              return (
                <ListItem key={employeeAbility.id}>
                  <Grid
                    key={employeeAbility.id}
                    gridTemplateColumns="auto 1fr auto"
                    gridColumnGap={4}
                  >
                    <Center
                      bg={bg}
                      borderRadius="full"
                      color={color}
                      h={10}
                      w={10}
                    >
                      <Icon as={icon} w={5} h={5} />
                    </Center>
                    <Flex h="full" alignItems="center">
                      <p>
                        {description}{" "}
                        <Link
                          className="font-bold"
                          to={path.to.employeeAbility(
                            employeeAbility.ability.id,
                            employeeAbility.id
                          )}
                        >
                          {employeeAbility.ability.name}
                        </Link>
                      </p>
                    </Flex>
                    <Flex h="full" alignItems="center">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(employeeAbility.lastTrainingDate, {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </Flex>
                  </Grid>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <div className="text-muted-foreground text-center p-4 w-full">
            No abilities added
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PersonAbilities;
