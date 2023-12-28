import { Button, HStack } from "@carbon/react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Form, useNavigate } from "@remix-run/react";

type ReceiptPostModalProps = {};

const ReceiptPostModal = (props: ReceiptPostModalProps) => {
  const navigate = useNavigate();

  const onCancel = () => navigate(-1);

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Post Receipt</ModalHeader>
        <ModalCloseButton />
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
