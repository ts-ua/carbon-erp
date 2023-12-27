import { HStack, Heading } from "@carbon/react";
import { Button, Card, CardBody, CardHeader, Stack } from "@chakra-ui/react";
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
        <HStack className="justify-between items-start">
          <Stack direction="column" spacing={2}>
            <Heading size="h3">{routeData?.service?.name}</Heading>
            <p className="text-muted-foreground line-clamp-1">
              {routeData?.service?.description}
            </p>
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
            <span className="text-muted-foreground">Type</span>
            <span className="font-bold">{routeData?.service?.serviceType}</span>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <span className="text-muted-foreground">Part Group</span>
            <span className="font-bold">{routeData?.service?.partGroup}</span>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default ServicePreview;
