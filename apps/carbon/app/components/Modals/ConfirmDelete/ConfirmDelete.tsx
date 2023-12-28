import { Button } from "@carbon/react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Form } from "@remix-run/react";

type ConfirmDeleteProps = {
  action: string;
  isOpen?: boolean;
  name: string;
  text: string;
  onCancel: () => void;
  onSubmit?: () => void;
};

const ConfirmDelete = ({
  action,
  isOpen = true,
  name,
  text,
  onCancel,
  onSubmit,
}: ConfirmDeleteProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{text}</ModalBody>

        <ModalFooter>
          <Button variant="secondary" className="mr-3" onClick={onCancel}>
            Cancel
          </Button>
          <Form method="post" action={action} onSubmit={onSubmit}>
            <Button variant="destructive" type="submit">
              Delete
            </Button>
          </Form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDelete;
