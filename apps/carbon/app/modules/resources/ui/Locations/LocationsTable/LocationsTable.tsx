import { Hyperlink, MenuIcon, MenuItem } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsFillPenFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { ShiftLocation } from "~/modules/resources";
import { path } from "~/utils/path";

type LocationsTableProps = {
  data: ShiftLocation[];
  count: number;
};

const LocationsTable = memo(({ data, count }: LocationsTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const rows = data.map((row) => ({
    ...row,
  }));

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Location",
        cell: ({ row }) => (
          <Hyperlink onClick={() => navigate(row.original.id)}>
            {row.original.name}
          </Hyperlink>
        ),
      },
      {
        accessorKey: "addressLine1",
        header: "Address",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "city",
        header: "City",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "state",
        header: "State",
        cell: (item) => item.getValue(),
      },

      {
        accessorKey: "timezone",
        header: "Timezone",
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
              navigate(`${path.to.location(row.id)}?${params.toString()}`);
            }}
          >
            <MenuIcon icon={<BsFillPenFill />} />
            Edit Location
          </MenuItem>
          <MenuItem
            disabled={!permissions.can("delete", "resources")}
            onClick={() => {
              navigate(
                `${path.to.deleteLocation(row.id)}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<IoMdTrash />} />
            Delete Location
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

LocationsTable.displayName = "LocationsTable";
export default LocationsTable;
