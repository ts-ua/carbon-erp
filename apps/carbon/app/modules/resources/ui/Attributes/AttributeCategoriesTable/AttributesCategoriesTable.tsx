import {
  Badge,
  Button,
  Hyperlink,
  MenuIcon,
  MenuItem,
  useDisclosure,
} from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { BsFillPenFill, BsListUl } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions, useUrlParams } from "~/hooks";
import type { AttributeCategory } from "~/modules/resources";
import { path } from "~/utils/path";

type AttributeCategoriesTableProps = {
  data: AttributeCategory[];
  count: number;
};

const AttributeCategoriesTable = memo(
  ({ data, count }: AttributeCategoriesTableProps) => {
    const navigate = useNavigate();
    const [params] = useUrlParams();
    const permissions = usePermissions();
    const deleteModal = useDisclosure();
    const [selectedCategory, setSelectedCategory] = useState<
      AttributeCategory | undefined
    >();

    const onDelete = (data: AttributeCategory) => {
      setSelectedCategory(data);
      deleteModal.onOpen();
    };

    const onDeleteCancel = () => {
      setSelectedCategory(undefined);
      deleteModal.onClose();
    };

    const columns = useMemo<ColumnDef<(typeof data)[number]>[]>(() => {
      return [
        {
          accessorKey: "name",
          header: "Category",
          cell: ({ row }) => (
            <Hyperlink onClick={() => navigate(row.original.id)}>
              {row.original.name}
            </Hyperlink>
          ),
        },
        {
          header: "Attributes",
          cell: ({ row }) => (
            <Button
              variant="secondary"
              onClick={() => {
                navigate(
                  `${path.to.attributeCategoryList(
                    row.original.id
                  )}?${params?.toString()}`
                );
              }}
            >
              {Array.isArray(row.original.userAttribute)
                ? row.original.userAttribute?.length ?? 0
                : 0}{" "}
              Attributes
            </Button>
          ),
        },
        {
          header: "Visibility",
          accessorKey: "public",
          cell: (item) => {
            const isPublic = item.getValue<boolean>()?.toString() === "true";
            return (
              <Badge variant={isPublic ? undefined : "outline"}>
                {isPublic ? "Public" : "Private"}
              </Badge>
            );
          },
        },
      ];
    }, [navigate, params]);

    const renderContextMenu = useCallback(
      (row: (typeof data)[number]) => {
        return (
          <>
            <MenuItem
              onClick={() => {
                navigate(
                  `${path.to.newAttributeForCategory(
                    row.id
                  )}?${params?.toString()}`
                );
              }}
            >
              <MenuIcon icon={<BiAddToQueue />} />
              New Attribute
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate(
                  `${path.to.attributeCategoryList(
                    row.id
                  )}?${params?.toString()}`
                );
              }}
            >
              <MenuIcon icon={<BsListUl />} />
              View Attributes
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate(path.to.attributeCategory(row.id));
              }}
            >
              <MenuIcon icon={<BsFillPenFill />} />
              Edit Attribute Category
            </MenuItem>
            <MenuItem
              disabled={row.protected || !permissions.can("delete", "users")}
              onClick={() => onDelete(row)}
            >
              <MenuIcon icon={<IoMdTrash />} />
              Delete Category
            </MenuItem>
          </>
        );
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [navigate, params, permissions]
    );

    return (
      <>
        <Table<(typeof data)[number]>
          data={data}
          columns={columns}
          count={count ?? 0}
          renderContextMenu={renderContextMenu}
        />
        {selectedCategory && selectedCategory.id && (
          <ConfirmDelete
            action={path.to.deleteAttributeCategory(selectedCategory.id)}
            name={selectedCategory?.name ?? ""}
            text={`Are you sure you want to deactivate the ${selectedCategory?.name} attribute category?`}
            isOpen={deleteModal.isOpen}
            onCancel={onDeleteCancel}
            onSubmit={onDeleteCancel}
          />
        )}
      </>
    );
  }
);

AttributeCategoriesTable.displayName = "AttributeCategoriesTable";
export default AttributeCategoriesTable;
