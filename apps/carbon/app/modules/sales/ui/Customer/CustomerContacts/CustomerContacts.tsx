import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  HStack,
} from "@carbon/react";
import { Button, List, ListItem, useDisclosure } from "@chakra-ui/react";
import { Link, Outlet, useNavigate, useParams } from "@remix-run/react";
import { useCallback, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { Contact } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions } from "~/hooks";
import type { CustomerContact } from "~/modules/sales/types";
import { path } from "~/utils/path";

type CustomerContactsProps = {
  contacts: CustomerContact[];
};

const CustomerContacts = ({ contacts }: CustomerContactsProps) => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  if (!customerId) throw new Error("customerId not found");
  const permissions = usePermissions();
  const canEdit = permissions.can("create", "sales");
  const isEmpty = contacts === undefined || contacts?.length === 0;

  const deleteContactModal = useDisclosure();
  const [contact, setSelectedContact] = useState<CustomerContact | null>(null);

  const getActions = useCallback(
    (contact: CustomerContact) => {
      const actions = [];

      actions.push({
        label: permissions.can("update", "sales")
          ? "Edit Contact"
          : "View Contact",
        icon: <BsPencilSquare />,
        onClick: () => {
          navigate(contact.id);
        },
      });

      if (permissions.can("delete", "sales")) {
        actions.push({
          label: "Delete Contact",
          icon: <IoMdTrash />,
          onClick: () => {
            setSelectedContact(contact);
            deleteContactModal.onOpen();
          },
        });
      }

      if (permissions.can("create", "users") && contact.user === null) {
        actions.push({
          label: "Create Account",
          icon: <IoMdAdd />,
          onClick: () => {
            navigate(
              `${path.to.newCustomerAccount}?id=${contact.id}&customer=${customerId}`
            );
          },
        });
      }

      return actions;
    },
    [permissions, deleteContactModal, navigate, customerId]
  );

  return (
    <>
      <Card>
        <HStack className="justify-between items-start">
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
          </CardHeader>
          <CardAction>
            {canEdit && (
              <Button colorScheme="brand" as={Link} to="new">
                New
              </Button>
            )}
          </CardAction>
        </HStack>
        <CardContent>
          {isEmpty ? (
            <div className="w-full my-8 text-center">
              <p className="text-muted-foreground text-sm">
                You haven’t created any contacts yet.
              </p>
            </div>
          ) : (
            <List w="full" spacing={4}>
              {contacts?.map((contact) => (
                <ListItem key={contact.id}>
                  {contact.contact &&
                  !Array.isArray(contact.contact) &&
                  !Array.isArray(contact.user) ? (
                    <Contact
                      contact={contact.contact}
                      url={path.to.customerContact(customerId, contact.id!)}
                      user={contact.user}
                      actions={getActions(contact)}
                    />
                  ) : null}
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {contact && contact.id && (
        <ConfirmDelete
          action={path.to.deleteCustomerContact(customerId, contact.id)}
          isOpen={deleteContactModal.isOpen}
          name={`${contact?.contact?.firstName} ${contact?.contact?.lastName}`}
          text="Are you sure you want to delete this contact?"
          onCancel={deleteContactModal.onClose}
          onSubmit={deleteContactModal.onClose}
        />
      )}

      <Outlet />
    </>
  );
};

export default CustomerContacts;
