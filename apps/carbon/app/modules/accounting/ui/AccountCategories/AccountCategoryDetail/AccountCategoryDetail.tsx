import {
  ActionMenu,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack,
  useDisclosure,
} from "@carbon/react";
import { MenuItem } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { ConfirmDelete } from "~/components/Modals";

import { useUrlParams } from "~/hooks";
import type { AccountCategory, AccountSubcategory } from "~/modules/accounting";
import { path } from "~/utils/path";

type AccountCategoryDetailProps = {
  accountCategory: AccountCategory;
  accountSubcategories: AccountSubcategory[];
  onClose: () => void;
};

const AccountCategoryDetail = ({
  accountCategory,
  accountSubcategories,
  onClose,
}: AccountCategoryDetailProps) => {
  const [params] = useUrlParams();

  const deleteModal = useDisclosure();
  const [selectedAccountSubcategory, setSelectedAccountSubcategory] =
    useState<AccountSubcategory | null>(null);

  const onDelete = (data?: AccountSubcategory) => {
    if (!data) return;
    setSelectedAccountSubcategory(data);
    deleteModal.onOpen();
  };

  const onDeleteCancel = () => {
    setSelectedAccountSubcategory(null);
    deleteModal.onClose();
  };

  const renderContextMenu = (subcategory: AccountSubcategory) => {
    return (
      <>
        <MenuItem as={Link} to={subcategory.id} icon={<BsPencilSquare />}>
          Edit Subcategory
        </MenuItem>
        <MenuItem onClick={() => onDelete(subcategory)} icon={<IoMdTrash />}>
          Delete Subcategory
        </MenuItem>
      </>
    );
  };

  return (
    <>
      <Drawer
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{accountCategory.category}</DrawerTitle>
            <DrawerDescription>
              {accountCategory.incomeBalance}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <VStack>
              {accountSubcategories.map((subcategory) => {
                return (
                  <HStack spacing={1} key={subcategory.id} className="w-full">
                    <p className="flex-grow">{subcategory.name}</p>
                    <ActionMenu>{renderContextMenu(subcategory)}</ActionMenu>
                  </HStack>
                );
              })}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button asChild leftIcon={<IoMdAdd />}>
              <Link to={`new?${params.toString()}`}>New Subcategory</Link>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {selectedAccountSubcategory && selectedAccountSubcategory.id && (
        <ConfirmDelete
          isOpen={deleteModal.isOpen}
          action={path.to.deleteAccountingSubcategory(
            selectedAccountSubcategory.id
          )}
          name={selectedAccountSubcategory?.name ?? ""}
          text={`Are you sure you want to deactivate the ${selectedAccountSubcategory?.name} subcategory?`}
          onCancel={onDeleteCancel}
        />
      )}
    </>
  );
};

export default AccountCategoryDetail;
