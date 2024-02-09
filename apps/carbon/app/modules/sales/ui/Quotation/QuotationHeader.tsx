import {
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
  Menubar,
  MenubarItem,
  VStack,
  useDisclosure,
} from "@carbon/react";
import { useParams } from "@remix-run/react";
import { useMemo } from "react";
import { usePermissions, useRouteData } from "~/hooks";
import type { Quotation } from "~/modules/sales";
import { useQuotationTotals } from "~/modules/sales";
import { path } from "~/utils/path";
// import { useQuotation } from "../Quotations/useQuotation";
import QuotationReleaseModal from "./QuotationReleaseModal";
import QuotationStatus from "./QuotationStatus";

const QuotationHeader = () => {
  const permissions = usePermissions();
  const { id } = useParams();
  if (!id) throw new Error("Could not find id");

  const routeData = useRouteData<{ quotation: Quotation }>(path.to.quote(id));

  if (!routeData?.quotation) throw new Error("quotation not found");
  // const isReleased = !["Draft", "Replied"].includes(
  //   routeData?.quotation?.status ?? ""
  // );

  const [quotationTotals] = useQuotationTotals();

  // TODO: factor in default currency, quote currency and exchange rate
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  // const {} = useQuotation();
  const releaseDisclosure = useDisclosure();

  return (
    <>
      <VStack>
        {permissions.is("employee") && (
          <Menubar>
            <MenubarItem asChild>
              <a target="_blank" href={path.to.file.quote(id)} rel="noreferrer">
                Preview
              </a>
            </MenubarItem>
          </Menubar>
        )}

        <Card>
          <HStack className="justify-between items-start">
            <CardHeader>
              <CardTitle>{routeData?.quotation?.quoteId}</CardTitle>
              <CardDescription>
                {routeData?.quotation?.customerName}
              </CardDescription>
            </CardHeader>
            <CardAction></CardAction>
          </HStack>
          <CardContent>
            <CardAttributes>
              <CardAttribute>
                <CardAttributeLabel>Total</CardAttributeLabel>
                <CardAttributeValue>
                  {formatter.format(quotationTotals?.total ?? 0)}
                </CardAttributeValue>
              </CardAttribute>
              <CardAttribute>
                <CardAttributeLabel>Quote Date</CardAttributeLabel>
                <CardAttributeValue>
                  {routeData?.quotation?.quoteDate}
                </CardAttributeValue>
              </CardAttribute>

              <CardAttribute>
                <CardAttributeLabel>Expiration Date</CardAttributeLabel>
                <CardAttributeValue>
                  {routeData?.quotation?.expirationDate}
                </CardAttributeValue>
              </CardAttribute>
              <CardAttribute>
                <CardAttributeLabel>Location</CardAttributeLabel>
                <CardAttributeValue>
                  {routeData?.quotation?.locationName}
                </CardAttributeValue>
              </CardAttribute>

              <CardAttribute>
                <CardAttributeLabel>Status</CardAttributeLabel>
                <QuotationStatus status={routeData?.quotation?.status} />
              </CardAttribute>
            </CardAttributes>
          </CardContent>
        </Card>
      </VStack>
      {releaseDisclosure.isOpen && (
        <QuotationReleaseModal
          quotation={routeData?.quotation}
          onClose={releaseDisclosure.onClose}
        />
      )}
    </>
  );
};

export default QuotationHeader;
