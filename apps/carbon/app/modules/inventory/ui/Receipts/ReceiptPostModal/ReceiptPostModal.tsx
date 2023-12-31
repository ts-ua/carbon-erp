import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
} from "@carbon/react";
import { Form, useNavigate } from "@remix-run/react";

type ReceiptPostModalProps = {};

const ReceiptPostModal = (props: ReceiptPostModalProps) => {
  const navigate = useNavigate();

  const onCancel = () => navigate(-1);

  return (
    <Modal
      open={true}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Post Receipt</ModalTitle>
        </ModalHeader>
        <ModalBody>Are you sure you want to post this receipt?</ModalBody>
        <ModalFooter>
          <HStack>
            <Button variant="solid" onClick={onCancel}>
              Cancel
            </Button>
            <Form method="post">
              <Button type="submit">Post Receipt</Button>
            </Form>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReceiptPostModal;
