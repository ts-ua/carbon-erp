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
        <CardAttributes>
          <CardAttribute>
            <CardAttributeLabel>Replenishment System</CardAttributeLabel>
            <CardAttributeValue>
              {routeData?.partSummary?.replenishmentSystem}
            </CardAttributeValue>
          </CardAttribute>
          <CardAttribute>
            <CardAttributeLabel>Part Type</CardAttributeLabel>
            <CardAttributeValue>
              {routeData?.partSummary?.partType}
            </CardAttributeValue>
          </CardAttribute>
          <CardAttribute>
            <CardAttributeLabel>Unit of Measure</CardAttributeLabel>
            <CardAttributeValue>
              {routeData?.partSummary?.unitOfMeasureCode}
            </CardAttributeValue>
          </CardAttribute>
        </CardAttributes>
      </CardContent>
    </Card>
  );
};

export default PartPreview;
