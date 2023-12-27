import { Heading, HStack, VStack } from "@carbon/react";
import { Button, Card, CardBody, CardHeader, Stack } from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { FaHistory } from "react-icons/fa";
import { useRouteData } from "~/hooks";
import type {
  SupplierDetail,
  SupplierStatus,
  SupplierType,
} from "~/modules/purchasing";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";

const SupplierHeader = () => {
  const { supplierId } = useParams();
  if (!supplierId) throw new Error("Could not find supplierId");
  const routeData = useRouteData<{ supplier: SupplierDetail }>(
    path.to.supplier(supplierId)
  );

  const sharedSupplierData = useRouteData<{
    supplierTypes: SupplierType[];
    supplierStatuses: SupplierStatus[];
    paymentTerms: ListItem[];
  }>(path.to.supplierRoot);

  return (
    <VStack>
      <Card w="full">
        <CardHeader>
          <HStack className="justify-between items-center">
            <Stack direction="column" spacing={2}>
              <Heading size="h3">{routeData?.supplier?.name}</Heading>
            </Stack>
            <Button onClick={() => alert("TODO")} leftIcon={<FaHistory />}>
              Supplier Details
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
                {sharedSupplierData?.supplierTypes?.find(
                  (type) => type.id === routeData?.supplier?.supplierTypeId
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
                {sharedSupplierData?.supplierStatuses?.find(
                  (status) =>
                    status.id === routeData?.supplier?.supplierStatusId
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
                {/* // TODO: defaultPaymentTermId */}
                {sharedSupplierData?.paymentTerms?.find(
                  (term) =>
                    term.id === routeData?.supplier?.defaultPaymentTermId
                )?.name ?? "--"}
              </span>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default SupplierHeader;
