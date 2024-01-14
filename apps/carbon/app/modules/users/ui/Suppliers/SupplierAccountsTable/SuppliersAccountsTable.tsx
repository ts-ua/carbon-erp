import {
  DropdownMenuIcon,
  DropdownMenuItem,
  HStack,
  useDisclosure,
} from "@carbon/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { BsEnvelope } from "react-icons/bs";
import { FaBan } from "react-icons/fa";
import { Avatar, Table } from "~/components";
import { usePermissions } from "~/hooks";
import type { Supplier } from "~/modules/users";
import { DeactivateUsersModal, ResendInviteModal } from "~/modules/users";
import { path } from "~/utils/path";

type SupplierAccountsTableProps = {
  data: Supplier[];
  count: number;
  isEditable?: boolean;
};

const defaultColumnVisibility = {
  user_firstName: false,
  user_lastName: false,
};

const SupplierAccountsTable = memo(
  ({ data, count, isEditable = false }: SupplierAccountsTableProps) => {
    const permissions = usePermissions();

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const deactivateSupplierModal = useDisclosure();
    const resendInviteModal = useDisclosure();

    const rows = useMemo(
      () =>
        data.map((d) => {
          // we should only have one user and supplier per supplier id
          if (
            d.user === null ||
            d.supplier === null ||
            Array.isArray(d.user) ||
            Array.isArray(d.supplier)
          ) {
            throw new Error("Expected user and supplier to be objects");
          }

          return d;
        }),
      [data]
    );

    const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
      return [
        {
          header: "User",
          cell: ({ row }) => (
            <HStack>
              <Avatar
                size="sm"
                name={row.original.user?.fullName ?? undefined}
                path={row.original.user?.avatarUrl ?? undefined}
              />

              <span>{row.original.user?.fullName ?? ""}</span>
            </HStack>
          ),
        },

        {
          accessorKey: "user.firstName",
          header: "First Name",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "user.lastName",
          header: "Last Name",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "user.email",
          header: "Email",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "supplier.name",
          header: "Supplier",
          cell: (item) => item.getValue(),
        },
        {
          header: "Supplier Type",
          cell: ({ row }) => {
            const supplierType = row.original.supplier?.supplierType;
            // @ts-ignore
            return supplierType ? supplierType.name : "";
          },
        },
      ];
    }, []);

    const actions = useMemo(() => {
      return [
        {
          label: "Send Account Invite",
          icon: <BsEnvelope />,
          disabled: !permissions.can("create", "users"),
          onClick: (selected: typeof rows) => {
            setSelectedUserIds(
              selected.reduce<string[]>((acc, row) => {
                if (row.user && !Array.isArray(row.user)) {
                  acc.push(row.user.id);
                }
                return acc;
              }, [])
            );
            resendInviteModal.onOpen();
          },
        },
        {
          label: "Deactivate Users",
          icon: <FaBan />,
          disabled: !permissions.can("delete", "users"),
          onClick: (selected: typeof rows) => {
            setSelectedUserIds(
              selected.reduce<string[]>((acc, row) => {
                if (row.user && !Array.isArray(row.user)) {
                  acc.push(row.user.id);
                }
                return acc;
              }, [])
            );
            deactivateSupplierModal.onOpen();
          },
        },
      ];
    }, [deactivateSupplierModal, permissions, resendInviteModal]);

    const renderContextMenu = useCallback(
      (row: (typeof data)[number]) => {
        if (Array.isArray(row.user) || !row.user) {
          return null;
        }
        const userId = row.user.id as string;
        return (
          <>
            <DropdownMenuItem
              onClick={() => {
                setSelectedUserIds([userId]);
                resendInviteModal.onOpen();
              }}
            >
              <DropdownMenuIcon icon={<BsEnvelope />} />
              Send Account Invite
            </DropdownMenuItem>
            {row.user?.active === true && (
              <DropdownMenuItem
                onClick={(e) => {
                  setSelectedUserIds([userId]);
                  deactivateSupplierModal.onOpen();
                }}
              >
                <DropdownMenuIcon icon={<FaBan />} />
                Deactivate Supplier
              </DropdownMenuItem>
            )}
          </>
        );
      },
      [deactivateSupplierModal, resendInviteModal]
    );

    return (
      <>
        <Table<(typeof rows)[number]>
          actions={actions}
          count={count}
          columns={columns}
          data={rows}
          defaultColumnVisibility={defaultColumnVisibility}
          renderContextMenu={renderContextMenu}
          withColumnOrdering
          withFilters
          withPagination
          withSelectableRows={isEditable}
        />

        {deactivateSupplierModal.isOpen && (
          <DeactivateUsersModal
            userIds={selectedUserIds}
            isOpen={deactivateSupplierModal.isOpen}
            redirectTo={path.to.supplierAccounts}
            onClose={deactivateSupplierModal.onClose}
          />
        )}
        {resendInviteModal.isOpen && (
          <ResendInviteModal
            userIds={selectedUserIds}
            isOpen={resendInviteModal.isOpen}
            onClose={resendInviteModal.onClose}
          />
        )}
      </>
    );
  }
);

SupplierAccountsTable.displayName = "SupplierTable";

export default SupplierAccountsTable;
