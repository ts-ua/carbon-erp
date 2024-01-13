import {
  DropdownMenuIcon,
  DropdownMenuItem,
  HStack,
  Hyperlink,
  useDisclosure,
} from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Avatar, Table } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions, useRealtime } from "~/hooks";
import type {
  PurchaseInvoice,
  purchaseInvoiceStatusType,
} from "~/modules/invoicing";
import { PurchaseInvoicingStatus } from "~/modules/invoicing";
import { path } from "~/utils/path";

type PurchaseInvoicesTableProps = {
  data: PurchaseInvoice[];
  count: number;
};

const PurchaseInvoicesTable = memo(
  ({ data, count }: PurchaseInvoicesTableProps) => {
    useRealtime(
      "purchaseInvoice",
      `id=in.(${data.map((d) => d.id).join(",")})`
    );

    const permissions = usePermissions();
    const navigate = useNavigate();

    const [selectedPurchaseInvoice, setSelectedPurchaseInvoice] =
      useState<PurchaseInvoice | null>(null);
    const closePurchaseInvoiceModal = useDisclosure();

    const columns = useMemo<ColumnDef<PurchaseInvoice>[]>(() => {
      return [
        {
          accessorKey: "invoiceId",
          header: "Invoice Number",
          cell: ({ row }) => (
            <Hyperlink
              onClick={
                row.original?.id !== null
                  ? () => navigate(path.to.purchaseInvoice(row.original.id!))
                  : undefined
              }
            >
              {row.original?.invoiceId}
            </Hyperlink>
          ),
        },
        {
          accessorKey: "supplierName",
          header: "Supplier",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "dateDue",
          header: "Due Date",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "status",
          header: "Status",
          cell: (item) => {
            const status =
              item.getValue<(typeof purchaseInvoiceStatusType)[number]>();
            return <PurchaseInvoicingStatus status={status} />;
          },
        },
        {
          accessorKey: "dateIssued",
          header: "Issued Date",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "createdByFullName",
          header: "Created By",
          cell: ({ row }) => {
            return (
              <HStack>
                <Avatar size="sm" path={row.original.createdByAvatar} />
                <span>{row.original.createdByFullName}</span>
              </HStack>
            );
          },
        },
        {
          accessorKey: "createdAt",
          header: "Created At",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "updatedByFullName",
          header: "Updated By",
          cell: ({ row }) => {
            return row.original.updatedByFullName ? (
              <HStack>
                <Avatar size="sm" path={row.original.updatedByAvatar ?? null} />
                <span>{row.original.updatedByFullName}</span>
              </HStack>
            ) : null;
          },
        },
        {
          accessorKey: "updatedAt",
          header: "Updated At",
          cell: (item) => item.getValue(),
        },
      ];
    }, [navigate]);

    const defaultColumnVisibility = {
      createdAt: false,
      createdByFullName: false,
      receiptPromisedDate: false,
      updatedAt: false,
      updatedByFullName: false,
    };

    const renderContextMenu = useMemo(() => {
      // eslint-disable-next-line react/display-name
      return (row: PurchaseInvoice) => (
        <>
          <DropdownMenuItem
            disabled={!permissions.can("view", "invoicing")}
            onClick={() => navigate(path.to.purchaseInvoice(row.id!))}
          >
            <DropdownMenuIcon icon={<BsPencilSquare />} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              row.status !== "Draft" || !permissions.can("delete", "invoicing")
            }
            onClick={() => {
              setSelectedPurchaseInvoice(row);
              closePurchaseInvoiceModal.onOpen();
            }}
          >
            <DropdownMenuIcon icon={<IoMdTrash />} />
            Delete
          </DropdownMenuItem>
        </>
      );
    }, [closePurchaseInvoiceModal, navigate, permissions]);

    return (
      <>
        <Table<PurchaseInvoice>
          count={count}
          columns={columns}
          data={data}
          defaultColumnVisibility={defaultColumnVisibility}
          withColumnOrdering
          withFilters
          withPagination
          withSimpleSorting
          renderContextMenu={renderContextMenu}
        />

        {selectedPurchaseInvoice && selectedPurchaseInvoice.id && (
          <ConfirmDelete
            action={path.to.deletePurchaseInvoice(selectedPurchaseInvoice.id)}
            isOpen={closePurchaseInvoiceModal.isOpen}
            name={selectedPurchaseInvoice.invoiceId!}
            text={`Are you sure you want to permanently delete ${selectedPurchaseInvoice.invoiceId!}?`}
            onCancel={() => {
              closePurchaseInvoiceModal.onClose();
              setSelectedPurchaseInvoice(null);
            }}
            onSubmit={() => {
              closePurchaseInvoiceModal.onClose();
              setSelectedPurchaseInvoice(null);
            }}
          />
        )}
      </>
    );
  }
);

PurchaseInvoicesTable.displayName = "PurchaseInvoicesTable";

export default PurchaseInvoicesTable;
