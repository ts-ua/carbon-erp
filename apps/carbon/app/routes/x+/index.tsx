import { PurchaseOrderPDFView } from "@carbon/documents";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPurchaseOrder, getPurchaseOrderLines } from "~/modules/purchasing";
import { getCompany } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
// import { Editor, useEditor } from "@carbon/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {});
  const orderId = "cm2mban560l148d36up0";

  const [company, purchaseOrder, purchaseOrderLines] = await Promise.all([
    getCompany(client),
    getPurchaseOrder(client, orderId),
    getPurchaseOrderLines(client, orderId),
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

  return json({
    company: company.data,
    purchaseOrder: purchaseOrder.data,
    purchaseOrderLines: purchaseOrderLines.data,
  });
}

export default function AppIndexRoute() {
  // const editor = useEditor(`<h2>Hello, World</h2><p>Welcome to Carbon!</p>`);
  // return <Editor editor={editor} h="calc(100vh - 98px)" />;
  const { company, purchaseOrder, purchaseOrderLines } =
    useLoaderData<typeof loader>();

  return (
    <PurchaseOrderPDFView
      company={company}
      purchaseOrder={purchaseOrder}
      purchaseOrderLines={purchaseOrderLines ?? []}
    />
  );
}
