import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  HStack,
  useDisclosure,
} from "@carbon/react";
import { Button, List, ListItem } from "@chakra-ui/react";
import { Link, Outlet, useNavigate, useParams } from "@remix-run/react";
import { useCallback, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { Address } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions } from "~/hooks";
import type { SupplierLocation } from "~/modules/purchasing/types";
import { path } from "~/utils/path";

type SupplierLocationsProps = {
  locations: SupplierLocation[];
};

const SupplierLocations = ({ locations }: SupplierLocationsProps) => {
  const navigate = useNavigate();
  const { supplierId } = useParams();
  if (!supplierId) throw new Error("supplierId not found");
  const permissions = usePermissions();
  const canEdit = permissions.can("create", "purchasing");
  const isEmpty = locations === undefined || locations?.length === 0;

  const deleteLocationModal = useDisclosure();
  const [selectedLocation, setSelectedLocation] = useState<SupplierLocation>();

  const getActions = useCallback(
    (location: SupplierLocation) => {
      const actions = [];
      if (permissions.can("update", "purchasing")) {
        actions.push({
          label: "Edit Location",
          icon: <BsPencilSquare />,
          onClick: () => {
            navigate(location.id);
          },
        });
      }
      if (permissions.can("delete", "purchasing")) {
        actions.push({
          label: "Delete Location",
          icon: <IoMdTrash />,
          onClick: () => {
            setSelectedLocation(location);
            deleteLocationModal.onOpen();
          },
        });
      }

      if (permissions.can("create", "resources")) {
        actions.push({
          label: "Add Partner",
          icon: <IoMdAdd />,
          onClick: () => {
            navigate(
              `${path.to.newPartner}?id=${location.id}&supplierId=${supplierId}`
            );
          },
        });
      }

      return actions;
    },
    [permissions, deleteLocationModal, navigate, supplierId]
  );

  return (
    <>
      <Card className="w-full">
        <HStack className="justify-between items-start">
          <CardHeader>
            <CardTitle>Locations</CardTitle>
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
            <div className="my-8 text-center w-full">
              <p className="text-muted-foreground text-sm">
                You haven’t created any locations yet.
              </p>
            </div>
          ) : (
            <List w="full" spacing={4}>
              {locations?.map((location) => (
                <ListItem key={location.id}>
                  {location.address && !Array.isArray(location.address) ? (
                    <Address
                      address={location.address}
                      actions={getActions(location)}
                    />
                  ) : null}
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {selectedLocation && selectedLocation.id && (
        <ConfirmDelete
          action={path.to.deleteSupplierLocation(
            supplierId,
            selectedLocation.id
          )}
          name={selectedLocation.address?.city ?? ""}
          text="Are you sure you want to delete this location?"
          isOpen={deleteLocationModal.isOpen}
          onCancel={deleteLocationModal.onClose}
          onSubmit={deleteLocationModal.onClose}
        />
      )}

      <Outlet />
    </>
  );
};

export default SupplierLocations;
