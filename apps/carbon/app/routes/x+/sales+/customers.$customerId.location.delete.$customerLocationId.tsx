import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { deleteCustomerLocation } from "~/services/sales";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "sales",
  });

  const { customerId, customerLocationId } = params;
  if (!customerId || !customerLocationId) {
    return redirect(
      "/x/sales/customers",
      await flash(
        request,
        error(params, "Failed to get a customer location id")
      )
    );
  }

  const { error: deleteCustomerLocationError } = await deleteCustomerLocation(
    client,
    customerId,
    customerLocationId
  );
  if (deleteCustomerLocationError) {
    return redirect(
      `/x/sales/customers/${customerId}`,
      await flash(
        request,
        error(deleteCustomerLocationError, "Failed to delete customer location")
      )
    );
  }

  return redirect(
    `/x/sales/customers/${customerId}`,
    await flash(request, success("Successfully deleted customer location"))
  );
}