import {
  ActionMenu,
  Button,
  HStack,
  VStack,
  useDisclosure,
} from "@carbon/react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  MenuItem,
} from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { ConfirmDelete } from "~/components/Modals";
import { useUrlParams } from "~/hooks";
import type { EquipmentTypeDetailType } from "~/modules/resources";
import { path } from "~/utils/path";

type Equipment = {
  id: string;
  name: string;
};

type EquipmentTypeDetailProps = {
  equipmentType: EquipmentTypeDetailType;
  onClose: () => void;
};

const EquipmentTypeDetail = ({
  equipmentType,
  onClose,
}: EquipmentTypeDetailProps) => {
  const [params] = useUrlParams();

  const deleteModal = useDisclosure();
  const [selectedEquipment, setSelectedEquipment] = useState<
    Equipment | undefined
  >();

  const onDelete = (data?: Equipment) => {
    setSelectedEquipment(data);
    deleteModal.onOpen();
  };

  const onDeleteCancel = () => {
    setSelectedEquipment(undefined);
    deleteModal.onClose();
  };

  const renderContextMenu = (equipment: Equipment) => {
    return (
      <>
        <MenuItem as={Link} to={equipment.id} icon={<BsPencilSquare />}>
          Edit Unit
        </MenuItem>
        <MenuItem onClick={() => onDelete(equipment)} icon={<IoMdTrash />}>
          Delete Unit
        </MenuItem>
      </>
    );
  };

  return (
    <>
      <Drawer onClose={onClose} isOpen={true} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{equipmentType.name}</DrawerHeader>
          <DrawerBody>
            {Array.isArray(equipmentType?.equipment) && (
              <VStack spacing={4}>
                {equipmentType.equipment.map((equipment) => {
                  return (
                    <HStack key={equipment.id} className="w-full">
                      <VStack spacing={0} className="flex-grow">
                        <span className="font-bold">{equipment.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {/* @ts-ignore */}
                          {equipment.location?.name}
                        </span>
                      </VStack>
                      <ActionMenu>{renderContextMenu(equipment)}</ActionMenu>
                    </HStack>
                  );
                })}
              </VStack>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button asChild leftIcon={<IoMdAdd />} size="md">
              <Link to={`new?${params.toString()}`}>New Equipment</Link>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {selectedEquipment && selectedEquipment.id && (
        <ConfirmDelete
          isOpen={deleteModal.isOpen}
          action={path.to.deleteEquipment(selectedEquipment.id)}
          name={selectedEquipment?.name ?? ""}
          text={`Are you sure you want to deactivate ${selectedEquipment?.name}?`}
          onCancel={onDeleteCancel}
        />
      )}
    </>
  );
};

export default EquipmentTypeDetail;
