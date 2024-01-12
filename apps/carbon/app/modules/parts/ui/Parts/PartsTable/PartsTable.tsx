import { Hyperlink } from "@carbon/react";
import { MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Table } from "~/components";
import { useUrlParams } from "~/hooks";
import type { Part } from "~/modules/parts";
import { path } from "~/utils/path";

type PartsTableProps = {
  data: Part[];
  count: number;
};

const PartsTable = memo(({ data, count }: PartsTableProps) => {
  const navigate = useNavigate();
  const [params] = useUrlParams();

  const columns = useMemo<ColumnDef<Part>[]>(() => {
    return [
      {
        accessorKey: "id",
        header: "Part ID",
        cell: ({ row }) => (
          <Hyperlink onClick={() => navigate(path.to.part(row.original.id!))}>
            {row.original.id}
          </Hyperlink>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "partType",
        header: "Part Type",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "replenishmentSystem",
        header: "Replenishment",
        cell: (item) => item.getValue(),
      },
      {
        // @ts-ignore
        accessorKey: "partGroup",
        header: "Part Group",
        cell: (item) => item.getValue(),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const renderContextMenu = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return (row: Part) => (
      <MenuItem
        icon={<BsPencilSquare />}
        onClick={() => navigate(path.to.part(row.id!))}
      >
        Edit Part
      </MenuItem>
    );
  }, [navigate]);

  return (
    <>
      <Table<Part>
        count={count}
        columns={columns}
        data={data}
        withPagination
        renderContextMenu={renderContextMenu}
      />
    </>
  );
});

PartsTable.displayName = "PartTable";

export default PartsTable;
