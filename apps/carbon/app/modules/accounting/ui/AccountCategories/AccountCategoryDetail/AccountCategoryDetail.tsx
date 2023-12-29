import { Button, HStack, VStack, useDisclosure } from "@carbon/react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
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

  return (
    <>
      <Drawer onClose={onClose} isOpen={true} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <VStack>
              <HStack className="content-between pr-8 w-full">
                <span>{accountCategory.category}</span>
                <Tag
                  borderRadius="full"
                  variant="outline"
                  colorScheme={
                    accountCategory.incomeBalance === "Income Statement"
                      ? "green"
                      : "gray"
                  }
                >
                  <TagLabel>{accountCategory.incomeBalance}</TagLabel>
                </Tag>
              </HStack>
              <p className="text-sm font-normal text-muted-foreground">
                A list of subcategories in the {accountCategory.category}{" "}
                category.
              </p>
            </VStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack>
              {accountSubcategories.map((subcategory) => {
                return (
                  <HStack key={subcategory.id} className="w-full">
                    <p className="flex-grow">{subcategory.name}</p>
                    <Button
                      asChild
                      isIcon
                      aria-label="Edit"
                      variant="secondary"
                    >
                      <Link to={subcategory.id}>
                        <BsPencilSquare />
                      </Link>
                    </Button>

                    <IconButton
                      aria-label="Delete"
                      icon={<IoMdTrash />}
                      variant="outline"
                      onClick={() => onDelete(subcategory)}
                    />
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
