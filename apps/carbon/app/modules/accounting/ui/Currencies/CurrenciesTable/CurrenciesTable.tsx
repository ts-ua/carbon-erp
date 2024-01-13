import {
  Checkbox,
  DropdownMenuIcon,
  DropdownMenuItem,
  Hyperlink,
} from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Currency } from "~/modules/accounting";
import { path } from "~/utils/path";

type CurrenciesTableProps = {
  data: Currency[];
  count: number;
};

const CurrenciesTable = memo(({ data, count }: CurrenciesTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const columns = useMemo<ColumnDef<(typeof data)[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Hyperlink onClick={() => navigate(row.original.id)}>
            {row.original.name}
          </Hyperlink>
        ),
      },
      {
        accessorKey: "code",
        header: "Code",
        cell: (item) => item.getValue(),
      },
      {
        header: "Symbol",
        cell: ({ row }) => row.original.symbol,
      },
      {
        accessorKey: "exchangeRate",
        header: "Exchange Rate",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "isBaseCurrency",
        header: "Default Currency",
        cell: ({ row }) => (
          <Checkbox isChecked={row.original.isBaseCurrency} disabled />
        ),
      },
    ];
  }, [navigate]);

  const renderContextMenu = useCallback(
    (row: (typeof data)[number]) => {
      return (
        <>
          <DropdownMenuItem
            disabled={!permissions.can("update", "accounting")}
            onClick={() => {
              navigate(`${path.to.currency(row.id)}?${params.toString()}`);
            }}
          >
            <DropdownMenuIcon icon={<BsPencilSquare />} />
            Edit Currency
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!permissions.can("delete", "accounting")}
            onClick={() => {
              navigate(
                `${path.to.deleteCurrency(row.id)}?${params.toString()}`
              );
            }}
          >
            <DropdownMenuIcon icon={<IoMdTrash />} />
            Delete Currency
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

CurrenciesTable.displayName = "CurrenciesTable";
export default CurrenciesTable;
