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
import { IoMdTrash } from "react-icons/io";
import { ConfirmDelete } from "~/components/Modals";
import { useUrlParams } from "~/hooks";
import type { WorkCellTypeDetailType } from "~/modules/resources";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";

type WorkCell = NonNullable<WorkCellTypeDetailType["workCell"]>;

type WorkCellTypeDetailProps = {
  workCellType: WorkCellTypeDetailType;
  onClose: () => void;
};

const WorkCellTypeDetail = ({
  workCellType,
  onClose,
}: WorkCellTypeDetailProps) => {
  const [params] = useUrlParams();

  const deleteModal = useDisclosure();
  const [selectedWorkCell, setSelectedWorkCell] = useState<
    ListItem | undefined
  >();

  const onDelete = (data?: WorkCell) => {
    if (!data || Array.isArray(data)) return;
    setSelectedWorkCell(data);
    deleteModal.onOpen();
  };

  const onDeleteCancel = () => {
    setSelectedWorkCell(undefined);
    deleteModal.onClose();
  };

  const renderContextMenu = (workCell: WorkCell) => {
    if (!workCell || Array.isArray(workCell)) return null;
    return (
      <>
        <MenuItem as={Link} to={workCell.id!} icon={<BsPencilSquare />}>
          Edit Cell
        </MenuItem>
        <MenuItem onClick={() => onDelete(workCell)} icon={<IoMdTrash />}>
          Delete Cell
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
          <DrawerHeader>{workCellType.name}</DrawerHeader>
          <DrawerBody>
            {Array.isArray(workCellType?.workCell) && (
              <VStack spacing={4}>
                {workCellType.workCell.map((workCell) => {
                  if (
                    !workCell ||
                    Array.isArray(workCell) ||
                    Array.isArray(workCell.location) ||
                    Array.isArray(workCell.department)
                  )
                    return null;
                  return (
                    <HStack key={workCell.id} className="w-full">
                      <VStack spacing={0} className="flex-grow">
                        <p className="font-bold">{workCell.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {workCell.location?.name} /{" "}
                          {workCell.department?.name}
                        </p>
                      </VStack>
                      <ActionMenu>{renderContextMenu(workCell)}</ActionMenu>
                    </HStack>
                  );
                })}
              </VStack>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button asChild size="md">
              <Link to={`new?${params.toString()}`}>New Work Cell</Link>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {selectedWorkCell && selectedWorkCell.id && (
        <ConfirmDelete
          isOpen={deleteModal.isOpen}
          action={path.to.deleteWorkCell(selectedWorkCell?.id)}
          name={selectedWorkCell?.name ?? ""}
          text={`Are you sure you want to deactivate ${selectedWorkCell?.name}?`}
          onCancel={onDeleteCancel}
        />
      )}
    </>
  );
};

export default WorkCellTypeDetail;
