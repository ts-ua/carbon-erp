import { Heading } from "@carbon/react";
import { formatDate } from "@carbon/utils";
import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  Icon,
  List,
  ListItem,
} from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import clsx from "clsx";
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
    icon: IconType;
    description: string;
  }
> = {
  [AbilityEmployeeStatus.Complete]: {
    icon: BsCheckLg,
    description: "Fully trained for",
  },
  [AbilityEmployeeStatus.InProgress]: {
    icon: BsBarChartFill,
    description: "Currently training for",
  },
  [AbilityEmployeeStatus.NotStarted]: {
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

              const { description, icon } = AbilityIcons[abilityStatus];

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
                    <div
                      className={clsx(
                        "flex h-10 w-10 rounded-full items-center justify-center",
                        {
                          "bg-green-500 text-white":
                            abilityStatus === AbilityEmployeeStatus.Complete,
                          "bg-blue-400 text-white dark:bg-blue-500 dark:text-white":
                            abilityStatus === AbilityEmployeeStatus.InProgress,
                          "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200":
                            abilityStatus === AbilityEmployeeStatus.NotStarted,
                        }
                      )}
                    >
                      <Icon as={icon} w={5} h={5} />
                    </div>
                    <div className="flex h-full items-center">
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
                    </div>
                    <div className="flex h-full items-center">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(employeeAbility.lastTrainingDate, {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
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
