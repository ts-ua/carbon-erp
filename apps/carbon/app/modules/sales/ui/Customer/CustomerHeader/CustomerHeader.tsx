import { Heading, HStack, VStack } from "@carbon/react";
import { Button, Card, CardBody, CardHeader, Stack } from "@chakra-ui/react";
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
      <Card w="full">
        <CardHeader>
          <HStack className="justify-between items-start">
            <VStack>
              <Heading size="h3">{routeData?.customer?.name}</Heading>
            </VStack>
            <Button onClick={() => alert("TODO")} leftIcon={<FaHistory />}>
              Customer Details
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
              <span className="font-bold">
                {sharedCustomerData?.customerTypes?.find(
                  (type) => type.id === routeData?.customer?.customerTypeId
                )?.name ?? "--"}
              </span>
            </Stack>
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <span className="text-muted-foreground">Status</span>
              <span className="font-bold">
                {sharedCustomerData?.customerStatuses?.find(
                  (status) =>
                    status.id === routeData?.customer?.customerStatusId
                )?.name ?? "--"}
              </span>
            </Stack>
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <span className="text-muted-foreground">Payment Terms</span>
              <span className="font-bold">
                {sharedCustomerData?.paymentTerms?.find(
                  (term) =>
                    term.id === routeData?.customer?.defaultPaymentTermId
                )?.name ?? "--"}
              </span>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default CustomerHeader;
