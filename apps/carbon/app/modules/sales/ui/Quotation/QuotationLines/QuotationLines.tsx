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
  EditableQuotationPart,
  EditableText,
} from "~/components/Editable";
import Grid from "~/components/Grid";
import { useRouteData, useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import {
  useQuotationTotals,
  type Quotation,
  type QuotationLine,
} from "~/modules/sales";
import { useParts } from "~/stores";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";
import useQuotationLines from "./useQuotationLines";

const QuotationLines = () => {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const { supabase } = useSupabase();
  const [parts] = useParts();
  const { id: userId } = useUser();

  const partOptions = parts.map((part) => ({
    value: part.id,
    label: part.id,
  }));

  const navigate = useNavigate();

  const routeData = useRouteData<{
    quotation: Quotation;
    quotationLines: QuotationLine[];
    locations: ListItem[];
  }>(path.to.quote(id));

  const { canEdit, canDelete, onCellEdit } = useQuotationLines();
  const [, setQuotationTotals] = useQuotationTotals();

  const isEditable = ["Draft"].includes(routeData?.quotation?.status ?? "");

  const columns = useMemo<ColumnDef<QuotationLine>[]>(() => {
    return [
      {
        header: "Line",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "partId",
        header: "Part",
        cell: ({ row }) => {
          return (
            <HStack className="justify-between min-w-[100px]">
              <span>{row.original.partId}</span>
              <div className="relative w-6 h-5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton
                      aria-label="Edit quote line"
                      icon={<MdMoreHoriz />}
                      size="md"
                      className="absolute right-[-1px] top-[-6px]"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => navigate(row.original.id!)}
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
          );
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "customerPartId",
        header: "Customer Part",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "unitCost",
        header: "Unit Cost",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "unitPrice",
        header: "Unit Price",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "leadTime",
        header: "Lead Time",
        cell: (item) => item.getValue(),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const editableComponents = useMemo(
    () => ({
      partId: EditableQuotationPart(onCellEdit, {
        client: supabase,
        parts: partOptions,
        userId,
      }),
      description: EditableText(onCellEdit),
      customerPartId: EditableText(onCellEdit),
      quantity: EditableNumber(onCellEdit),
      unitCost: EditableNumber(onCellEdit),
      unitPrice: EditableNumber(onCellEdit),
      leadTime: EditableNumber(onCellEdit),
    }),
    [onCellEdit, partOptions, supabase, userId]
  );

  return (
    <>
      <Card className="w-full h-full min-h-[50vh]">
        <HStack className="justify-between items-start">
          <CardHeader>
            <CardTitle>Quotation Lines</CardTitle>
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
          <Grid<QuotationLine>
            data={routeData?.quotationLines ?? []}
            columns={columns}
            canEdit={canEdit && isEditable}
            editableComponents={editableComponents}
            onDataChange={(lines: QuotationLine[]) => {
              const totals = lines.reduce(
                (acc, line) => {
                  acc.total += (line.quantity ?? 0) * (line.unitPrice ?? 0);

                  return acc;
                },
                { total: 0 }
              );
              setQuotationTotals(totals);
            }}
            onNewRow={canEdit && isEditable ? () => navigate("new") : undefined}
          />
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
};

export default QuotationLines;
