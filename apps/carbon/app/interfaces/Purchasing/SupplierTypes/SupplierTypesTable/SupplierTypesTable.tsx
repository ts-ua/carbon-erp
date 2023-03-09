import { Box, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare, BsPeopleFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { SupplierType } from "~/interfaces/Purchasing/types";

type SupplierTypesTableProps = {
  data: SupplierType[];
  count: number;
};

const SupplierTypesTable = memo(({ data, count }: SupplierTypesTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const columns = useMemo<ColumnDef<typeof data[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Supplier Type",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "color",
        header: "Color",
        cell: (item) => (
          <Box
            aria-label="Color"
            w={6}
            h={6}
            borderRadius="md"
            bg={item.getValue() ?? "#000000"}
            role="img"
          />
        ),
      },
    ];
  }, []);

  const renderContextMenu = useCallback(
    (row: typeof data[number]) => {
      return (
        <>
          <MenuItem
            icon={<BsPeopleFill />}
            onClick={() => {
              navigate(`/x/purchasing/suppliers?type=${row.id}`);
            }}
          >
            View Suppliers
          </MenuItem>
          <MenuItem
            isDisabled={
              row.protected || !permissions.can("update", "purchasing")
            }
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(
                `/x/purchasing/supplier-types/${row.id}?${params.toString()}`
              );
            }}
          >
            Edit Supplier Type
          </MenuItem>
          <MenuItem
            isDisabled={
              row.protected || !permissions.can("delete", "purchasing")
            }
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(
                `/x/purchasing/supplier-types/delete/${
                  row.id
                }?${params.toString()}`
              );
            }}
          >
            Delete Supplier Type
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<typeof data[number]>
      data={data}
      columns={columns}
      count={count}
      renderContextMenu={renderContextMenu}
    />
  );
});

SupplierTypesTable.displayName = "SupplierTypesTable";
export default SupplierTypesTable;
