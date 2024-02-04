import { memo } from "react";
import type { RequestForQuote } from "~/modules/purchasing";
// import { RequestForQuoteStatus } from "~/modules/purchasing";

type RequestForQuotesTableProps = {
  data: RequestForQuote[];
  count: number;
};

const RequestForQuotesTable = memo(
  ({ data, count }: RequestForQuotesTableProps) => {
    console.log({ data, count });
    return null;
    //   const permissions = usePermissions();

    //   const columns = useMemo<ColumnDef<RequestForQuote>[]>(() => {
    //     return [
    //       {
    //         accessorKey: "requestForQuoteId",
    //         header: "Name",
    //         cell: ({ row }) => (
    //           <HStack>
    //             <Hyperlink onClick={() => alert("TODO")}>
    //               {row.original.name}
    //             </Hyperlink>
    //           </HStack>
    //         ),
    //       },
    //       {
    //         accessorKey: "supplierName",
    //         header: "Supplier",
    //         cell: (item) => item.getValue(),
    //       },
    //       {
    //         accessorKey: "orderDate",
    //         header: "Order Date",
    //         cell: (item) => item.getValue(),
    //       },
    //       {
    //         accessorKey: "status",
    //         header: "Status",
    //         cell: (item) => {
    //           const status =
    //             item.getValue<(typeof requestForQuoteStatusType)[number]>();
    //           return <RequestForQuoteStatus status={status} />;
    //         },
    //       },
    //       {
    //         accessorKey: "receiptPromisedDate",
    //         header: "Promised Date",
    //         cell: (item) => item.getValue(),
    //       },
    //       {
    //         accessorKey: "createdByFullName",
    //         header: "Created By",
    //         cell: ({ row }) => {
    //           return (
    //             <HStack>
    //               <Avatar size="sm" path={row.original.createdByAvatar} />
    //               <p>{row.original.createdByFullName}</p>
    //             </HStack>
    //           );
    //         },
    //       },
    //       {
    //         accessorKey: "createdAt",
    //         header: "Created At",
    //         cell: (item) => item.getValue(),
    //       },
    //       {
    //         accessorKey: "updatedByFullName",
    //         header: "Updated By",
    //         cell: ({ row }) => {
    //           return row.original.updatedByFullName ? (
    //             <HStack>
    //               <Avatar size="sm" path={row.original.updatedByAvatar ?? null} />
    //               <p>{row.original.updatedByFullName}</p>
    //             </HStack>
    //           ) : null;
    //         },
    //       },
    //       {
    //         accessorKey: "updatedAt",
    //         header: "Updated At",
    //         cell: (item) => item.getValue(),
    //       },
    //     ];
    //   }, []);

    //   const defaultColumnVisibility = {
    //     createdAt: false,
    //     createdByFullName: false,
    //     receiptPromisedDate: false,
    //     updatedAt: false,
    //     updatedByFullName: false,
    //   };

    //   const renderContextMenu = useMemo(() => {
    //     // eslint-disable-next-line react/display-name
    //     return (row: RequestForQuote) => (
    //       <>
    //         <MenuItem
    //           disabled={!permissions.can("view", "purchasing")}
    //           onClick={() => alert("TODO")}
    //         >
    //           <MenuIcon icon={<BsFillPenFill />} />
    //           Edit
    //         </MenuItem>
    //         <MenuItem
    //           onClick={() => {
    //             alert("TODO");
    //           }}
    //         >
    //           <MenuIcon icon={<BsStar />} />
    //           Favorite
    //         </MenuItem>

    //         <MenuItem
    //           disabled={!permissions.can("delete", "purchasing")}
    //           onClick={() => alert("TODO")}
    //         >
    //           <MenuIcon icon={<IoMdTrash />} />
    //           Delete
    //         </MenuItem>
    //       </>
    //     );
    //   }, [permissions]);

    //   return (
    //     <>
    //       <Table<RequestForQuote>
    //         count={count}
    //         columns={columns}
    //         data={data}
    //         defaultColumnVisibility={defaultColumnVisibility}
    //         withColumnOrdering
    //         withFilters
    //         withPagination
    //         withSimpleSorting
    //         renderContextMenu={renderContextMenu}
    //       />
    //     </>
    //   );
  }
);

RequestForQuotesTable.displayName = "RequestForQuotesTable";

export default RequestForQuotesTable;
