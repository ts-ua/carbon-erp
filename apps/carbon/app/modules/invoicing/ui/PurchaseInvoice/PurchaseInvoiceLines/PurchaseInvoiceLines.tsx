import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HStack,
  IconButton,
} from "@carbon/react";
import { Link, Outlet, useNavigate, useParams } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { BsFillPenFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { MdMoreHoriz } from "react-icons/md";
import {
  EditableNumber,
  EditablePurchaseInvoiceLineNumber,
  EditableText,
} from "~/components/Editable";
import Grid from "~/components/Grid";
import { useRouteData, useUser } from "~/hooks";
import type { PurchaseInvoice, PurchaseInvoiceLine } from "~/modules/invoicing";
import { usePurchaseInvoiceTotals } from "~/modules/invoicing";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";
import usePurchaseInvoiceLines from "./usePurchaseInvoiceLines";

const PurchaseInvoiceLines = () => {
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error("invoiceId not found");

  const navigate = useNavigate();

  const routeData = useRouteData<{
    purchaseInvoiceLines: PurchaseInvoiceLine[];
    locations: ListItem[];
    purchaseInvoice: PurchaseInvoice;
  }>(path.to.purchaseInvoice(invoiceId));

  const { defaults, id: userId } = useUser();
  const {
    canEdit,
    canDelete,
    supabase,
    partOptions,
    serviceOptions,
    accountOptions,
    onCellEdit,
  } = usePurchaseInvoiceLines();
  const [, setPurchaseInvoiceTotals] = usePurchaseInvoiceTotals();

  const isEditable = !routeData?.purchaseInvoice?.postingDate;

  const columns = useMemo<ColumnDef<PurchaseInvoiceLine>[]>(() => {
    return [
      {
        header: "Line",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "invoiceLineType",
        header: "Type",
        cell: ({ row }) => (
          <HStack className="justify-between min-w-[100px]">
            <span>{row.original.invoiceLineType}</span>
            <div className="relative w-6 h-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    aria-label="Edit purchase order line type"
                    icon={<MdMoreHoriz />}
                    className="absolute right-[-1px] top-[-6px]"
                    variant="ghost"
                    onClick={(e) => e.stopPropagation()}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => navigate(row.original.id)}
                    disabled={!isEditable || !canEdit}
                  >
                    <DropdownMenuIcon icon={<BsFillPenFill />} />
                    Edit Line
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate(`delete/${row.original.id}`)}
                    disabled={!isEditable || !canDelete}
                  >
                    <DropdownMenuIcon icon={<IoMdTrash />} />
                    Delete Line
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </HStack>
        ),
      },
      {
        accessorKey: "partId",
        header: "Number",
        cell: ({ row }) => {
          switch (row.original.invoiceLineType) {
            case "Part":
              return <span>{row.original.partId}</span>;
            case "Service":
              return <span>{row.original.serviceId}</span>;
            case "G/L Account":
              return <span>{row.original.accountNumber}</span>;
            case "Fixed Asset":
              return <span>{row.original.assetId}</span>;
            default:
              return null;
          }
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          let description = row.original.description ?? "";
          if (description.length > 50) {
            description = description.substring(0, 50) + "...";
          }
          return <span>{description}</span>;
        },
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "unitPrice",
        header: "Unit Price",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "shelfId",
        header: "Shelf",
        cell: (item) => item.getValue(),
      },
      {
        id: "totalPrice",
        header: "Total Price",
        cell: ({ row }) => {
          if (!row.original.unitPrice || !row.original.quantity) return 0;
          return (row.original.unitPrice * row.original.quantity).toFixed(2);
        },
      },
      {
        id: "quantityReceived",
        header: "Quantity Received",
        cell: (item) => item.getValue(),
      },
      {
        id: "quantityInvoiced",
        header: "Quantity Invoiced",
        cell: (item) => item.getValue(),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const editableComponents = useMemo(
    () => ({
      description: EditableText(onCellEdit),
      quantity: EditableNumber(onCellEdit),
      unitPrice: EditableNumber(onCellEdit),
      partId: EditablePurchaseInvoiceLineNumber(onCellEdit, {
        client: supabase,
        parts: partOptions,
        services: serviceOptions,
        accounts: accountOptions,
        defaultLocationId: defaults.locationId,
        userId: userId,
      }),
    }),
    [
      onCellEdit,
      supabase,
      partOptions,
      serviceOptions,
      accountOptions,
      defaults.locationId,
      userId,
    ]
  );

  return (
    <>
      <Card className="w-full h-full min-h-[50vh]">
        <HStack className="justify-between items-start">
          <CardHeader>
            <CardTitle>Purchase Invoice Lines</CardTitle>
          </CardHeader>
          <CardAction>
            {canEdit && isEditable && (
              <Button asChild>
                <Link to="new">New</Link>
              </Button>
            )}
          </CardAction>
        </HStack>
        <CardContent>
          <Grid<PurchaseInvoiceLine>
            data={routeData?.purchaseInvoiceLines ?? []}
            columns={columns}
            canEdit={canEdit && isEditable}
            editableComponents={editableComponents}
            onDataChange={(lines: PurchaseInvoiceLine[]) => {
              const totals = lines.reduce(
                (acc, line) => {
                  acc.total += (line.quantity ?? 0) * (line.unitPrice ?? 0);

                  return acc;
                },
                { total: 0 }
              );
              setPurchaseInvoiceTotals(totals);
            }}
            onNewRow={canEdit && isEditable ? () => navigate("new") : undefined}
          />
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
};

export default PurchaseInvoiceLines;
