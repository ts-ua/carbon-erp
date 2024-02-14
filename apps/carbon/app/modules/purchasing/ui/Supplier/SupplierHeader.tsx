import {
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
            {/* <Button
              variant="secondary"
              onClick={() => alert("TODO")}
              leftIcon={<FaHistory />}
            >
              Supplier Details
            </Button> */}
          </CardAction>
        </HStack>
        <CardContent>
          <CardAttributes>
            <CardAttribute>
              <CardAttributeLabel>Type</CardAttributeLabel>
              <CardAttributeValue>
                {sharedSupplierData?.supplierTypes?.find(
                  (type) => type.id === routeData?.supplier?.supplierTypeId
                )?.name ?? "--"}
              </CardAttributeValue>
            </CardAttribute>
            <CardAttribute>
              <CardAttributeLabel>Status</CardAttributeLabel>
              <CardAttributeValue>
                {sharedSupplierData?.supplierStatuses?.find(
                  (status) =>
                    status.id === routeData?.supplier?.supplierStatusId
                )?.name ?? "--"}
              </CardAttributeValue>
            </CardAttribute>
            <CardAttribute>
              <CardAttributeLabel>Payment Terms</CardAttributeLabel>
              <CardAttributeValue>
                {/* // TODO: defaultPaymentTermId */}
                --
              </CardAttributeValue>
            </CardAttribute>
          </CardAttributes>
        </CardContent>
      </Card>
    </VStack>
  );
};

export default SupplierHeader;
