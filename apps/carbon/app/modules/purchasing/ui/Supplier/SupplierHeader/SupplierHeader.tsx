import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  HStack,
  VStack,
} from "@carbon/react";
import { Stack } from "@chakra-ui/react";
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
      <Card>
        <HStack className="justify-between items-start">
          <CardHeader>
            <CardTitle>{routeData?.supplier?.name}</CardTitle>
          </CardHeader>
          <CardAction>
            <Button
              variant="secondary"
              onClick={() => alert("TODO")}
              leftIcon={<FaHistory />}
            >
              Supplier Details
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
              <span className="text-sm text-muted-foreground">Status</span>
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
              <span className="text-sm text-muted-foreground">
                Payment Terms
              </span>
              <span className="font-bold">
                {/* // TODO: defaultPaymentTermId */}
                {sharedSupplierData?.paymentTerms?.find(
                  (term) =>
                    term.id === routeData?.supplier?.defaultPaymentTermId
                )?.name ?? "--"}
              </span>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </VStack>
  );
};

export default SupplierHeader;
