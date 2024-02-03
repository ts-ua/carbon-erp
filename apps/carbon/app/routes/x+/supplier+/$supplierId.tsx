import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import {
  SupplierHeader,
  SupplierSidebar,
  getSupplier,
  getSupplierContacts,
  getSupplierLocations,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Suppliers",
  to: path.to.suppliers,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { supplierId } = params;
  if (!supplierId) throw new Error("Could not find supplierId");

  const [supplier, contacts, locations] = await Promise.all([
    getSupplier(client, supplierId),
    getSupplierContacts(client, supplierId),
    getSupplierLocations(client, supplierId),
  ]);

  if (supplier.error) {
    return redirect(
      path.to.suppliers,
      await flash(
        request,
        error(supplier.error, "Failed to load supplier summary")
      )
    );
  }

  return json({
    supplier: supplier.data,
    contacts: contacts.data ?? [],
    locations: locations.data ?? [],
  });
}

export default function SupplierRoute() {
  return (
    <>
      <SupplierHeader />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_4fr] h-full w-full gap-4">
        <SupplierSidebar />
        <Outlet />
      </div>
    </>
  );
}
