import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  HStack,
} from "@carbon/react";
import { Outlet, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { New } from "~/components";
import { EditableText } from "~/components/Editable";
import Grid from "~/components/Grid";
import type { ServiceSupplier } from "~/modules/parts";
import useServiceSuppliers from "./useServiceSuppliers";

type ServiceSuppliersProps = {
  serviceSuppliers: ServiceSupplier[];
};

const ServiceSuppliers = ({ serviceSuppliers }: ServiceSuppliersProps) => {
  const navigate = useNavigate();
  const { canEdit, onCellEdit } = useServiceSuppliers();

  const columns = useMemo<ColumnDef<ServiceSupplier>[]>(() => {
    return [
      {
        accessorKey: "supplier.id",
        header: "Supplier",
        cell: ({ row }) => (
          <HStack className="justify-between">
            {/* @ts-ignore */}
            <span>{row.original.supplier.name}</span>
            {/* {canEdit && (
              <div className="relative w-6 h-5">
                <Button
                  asChild
                  isIcon
                  variant="ghost"
                  className="absolute right-[-3px] top-[-5px] outline-none border-none active:outline-none focus-visible:outline-none"
                  aria-label="Edit service supplier"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link to={`${row.original.id}`}>
                    <MdMoreHoriz />
                  </Link>
                </Button>
              </div>
            )} */}
          </HStack>
        ),
      },
      {
        accessorKey: "supplierServiceId",
        header: "Supplier ID",
        cell: (item) => item.getValue(),
      },
    ];
  }, []);

  const editableComponents = useMemo(
    () => ({
      supplierServiceId: EditableText(onCellEdit),
    }),
    [onCellEdit]
  );

  return (
    <>
      <Card className="w-full h-full min-h-[50vh]">
        <HStack className="justify-between items-start">
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
          </CardHeader>
          <CardAction>{canEdit && <New to="new" />}</CardAction>
        </HStack>
        <CardContent>
          <Grid<ServiceSupplier>
            data={serviceSuppliers}
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

export default ServiceSuppliers;
