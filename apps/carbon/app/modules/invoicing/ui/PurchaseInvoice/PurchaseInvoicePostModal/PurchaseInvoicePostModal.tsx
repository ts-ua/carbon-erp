import {
  Button,
  HStack,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UnorderedList,
} from "@chakra-ui/react";
import { Form } from "@remix-run/react";
import { path } from "~/utils/path";

type PurchaseInvoicePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  linesToReceive: { partId: string | null; quantity: number }[];
};

const PurchaseInvoicePostModal = ({
  isOpen,
  onClose,
  invoiceId,
  linesToReceive,
}: PurchaseInvoicePostModalProps) => {
  const hasLinesToReceive = linesToReceive.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Post Invoice</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {hasLinesToReceive ? (
            <>
              <p>
                Are you sure you want to post this invoice? A receipt will be
                automatically created and posted for:
              </p>
              <UnorderedList mt={2}>
                {linesToReceive.map((line) => (
                  <ListItem key={line.partId}>
                    {`${line.partId} (${line.quantity})`}
                  </ListItem>
                ))}
              </UnorderedList>
            </>
          ) : (
            <p>Are you sure you want to post this invoice?</p>
          )}
        </ModalBody>

        <ModalFooter>
          <HStack spacing={2}>
            <Button colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Form method="post" action={path.to.purchaseInvoicePost(invoiceId)}>
              <Button colorScheme="brand" type="submit">
                {hasLinesToReceive
                  ? "Post and Receive Invoice"
                  : "Post Invoice"}
              </Button>
            </Form>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PurchaseInvoicePostModal;
