import { Button, HStack, Hyperlink, useDisclosure } from "@carbon/react";
import { Icon, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import {
  BsFillCheckCircleFill,
  BsListUl,
  BsPencilSquare,
} from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions, useUrlParams } from "~/hooks";
import type { EquipmentType } from "~/modules/resources";
import { path } from "~/utils/path";

type EquipmentTypesTableProps = {
  data: EquipmentType[];
  count: number;
};

const EquipmentTypesTable = memo(
  ({ data, count }: EquipmentTypesTableProps) => {
    const navigate = useNavigate();
    const [params] = useUrlParams();
    const permissions = usePermissions();
    const deleteModal = useDisclosure();
    const [selectedType, setSelectedType] = useState<
      EquipmentType | undefined
    >();

    const onDelete = (data: EquipmentType) => {
      setSelectedType(data);
      deleteModal.onOpen();
    };

    const onDeleteCancel = () => {
      setSelectedType(undefined);
      deleteModal.onClose();
    };

    const columns = useMemo<ColumnDef<(typeof data)[number]>[]>(() => {
      return [
        {
          accessorKey: "name",
          header: "Equipment Type",
          cell: ({ row }) => (
            <HStack>
              <Hyperlink onClick={() => navigate(row.original.id)}>
                {row.original.name}
              </Hyperlink>
              {row.original.requiredAbility && (
                <Icon
                  as={BsFillCheckCircleFill}
                  color="green.500"
                  title="Requires ability"
                />
              )}
            </HStack>
          ),
        },
        {
          accessorKey: "description",
          header: "Description",
          cell: ({ row }) => (
            <span className="max-w-[300px] line-clamp-1">
              {row.original.description}
            </span>
          ),
        },
        {
          header: "Equipment",
          cell: ({ row }) => (
            <Button
              variant="secondary"
              onClick={() => {
                navigate(
                  `${path.to.equipmentTypeList(
                    row.original.id
                  )}?${params?.toString()}`
                );
              }}
            >
              {Array.isArray(row.original.equipment)
                ? row.original.equipment?.length ?? 0
                : 0}{" "}
              Units
            </Button>
          ),
        },
        {
          accessorKey: "color",
          header: "Color",
          cell: (item) => (
            <div
              aria-label="Color"
              className="w-6 h-6 rounded-md bg-zinc-500"
              style={{ background: item.getValue<string>() ?? "#000000" }}
            />
          ),
        },
      ];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const renderContextMenu = useCallback<
      (row: (typeof data)[number]) => JSX.Element
    >(
      (row) => (
        <>
          <MenuItem
            icon={<BiAddToQueue />}
            onClick={() => {
              navigate(`${path.to.newEquipment(row.id)}?${params?.toString()}`);
            }}
          >
            New Unit
          </MenuItem>
          <MenuItem
            icon={<BsListUl />}
            onClick={() => {
              navigate(
                `${path.to.equipmentTypeList(row.id)}?${params?.toString()}`
              );
            }}
          >
            View Equipment
          </MenuItem>
          <MenuItem
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(path.to.equipmentType(row.id));
            }}
          >
            Edit Equipment Type
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "users")}
            icon={<IoMdTrash />}
            onClick={() => onDelete(row)}
          >
            Delete Equipment Type
          </MenuItem>
        </>
      ),
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
        {selectedType && selectedType.id && (
          <ConfirmDelete
            action={path.to.deleteEquipmentType(selectedType.id)}
            name={selectedType?.name ?? ""}
            text={`Are you sure you want to deactivate the ${selectedType?.name} equipment type?`}
            isOpen={deleteModal.isOpen}
            onCancel={onDeleteCancel}
            onSubmit={onDeleteCancel}
          />
        )}
      </>
    );
  }
);

EquipmentTypesTable.displayName = "EquipmentTypesTable";
export default EquipmentTypesTable;
