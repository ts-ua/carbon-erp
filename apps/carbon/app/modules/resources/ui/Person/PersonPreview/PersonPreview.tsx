import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
} from "@carbon/react";
import { Stack } from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { Avatar } from "~/components";
import { useRouteData } from "~/hooks";
import type { EmployeeSummary } from "~/modules/resources";
import { path } from "~/utils/path";

const PartPreview = () => {
  const { personId } = useParams();
  if (!personId) throw new Error("personId not found");

  const routeData = useRouteData<{ employeeSummary: EmployeeSummary }>(
    path.to.person(personId)
  );

  return (
    <Card>
      <HStack className="justify-between items-center p-6 pl-0">
        <CardHeader className="pt-0">
          <CardTitle>{routeData?.employeeSummary?.name}</CardTitle>
          <CardDescription>{routeData?.employeeSummary?.title}</CardDescription>
        </CardHeader>
        <Avatar
          size="lg"
          name={routeData?.employeeSummary?.name ?? undefined}
          path={routeData?.employeeSummary?.avatarUrl}
        />
      </HStack>
      <CardContent>
        <Stack direction={["column", "column", "row"]} spacing={8}>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <span className="text-sm text-muted-foreground">Department</span>
            <span className="font-bold">
              {routeData?.employeeSummary?.departmentName}
            </span>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <span className="text-sm text-muted-foreground">Location</span>
            <span className="font-bold">
              {routeData?.employeeSummary?.locationName}
            </span>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <span className="text-sm text-muted-foreground">Manager</span>
            <span className="font-bold">
              {routeData?.employeeSummary?.managerName}
            </span>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <span className="text-sm text-muted-foreground">Start Date</span>
            <span className="font-bold">
              {routeData?.employeeSummary?.startDate}
            </span>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PartPreview;
