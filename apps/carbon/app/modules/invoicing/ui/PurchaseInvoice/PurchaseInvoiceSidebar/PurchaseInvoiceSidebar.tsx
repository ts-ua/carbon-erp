import { Count, VStack, useColor } from "@carbon/react";
import { Button } from "@chakra-ui/react";
import { Link, useMatches, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type { PurchaseInvoiceLine } from "~/modules/invoicing";
import { path } from "~/utils/path";
import { usePurchaseInvoiceSidebar } from "./usePurchaseInvoiceSidebar";

const PurchaseInvoiceSidebar = () => {
  const { invoiceId } = useParams();
  const borderColor = useColor("gray.200");
  if (!invoiceId)
    throw new Error(
      "PurchaseInvoiceSidebar requires an invoiceId and could not find invoiceId in params"
    );

  const routeData = useRouteData<{
    purchaseInvoiceLines: PurchaseInvoiceLine[];
  }>(path.to.purchaseInvoice(invoiceId));

  const links = usePurchaseInvoiceSidebar({
    lines: routeData?.purchaseInvoiceLines.length ?? 0,
  });
  const matches = useMatches();

  return (
    <VStack className="h-full">
      <div className="overflow-y-auto h-full w-full">
        <VStack>
          <VStack spacing={1}>
            {links.map((route) => {
              const isActive = matches.some(
                (match) =>
                  (match.pathname.includes(route.to) && route.to !== "") ||
                  (match.id.includes(".index") && route.to === "")
              );

              return (
                <Button
                  key={route.name}
                  as={Link}
                  to={route.to}
                  variant={isActive ? "solid" : "ghost"}
                  border={isActive ? "1px solid" : "none"}
                  borderColor={borderColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  justifyContent={
                    route.count === undefined ? "start" : "space-between"
                  }
                  size="md"
                  w="full"
                >
                  <span>{route.name}</span>
                  {route.count !== undefined && <Count count={route.count} />}
                </Button>
              );
            })}
          </VStack>
        </VStack>
      </div>
    </VStack>
  );
};

export default PurchaseInvoiceSidebar;
