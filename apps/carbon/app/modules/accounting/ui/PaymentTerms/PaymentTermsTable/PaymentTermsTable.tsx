import { Hyperlink, MenuIcon, MenuItem } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsFillPenFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { PaymentTerm } from "~/modules/accounting";
import { path } from "~/utils/path";

type PaymentTermsTableProps = {
  data: PaymentTerm[];
  count: number;
};

const PaymentTermsTable = memo(({ data, count }: PaymentTermsTableProps) => {
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
        accessorKey: "daysDue",
        header: "Days Due",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "daysDiscount",
        header: "Days Discount",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "discountPercentage",
        header: "Discount Percentage",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "calculationMethod",
        header: "Calculation Method",
        cell: (item) => item.getValue(),
      },
    ];
  }, [navigate]);

  const renderContextMenu = useCallback(
    (row: (typeof data)[number]) => {
      return (
        <>
          <MenuItem
            disabled={!permissions.can("update", "accounting")}
            onClick={() => {
              navigate(`${path.to.paymentTerm(row.id)}?${params.toString()}`);
            }}
          >
            <MenuIcon icon={<BsFillPenFill />} />
            Edit Payment Term
          </MenuItem>
          <MenuItem
            disabled={!permissions.can("delete", "accounting")}
            onClick={() => {
              navigate(
                `${path.to.deletePaymentTerm(row.id)}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<IoMdTrash />} />
            Delete Payment Term
          </MenuItem>
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

PaymentTermsTable.displayName = "PaymentTermsTable";
export default PaymentTermsTable;
