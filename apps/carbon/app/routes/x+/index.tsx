import { PurchaseOrderPDFView } from "@carbon/documents";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  getPurchaseOrder,
  getPurchaseOrderLines,
  getPurchaseOrderLocations,
} from "~/modules/purchasing";
import { getCompany } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
// import { Editor, useEditor } from "@carbon/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {});
  const orderId = "cm3dngba00l02e3p9f8g";

  const [company, purchaseOrder, purchaseOrderLines, purchaseOrderLocations] =
    await Promise.all([
      getCompany(client),
      getPurchaseOrder(client, orderId),
      getPurchaseOrderLines(client, orderId),
      getPurchaseOrderLocations(client, orderId),
    ]);

  if (company.error) {
    console.error(company.error);
  }
  if (purchaseOrder.error) {
    console.error(purchaseOrder.error);
  }
  if (purchaseOrderLines.error) {
    console.error(purchaseOrderLines.error);
  }
  if (purchaseOrderLocations.error) {
    console.error(purchaseOrderLocations.error);
  }

  return json({
    company: company.data,
    purchaseOrder: purchaseOrder.data,
    purchaseOrderLines: purchaseOrderLines.data,
    purchaseOrderLocations: purchaseOrderLocations.data,
  });
}

export default function AppIndexRoute() {
  // const editor = useEditor(`<h2>Hello, World</h2><p>Welcome to Carbon!</p>`);
  // return <Editor editor={editor} h="calc(100vh - 98px)" />;
  const { company, purchaseOrder, purchaseOrderLines, purchaseOrderLocations } =
    useLoaderData<typeof loader>();

  return (
    <PurchaseOrderPDFView
      company={company}
      purchaseOrder={purchaseOrder}
      purchaseOrderLines={purchaseOrderLines ?? []}
      purchaseOrderLocations={purchaseOrderLocations}
    />
  );
}
