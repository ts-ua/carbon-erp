import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Menubar,
  MenubarItem,
  VStack,
  useDisclosure,
} from "@carbon/react";
import { Stack } from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { useMemo, useState } from "react";
import { usePermissions, useRouteData } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { PurchaseInvoice } from "~/modules/invoicing";
import {
  PurchaseInvoicingStatus,
  usePurchaseInvoiceTotals,
} from "~/modules/invoicing";
import { path } from "~/utils/path";
import PurchaseInvoicePostModal from "../PurchaseInvoicePostModal";

const PurchaseInvoiceHeader = () => {
  const permissions = usePermissions();
  const { invoiceId } = useParams();
  const postingModal = useDisclosure();

  const { supabase } = useSupabase();
  const [linesNotAssociatedWithPO, setLinesNotAssociatedWithPO] = useState<
    { partId: string | null; quantity: number }[]
  >([]);

  if (!invoiceId) throw new Error("invoiceId not found");

  const routeData = useRouteData<{ purchaseInvoice: PurchaseInvoice }>(
    path.to.purchaseInvoice(invoiceId)
  );

  if (!routeData?.purchaseInvoice) throw new Error("purchaseInvoice not found");
  const { purchaseInvoice } = routeData;

  const isPosted = purchaseInvoice.postingDate !== null;

  const [purchaseInvoiceTotals] = usePurchaseInvoiceTotals();

  // TODO: factor in default currency, po currency and exchange rate
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  const showPostModal = async () => {
    // check if there are any lines that are not associated with a PO
    if (!supabase) throw new Error("supabase not found");
    const { data, error } = await supabase
      .from("purchaseInvoiceLine")
      .select("partId, quantity")
      .eq("invoiceId", invoiceId)
      .eq("invoiceLineType", "Part")
      .is("purchaseOrderLineId", null);

    if (error) throw new Error(error.message);
    if (!data) return;

    // so that we can ask the user if they want to receive those lines
    setLinesNotAssociatedWithPO(data ?? []);
    postingModal.onOpen();
  };

  return (
    <>
      <VStack>
        {permissions.is("employee") && (
          <Menubar>
            <MenubarItem
              isDisabled={!permissions.can("update", "invoicing") || isPosted}
              onClick={showPostModal}
            >
              Post
            </MenubarItem>
          </Menubar>
        )}

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{purchaseInvoice.invoiceId}</CardTitle>
            <CardDescription>{purchaseInvoice.supplierName}</CardDescription>
          </CardHeader>

          <CardContent>
            <Stack direction={["column", "column", "row"]} spacing={8}>
              <Stack
                direction={["row", "row", "column"]}
                alignItems="start"
                justifyContent="space-between"
              >
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-bold">
                  {formatter.format(purchaseInvoiceTotals?.total ?? 0)}
                </span>
              </Stack>
              <Stack
                direction={["row", "row", "column"]}
                alignItems="start"
                justifyContent="space-between"
              >
                <span className="text-sm text-muted-foreground">
                  Date Issued
                </span>
                <span className="font-bold">{purchaseInvoice.dateIssued}</span>
              </Stack>

              <Stack
                direction={["row", "row", "column"]}
                alignItems="start"
                justifyContent="space-between"
              >
                <span className="text-sm text-muted-foreground">Status</span>
                <PurchaseInvoicingStatus status={purchaseInvoice.status} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </VStack>
      <PurchaseInvoicePostModal
        invoiceId={invoiceId}
        isOpen={postingModal.isOpen}
        onClose={postingModal.onClose}
        linesToReceive={linesNotAssociatedWithPO}
      />
    </>
  );
};

export default PurchaseInvoiceHeader;
