import { Heading, VStack } from "@carbon/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
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
        <HStack justifyContent="space-between" alignItems="start">
          <VStack spacing={0}>
            <Heading size="h3">{routeData?.partSummary?.id}</Heading>
            <Text color="gray.500">{routeData?.partSummary?.name}</Text>
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
            <Text color="gray.500">Replenishment System</Text>
            <Text fontWeight="bold">
              {routeData?.partSummary?.replenishmentSystem}
            </Text>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <Text color="gray.500">Part Type</Text>
            <Text fontWeight="bold">{routeData?.partSummary?.partType}</Text>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <Text color="gray.500">Unit of Measure</Text>
            <Text fontWeight="bold">
              {routeData?.partSummary?.unitOfMeasureCode}
            </Text>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default PartPreview;
