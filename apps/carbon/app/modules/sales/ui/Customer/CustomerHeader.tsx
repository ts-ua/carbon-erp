import {
  Button,
  Card,
  CardAction,
  CardAttribute,
  CardAttributeLabel,
  CardAttributeValue,
  CardAttributes,
  CardContent,
  CardHeader,
  CardTitle,
  HStack,
  VStack,
} from "@carbon/react";

import { useParams } from "@remix-run/react";
import { FaHistory } from "react-icons/fa";
import { useRouteData } from "~/hooks";
import type {
  CustomerDetail,
  CustomerStatus,
  CustomerType,
} from "~/modules/sales";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";

const CustomerHeader = () => {
  const { customerId } = useParams();
  if (!customerId) throw new Error("Could not find customerId");
  const routeData = useRouteData<{ customer: CustomerDetail }>(
    path.to.customer(customerId)
  );
  const sharedCustomerData = useRouteData<{
    customerTypes: CustomerType[];
    customerStatuses: CustomerStatus[];
    paymentTerms: ListItem[];
  }>(path.to.customerRoot);

  return (
    <VStack>
      <Card>
        <HStack className="justify-between items-start">
          <CardHeader>
            <CardTitle>{routeData?.customer?.name}</CardTitle>
          </CardHeader>
          <CardAction>
            <Button onClick={() => alert("TODO")} leftIcon={<FaHistory />}>
              Customer Details
            </Button>
          </CardAction>
        </HStack>
        <CardContent>
          <CardAttributes>
            <CardAttribute>
              <CardAttributeLabel>Type</CardAttributeLabel>
              <CardAttributeValue>
                {sharedCustomerData?.customerTypes?.find(
                  (type) => type.id === routeData?.customer?.customerTypeId
                )?.name ?? "--"}
              </CardAttributeValue>
            </CardAttribute>
            <CardAttribute>
              <CardAttributeLabel>Status</CardAttributeLabel>
              <CardAttributeValue>
                {sharedCustomerData?.customerStatuses?.find(
                  (status) =>
                    status.id === routeData?.customer?.customerStatusId
                )?.name ?? "--"}
              </CardAttributeValue>
            </CardAttribute>
            {/* <CardAttribute>
              <CardAttributeLabel>Payment Terms</CardAttributeLabel>
              <CardAttributeValue>
               
              </CardAttributeValue>
            </CardAttribute> */}
          </CardAttributes>
        </CardContent>
      </Card>
    </VStack>
  );
};

export default CustomerHeader;
