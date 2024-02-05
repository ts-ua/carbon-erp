import { HStack, Hyperlink } from "@carbon/react";
import { useFetcher, useFetchers, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { Avatar, Table } from "~/components";
import {
  RequestForQuoteStatus,
  type RequestForQuote,
  type requestForQuoteStatusType,
} from "~/modules/purchasing";
import { favoriteSchema } from "~/types/validators";
import { path } from "~/utils/path";
// import { RequestForQuoteStatus } from "~/modules/purchasing";

type RequestForQuotesTableProps = {
  data: RequestForQuote[];
  count: number;
};

const RequestForQuotesTable = memo(
  ({ data, count }: RequestForQuotesTableProps) => {
    const navigate = useNavigate();
    const fetcher = useFetcher();
    const optimisticFavorite = useOptimisticFavorite();

    const rows = useMemo<RequestForQuote[]>(
      () =>
        data.map((d) =>
          d.id === optimisticFavorite?.id
            ? {
                ...d,
                favorite: optimisticFavorite?.favorite
                  ? optimisticFavorite.favorite === "favorite"
                  : d.favorite,
              }
            : d
        ),
      [data, optimisticFavorite]
    );

    const columns = useMemo<ColumnDef<RequestForQuote>[]>(() => {
      return [
        {
          accessorKey: "requestForQuoteId",
          header: "Name",
          cell: ({ row }) => (
            <HStack>
              {row.original.favorite ? (
                <fetcher.Form
                  method="post"
                  action={path.to.requestForQuoteFavorite}
                >
                  <input type="hidden" name="id" value={row.original.id!} />
                  <input type="hidden" name="favorite" value="unfavorite" />
                  <button type="submit">
                    <BsStarFill
                      className="text-yellow-400 cursor-pointer h-4 w-4"
                      type="submit"
                    />
                  </button>
                </fetcher.Form>
              ) : (
                <fetcher.Form
                  method="post"
                  action={path.to.requestForQuoteFavorite}
                >
                  <input type="hidden" name="id" value={row.original.id!} />
                  <input type="hidden" name="favorite" value="favorite" />
                  <button type="submit">
                    <BsStar
                      className="text-yellow-400 cursor-pointer h-4 w-4"
                      type="submit"
                    />
                  </button>
                </fetcher.Form>
              )}
              <Hyperlink
                onClick={() =>
                  navigate(path.to.requestForQuote(row.original.id!))
                }
              >
                {row.original.requestForQuoteId}
              </Hyperlink>
            </HStack>
          ),
        },
        {
          accessorKey: "description",
          header: "Description",
          cell: (item) => {
            if (item.getValue<string>()) {
              return item.getValue<string>().substring(0, 50);
            }
            return null;
          },
        },
        {
          accessorKey: "status",
          header: "Status",
          cell: (item) => {
            const status =
              item.getValue<(typeof requestForQuoteStatusType)[number]>();
            return <RequestForQuoteStatus status={status} />;
          },
        },
        {
          accessorKey: "receiptDate",
          header: "Receipt Date",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "expirationDate",
          header: "Expiration Date",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "createdByFullName",
          header: "Created By",
          cell: ({ row }) => {
            return (
              <HStack>
                <Avatar size="sm" path={row.original.createdByAvatar} />
                <p>{row.original.createdByFullName}</p>
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
                <p>{row.original.updatedByFullName}</p>
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
    }, [fetcher, navigate]);

    const defaultColumnVisibility = {
      createdAt: false,
      createdByFullName: false,
      updatedAt: false,
      updatedByFullName: false,
    };

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

    return (
      <>
        <Table<RequestForQuote>
          count={count}
          columns={columns}
          data={rows}
          defaultColumnVisibility={defaultColumnVisibility}
          withColumnOrdering
          withFilters
          withPagination
          withSimpleSorting
          // renderContextMenu={renderContextMenu}
        />
      </>
    );
  }
);

RequestForQuotesTable.displayName = "RequestForQuotesTable";

export default RequestForQuotesTable;

function useOptimisticFavorite() {
  const fetchers = useFetchers();
  const favoriteFetcher = fetchers.find(
    (f) => f.formAction === path.to.requestForQuoteFavorite
  );

  if (favoriteFetcher && favoriteFetcher.formData) {
    const id = favoriteFetcher.formData.get("id");
    const favorite = favoriteFetcher.formData.get("favorite") ?? "off";
    const submission = favoriteSchema.safeParse({ id, favorite });
    if (submission.success) {
      return submission.data;
    }
  }
}
