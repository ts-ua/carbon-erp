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
import { useFetcher } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { UserSelect } from "~/components/Selectors";
import { resendInviteValidator } from "~/modules/users";
import { path } from "~/utils/path";

type ResendInviteModalProps = {
  userIds: string[];
  isOpen: boolean;
  onClose: () => void;
};

const ResendInviteModal = ({
  userIds,
  isOpen,
  onClose,
}: ResendInviteModalProps) => {
  const fetcher = useFetcher();
  const isSingleUser = userIds.length === 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isSingleUser ? "Resend Invite" : "Resend Invites"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p className="mb-2">
            Are you sure you want to resend an invite to
            {isSingleUser ? " this user" : " these users"}?
          </p>
          <UserSelect value={userIds} readOnly isMulti />
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <ValidatedForm
              method="post"
              action={path.to.resendInvite}
              validator={resendInviteValidator}
              onSubmit={onClose}
              fetcher={fetcher}
            >
              {userIds.map((id, index) => (
                <input
                  key={id}
                  type="hidden"
                  name={`users[${index}]`}
                  value={id}
                />
              ))}
              <Button type="submit">Send</Button>
            </ValidatedForm>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResendInviteModal;
