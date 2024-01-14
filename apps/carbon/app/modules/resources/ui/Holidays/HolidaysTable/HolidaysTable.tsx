import { Hyperlink, MenuIcon, MenuItem } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsFillPenFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Holiday } from "~/modules/resources";
import { path } from "~/utils/path";

type HolidaysTableProps = {
  data: Holiday[];
  count: number;
};

const HolidaysTable = memo(({ data, count }: HolidaysTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const rows = data;

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Holiday",
        cell: ({ row }) => (
          <Hyperlink onClick={() => navigate(row.original.id)}>
            {`${row.original.name} (${row.original.year})`}
          </Hyperlink>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: (item) => item.getValue(),
      },
    ];
  }, [navigate]);

  const renderContextMenu = useCallback(
    (row: (typeof data)[number]) => {
      return (
        <>
          <MenuItem
            onClick={() => {
              navigate(`${path.to.holiday(row.id)}?${params.toString()}`);
            }}
          >
            <MenuIcon icon={<BsFillPenFill />} />
            Edit Holiday
          </MenuItem>
          <MenuItem
            disabled={!permissions.can("delete", "resources")}
            onClick={() => {
              navigate(`${path.to.deleteHoliday(row.id)}?${params.toString()}`);
            }}
          >
            <MenuIcon icon={<IoMdTrash />} />
            Delete Holiday
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<(typeof rows)[number]>
      data={rows}
      count={count}
      columns={columns}
      renderContextMenu={renderContextMenu}
    />
  );
});

HolidaysTable.displayName = "HolidaysTable";
export default HolidaysTable;
