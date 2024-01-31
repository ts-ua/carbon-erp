import { PurchaseOrderPDF } from "@carbon/documents";
import { renderToStream } from "@react-pdf/renderer";
import { type LoaderFunctionArgs } from "@remix-run/node";
import logger from "~/lib/logger";
import {
  getPurchaseOrder,
  getPurchaseOrderLines,
  getPurchaseOrderLocations,
} from "~/modules/purchasing";
import { getCompany } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  const [company, purchaseOrder, purchaseOrderLines, purchaseOrderLocations] =
    await Promise.all([
      getCompany(client),
      getPurchaseOrder(client, orderId),
      getPurchaseOrderLines(client, orderId),
      getPurchaseOrderLocations(client, orderId),
    ]);

  if (company.error) {
    logger.error(company.error);
  }

  if (purchaseOrder.error) {
    logger.error(purchaseOrder.error);
  }

  if (purchaseOrderLines.error) {
    logger.error(purchaseOrderLines.error);
  }

  if (purchaseOrderLocations.error) {
    logger.error(purchaseOrderLocations.error);
  }

  if (
    company.error ||
    purchaseOrder.error ||
    purchaseOrderLines.error ||
    purchaseOrderLocations.error
  ) {
    throw new Error("Failed to load purchase order");
  }

  const stream = await renderToStream(
    <PurchaseOrderPDF
      company={company.data}
      purchaseOrder={purchaseOrder.data}
      purchaseOrderLines={purchaseOrderLines.data ?? []}
      purchaseOrderLocations={purchaseOrderLocations.data}
    />
  );

  const body: Buffer = await new Promise((resolve, reject) => {
    const buffers: Uint8Array[] = [];
    stream.on("data", (data) => {
      buffers.push(data);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    stream.on("error", reject);
  });

  const headers = new Headers({ "Content-Type": "application/pdf" });
  return new Response(body, { status: 200, headers });
}
