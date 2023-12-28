import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  HStack,
  useDisclosure,
} from "@carbon/react";
import { List, ListItem } from "@chakra-ui/react";
import { Link, Outlet, useNavigate, useParams } from "@remix-run/react";
import { useCallback, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { Contact } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions } from "~/hooks";
import type { SupplierContact } from "~/modules/purchasing/types";
import { path } from "~/utils/path";

type SupplierContactsProps = {
  contacts: SupplierContact[];
};

const SupplierContacts = ({ contacts }: SupplierContactsProps) => {
  const navigate = useNavigate();
  const { supplierId } = useParams();
  if (!supplierId) throw new Error("supplierId not found");
  const permissions = usePermissions();
  const canEdit = permissions.can("create", "purchasing");
  const isEmpty = contacts === undefined || contacts?.length === 0;

  const deleteContactModal = useDisclosure();
  const [selectedContact, setSelectedContact] = useState<SupplierContact>();

  const getActions = useCallback(
    (contact: SupplierContact) => {
      const actions = [];
      actions.push({
        label: permissions.can("update", "purchasing")
          ? "Edit Contact"
          : "View Contact",
        icon: <BsPencilSquare />,
        onClick: () => {
          navigate(contact.id);
        },
      });

      if (permissions.can("delete", "purchasing")) {
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
              `${path.to.newSupplierAccount}?id=${contact.id}&supplier=${supplierId}`
            );
          },
        });
      }

      if (permissions.can("create", "resources")) {
        actions.push({
          label: "Add Contractor",
          icon: <IoMdAdd />,
          onClick: () => {
            navigate(
              `${path.to.newContractor}?id=${contact.id}&supplierId=${supplierId}`
            );
          },
        });
      }

      return actions;
    },
    [permissions, deleteContactModal, navigate, supplierId]
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
              <Button asChild>
                <Link to="new">New</Link>
              </Button>
            )}
          </CardAction>
        </HStack>
        <CardContent>
          {isEmpty ? (
            <div className="my-8 text-center w-full">
              <p className="text-muted-foreground text-sm">
                You haven't created any contacts yet.
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
                      url={path.to.supplierContact(supplierId, contact.id)}
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

      {selectedContact && selectedContact.id && (
        <ConfirmDelete
          action={path.to.deleteSupplierContact(supplierId, selectedContact.id)}
          isOpen={deleteContactModal.isOpen}
          name={`${selectedContact.contact?.firstName} ${selectedContact.contact?.lastName}`}
          text="Are you sure you want to delete this contact?"
          onCancel={deleteContactModal.onClose}
          onSubmit={deleteContactModal.onClose}
        />
      )}

      <Outlet />
    </>
  );
};

export default SupplierContacts;
