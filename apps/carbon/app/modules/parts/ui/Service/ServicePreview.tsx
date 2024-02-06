import {
  Button,
  Card,
  CardAction,
  CardAttribute,
  CardAttributeLabel,
  CardAttributeValue,
  CardAttributes,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
} from "@carbon/react";
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
        <CardAttributes>
          <CardAttribute>
            <CardAttributeLabel>Type</CardAttributeLabel>
            <CardAttributeValue>
              {routeData?.service?.serviceType}
            </CardAttributeValue>
          </CardAttribute>
          <CardAttribute>
            <CardAttributeLabel>Part Group</CardAttributeLabel>
            <CardAttributeValue>
              {routeData?.service?.partGroup}
            </CardAttributeValue>
          </CardAttribute>
        </CardAttributes>
      </CardContent>
    </Card>
  );
};

export default ServicePreview;
