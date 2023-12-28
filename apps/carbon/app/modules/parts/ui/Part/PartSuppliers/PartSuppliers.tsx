import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  HStack,
} from "@carbon/react";
import { IconButton } from "@chakra-ui/react";
import { Link, Outlet, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { MdMoreHoriz } from "react-icons/md";
import {
  EditableList,
  EditableNumber,
  EditableText,
} from "~/components/Editable";
import Grid from "~/components/Grid";
import { useRouteData } from "~/hooks";
import type { PartSupplier, UnitOfMeasureListItem } from "~/modules/parts";
import { path } from "~/utils/path";
import usePartSuppliers from "./usePartSuppliers";

type PartSuppliersProps = {
  partSuppliers: PartSupplier[];
};

const PartSuppliers = ({ partSuppliers }: PartSuppliersProps) => {
  const navigate = useNavigate();
  const { canEdit, onCellEdit } = usePartSuppliers();
  const sharedPartData = useRouteData<{
    unitOfMeasures: UnitOfMeasureListItem[];
  }>(path.to.partRoot);

  const unitOfMeasureOptions = useMemo(() => {
    return (
      sharedPartData?.unitOfMeasures.map((unitOfMeasure) => ({
        label: unitOfMeasure.code,
        value: unitOfMeasure.code,
      })) ?? []
    );
  }, [sharedPartData?.unitOfMeasures]);

  const columns = useMemo<ColumnDef<PartSupplier>[]>(() => {
    return [
      {
        accessorKey: "supplier.id",
        header: "Supplier",
        cell: ({ row }) => (
          <HStack className="justify-between">
            {/* @ts-ignore */}
            <span>{row.original.supplier.name}</span>
            {canEdit && (
              <div className="relative w-6 h-5">
                <IconButton
                  aria-label="Edit part supplier"
                  as={Link}
                  icon={<MdMoreHoriz />}
                  size="sm"
                  position="absolute"
                  right={-1}
                  top={-1}
                  to={`${row.original.id}`}
                  onClick={(e) => e.stopPropagation()}
                  variant="ghost"
                />
              </div>
            )}
          </HStack>
        ),
      },
      {
        accessorKey: "supplierPartId",
        header: "Supplier ID",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "supplierUnitOfMeasureCode",
        header: "Unit of Measure",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "minimumOrderQuantity",
        header: "Minimum Order Quantity",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "conversionFactor",
        header: "Conversion Factor",
        cell: (item) => item.getValue(),
      },
    ];
  }, [canEdit]);

  const editableComponents = useMemo(
    () => ({
      supplierPartId: EditableText(onCellEdit),
      supplierUnitOfMeasureCode: EditableList(onCellEdit, unitOfMeasureOptions),
      minimumOrderQuantity: EditableNumber(onCellEdit),
      conversionFactor: EditableNumber(onCellEdit),
    }),
    [onCellEdit, unitOfMeasureOptions]
  );

  return (
    <>
      <Card>
        <HStack className="justify-between items-start">
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
          </CardHeader>
          <CardAction>
            {canEdit && (
              <Button asChild>
                <Link to="new">New</Link>
              </Button>
            )}
          </CardAction>
        </HStack>
        <CardContent>
          <Grid<PartSupplier>
            data={partSuppliers}
            columns={columns}
            canEdit={canEdit}
            editableComponents={editableComponents}
            onNewRow={canEdit ? () => navigate("new") : undefined}
          />
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
};

export default PartSuppliers;
