import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@carbon/react";

import { Form } from "@remix-run/react";

type ConfirmProps = {
  action?: string;
  isOpen?: boolean;
  name: string;
  text: string;
  onCancel: () => void;
  onSubmit?: () => void;
};

const Confirm = ({
  action,
  isOpen = true,
  name,
  text,
  onCancel,
  onSubmit,
}: ConfirmProps) => {
  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{name}</ModalTitle>
        </ModalHeader>
        <ModalBody>{text}</ModalBody>
        <ModalFooter>
          <Button variant="secondary" className="mr-3" onClick={onCancel}>
            Cancel
          </Button>
          <Form method="post" action={action} onSubmit={onSubmit}>
            <Button type="submit">Confirm</Button>
          </Form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Confirm;
