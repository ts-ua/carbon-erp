import { DropdownMenuIcon, DropdownMenuItem, Hyperlink } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare, BsPeopleFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { SupplierType } from "~/modules/purchasing";
import { path } from "~/utils/path";

type SupplierTypesTableProps = {
  data: SupplierType[];
  count: number;
};

const SupplierTypesTable = memo(({ data, count }: SupplierTypesTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const columns = useMemo<ColumnDef<SupplierType>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Supplier Type",
        cell: ({ row }) => (
          <Hyperlink onClick={() => navigate(row.original.id as string)}>
            {row.original.name}
          </Hyperlink>
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
  }, [navigate]);

  const renderContextMenu = useCallback(
    (row: SupplierType) => {
      return (
        <>
          <DropdownMenuItem
            onClick={() => {
              navigate(`${path.to.suppliers}?type=${row.id}`);
            }}
          >
            <DropdownMenuIcon icon={<BsPeopleFill />} />
            View Suppliers
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={row.protected || !permissions.can("update", "purchasing")}
            onClick={() => {
              navigate(`${path.to.supplierType(row.id)}?${params.toString()}`);
            }}
          >
            <DropdownMenuIcon icon={<BsPencilSquare />} />
            Edit Supplier Type
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={row.protected || !permissions.can("delete", "purchasing")}
            onClick={() => {
              navigate(
                `${path.to.deleteSupplierType(row.id)}?${params.toString()}`
              );
            }}
          >
            <DropdownMenuIcon icon={<IoMdTrash />} />
            Delete Supplier Type
          </DropdownMenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<SupplierType>
      data={data}
      columns={columns}
      count={count}
      renderContextMenu={renderContextMenu}
    />
  );
});

SupplierTypesTable.displayName = "SupplierTypesTable";
export default SupplierTypesTable;
