import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { insertQuoteLineQuantity } from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "sales",
  });

  const { id, lineId } = params;
  if (!id) throw new Error("Could not find id");
  if (!lineId) throw new Error("Could not find lineId");

  const createQuoteQuantity = await insertQuoteLineQuantity(client, {
    quoteLineId: lineId,
    createdBy: userId,
  });

  if (createQuoteQuantity.error) {
    return redirect(
      path.to.quoteLine(id, lineId),
      await flash(
        request,
        error(
          createQuoteQuantity.error,
          "Failed to create quote line quantity."
        )
      )
    );
  }

  return redirect(path.to.quoteLine(id, lineId));
}
