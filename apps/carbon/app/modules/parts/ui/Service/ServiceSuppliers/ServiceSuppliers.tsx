import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  HStack,
} from "@carbon/react";
import { Button, IconButton } from "@chakra-ui/react";
import { Link, Outlet, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { MdMoreHoriz } from "react-icons/md";
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
            {canEdit && (
              <div className="relative w-6 h-5">
                <IconButton
                  aria-label="Edit service supplier"
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
        accessorKey: "supplierServiceId",
        header: "Supplier ID",
        cell: (item) => item.getValue(),
      },
    ];
  }, [canEdit]);

  const editableComponents = useMemo(
    () => ({
      supplierServiceId: EditableText(onCellEdit),
    }),
    [onCellEdit]
  );

  return (
    <>
      <Card className="w-full">
        <HStack className="justify-between items-start">
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
          </CardHeader>
          <CardAction>
            {canEdit && (
              <Button colorScheme="brand" as={Link} to="new">
                New
              </Button>
            )}
          </CardAction>
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
