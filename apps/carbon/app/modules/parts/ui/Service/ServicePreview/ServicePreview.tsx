import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { FaHistory } from "react-icons/fa";
import { useRouteData } from "~/hooks";
import type { Service } from "~/modules/parts";
import { path } from "~/utils/path";

const ServicePreview = () => {
  const { serviceId } = useParams();
  if (!serviceId) throw new Error("serviceId not found");

  const routeData = useRouteData<{ service: Service }>(
    path.to.service(serviceId)
  );

  return (
    <Card w="full">
      <CardHeader>
        <HStack justifyContent="space-between" alignItems="start">
          <Stack direction="column" spacing={2}>
            <Heading size="md">{routeData?.service?.name}</Heading>
            <Text color="gray.500" noOfLines={1}>
              {routeData?.service?.description}
            </Text>
          </Stack>
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
            <Text color="gray.500">Type</Text>
            <Text fontWeight="bold">{routeData?.service?.serviceType}</Text>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <Text color="gray.500">Service Group</Text>
            <Text fontWeight="bold">{routeData?.service?.serviceGroup}</Text>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default ServicePreview;
