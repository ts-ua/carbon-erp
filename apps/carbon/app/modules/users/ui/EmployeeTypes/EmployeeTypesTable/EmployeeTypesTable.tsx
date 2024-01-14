import { DropdownMenuIcon, DropdownMenuItem, Hyperlink } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare, BsPeopleFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { EmployeeType } from "~/modules/users";
import { path } from "~/utils/path";

type EmployeeTypesTableProps = {
  data: EmployeeType[];
  count: number;
};

const EmployeeTypesTable = memo(({ data, count }: EmployeeTypesTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const columns = useMemo<ColumnDef<(typeof data)[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Employee Type",
        cell: ({ row, getValue }) =>
          row.original.protected ? (
            getValue()
          ) : (
            <Hyperlink onClick={() => navigate(row.original.id)}>
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
    (row: (typeof data)[number]) => {
      return (
        <>
          <DropdownMenuItem
            onClick={() => {
              navigate(`${path.to.employeeAccounts}?type=${row.id}`);
            }}
          >
            <DropdownMenuIcon icon={<BsPeopleFill />} />
            View Employees
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={row.protected || !permissions.can("update", "users")}
            onClick={() => {
              navigate(`${path.to.employeeType(row.id)}?${params.toString()}`);
            }}
          >
            <DropdownMenuIcon icon={<BsPencilSquare />} />
            Edit Employee Type
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={row.protected || !permissions.can("delete", "users")}
            onClick={() => {
              navigate(
                `${path.to.deleteEmployeeType(row.id)}?${params.toString()}`
              );
            }}
          >
            <DropdownMenuIcon icon={<IoMdTrash />} />
            Delete Employee Type
          </DropdownMenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<(typeof data)[number]>
      data={data}
      columns={columns}
      count={count}
      renderContextMenu={renderContextMenu}
    />
  );
});

EmployeeTypesTable.displayName = "EmployeeTypesTable";
export default EmployeeTypesTable;
