import { HStack, Heading, VStack } from "@carbon/react";
import { Button, Card, CardBody, CardHeader, Stack } from "@chakra-ui/react";
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
    <Card w="full">
      <CardHeader>
        <HStack className="justify-between align-start">
          <VStack spacing={0}>
            <Heading size="h3">{routeData?.partSummary?.id}</Heading>
            <span className="text-muted-foreground">
              {routeData?.partSummary?.name}
            </span>
          </VStack>
          <Button onClick={() => alert("TODO")} leftIcon={<FaHistory />}>
            View History
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <Stack direction={["column", "column", "row"]} spacing={8}>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <span className="text-muted-foreground">Replenishment System</span>
            <span className="font-bold">
              {routeData?.partSummary?.replenishmentSystem}
            </span>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <span className="text-muted-foreground">Part Type</span>
            <span className="font-bold">
              {routeData?.partSummary?.partType}
            </span>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <span className="text-muted-foreground">Unit of Measure</span>
            <span className="font-bold">
              {routeData?.partSummary?.unitOfMeasureCode}
            </span>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default PartPreview;
