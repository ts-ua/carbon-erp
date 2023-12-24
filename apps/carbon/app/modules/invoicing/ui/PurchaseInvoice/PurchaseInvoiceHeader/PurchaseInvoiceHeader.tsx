import { Heading, Menubar, MenubarItem } from "@carbon/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { useMemo, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { usePermissions, useRouteData } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { PurchaseInvoice, PurchaseInvoiceLine } from "~/modules/invoicing";
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
    PurchaseInvoiceLine[]
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
    setLinesNotAssociatedWithPO(data);
    postingModal.onOpen();
  };

  return (
    <>
      <VStack w="full" alignItems="start" spacing={2}>
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

        <Card w="full">
          <CardHeader>
            <HStack justifyContent="space-between" alignItems="start">
              <Stack direction="column" spacing={2}>
                <Heading size="h3">{purchaseInvoice.invoiceId}</Heading>
                <Text color="gray.500" fontWeight="normal">
                  {purchaseInvoice.supplierName}
                </Text>
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
                <Text color="gray.500">Total</Text>
                <Text fontWeight="bold">
                  {formatter.format(purchaseInvoiceTotals?.total ?? 0)}
                </Text>
              </Stack>
              <Stack
                direction={["row", "row", "column"]}
                alignItems="start"
                justifyContent="space-between"
              >
                <Text color="gray.500">Date Issued</Text>
                <Text fontWeight="bold">{purchaseInvoice.dateIssued}</Text>
              </Stack>

              <Stack
                direction={["row", "row", "column"]}
                alignItems="start"
                justifyContent="space-between"
              >
                <Text color="gray.500">Status</Text>
                <PurchaseInvoicingStatus status={purchaseInvoice.status} />
              </Stack>
            </Stack>
          </CardBody>
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
