import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
} from "@carbon/react";
import { Stack } from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { FaHistory } from "react-icons/fa";
import { useRouteData } from "~/hooks";
import type { PartSummary } from "~/modules/parts";
import { path } from "~/utils/path";

const PartPreview = () => {
  const { partId } = useParams();
  if (!partId) throw new Error("partId not found");

  const routeData = useRouteData<{ partSummary: PartSummary }>(
    path.to.part(partId)
  );

  return (
    <Card>
      <HStack className="justify-between items-start">
        <CardHeader>
          <CardTitle>{routeData?.partSummary?.id}</CardTitle>
          <CardDescription>{routeData?.partSummary?.name}</CardDescription>
        </CardHeader>
        <CardAction>
          <Button
            variant="secondary"
            onClick={() => alert("TODO")}
            leftIcon={<FaHistory />}
          >
            View History
          </Button>
        </CardAction>
      </HStack>
      <CardContent>
        <Stack direction={["column", "column", "row"]} spacing={8}>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <span className="text-sm text-muted-foreground">
              Replenishment System
            </span>
            <span className="font-bold">
              {routeData?.partSummary?.replenishmentSystem}
            </span>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <span className="text-sm text-muted-foreground">Part Type</span>
            <span className="font-bold">
              {routeData?.partSummary?.partType}
            </span>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <span className="text-sm text-muted-foreground">
              Unit of Measure
            </span>
            <span className="font-bold">
              {routeData?.partSummary?.unitOfMeasureCode}
            </span>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PartPreview;
