import { Avatar, HStack, Hyperlink, MenuIcon, MenuItem } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsFillPenFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Contractor } from "~/modules/resources";
import { path } from "~/utils/path";

type ContractorsTableProps = {
  data: Contractor[];
  count: number;
};

const ContractorsTable = memo(({ data, count }: ContractorsTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const columns = useMemo<ColumnDef<Contractor>[]>(() => {
    return [
      {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => (
          <HStack>
            <Avatar size="sm" name={row.original.supplierName ?? ""} />
            <Hyperlink
              onClick={() => {
                navigate(path.to.supplier(row.original.supplierId!));
              }}
            >
              {row.original.supplierName}
            </Hyperlink>
          </HStack>
        ),
      },
      {
        header: "Contractor",
        cell: ({ row }) => (
          <>{`${row.original.firstName} ${row.original.lastName}`}</>
        ),
      },
      {
        accessorKey: "hoursPerWeek",
        header: "Hours per Week",
        cell: (item) => item.getValue(),
      },
    ];
  }, [navigate]);

  const renderContextMenu = useCallback(
    (row: Contractor) => {
      return (
        <>
          <MenuItem
            onClick={() => {
              navigate(
                `${path.to.contractor(
                  row.supplierContactId!
                )}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<BsFillPenFill />} />
            Edit Contractor
          </MenuItem>
          <MenuItem
            disabled={!permissions.can("delete", "resources")}
            onClick={() => {
              navigate(
                `${path.to.deleteContractor(
                  row.supplierContactId!
                )}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<IoMdTrash />} />
            Delete Contractor
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<Contractor>
      data={data}
      count={count}
      columns={columns}
      renderContextMenu={renderContextMenu}
    />
  );
});

ContractorsTable.displayName = "ContractorsTable";
export default ContractorsTable;
