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
import type { Service } from "~/modules/parts";
import { path } from "~/utils/path";

const ServicePreview = () => {
  const { serviceId } = useParams();
  if (!serviceId) throw new Error("serviceId not found");

  const routeData = useRouteData<{ service: Service }>(
    path.to.service(serviceId)
  );

  return (
    <Card>
      <HStack className="justify-between items-start">
        <CardHeader>
          <CardTitle>{routeData?.service?.name}</CardTitle>
          <CardDescription>{routeData?.service?.description}</CardDescription>
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
            <span className="text-sm text-muted-foreground">Type</span>
            <span className="font-bold">{routeData?.service?.serviceType}</span>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <span className="text-sm text-muted-foreground">Part Group</span>
            <span className="font-bold">{routeData?.service?.partGroup}</span>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ServicePreview;
