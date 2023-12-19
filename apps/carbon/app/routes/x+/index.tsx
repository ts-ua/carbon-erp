import { PurchaseOrderPDFView } from "@carbon/documents";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPurchaseOrder } from "~/modules/purchasing";
import { getCompany } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
// import { Editor, useEditor } from "@carbon/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {});
  const [company, purchaseOrder] = await Promise.all([
    getCompany(client),
    getPurchaseOrder(client, "cm0ol20h80l0h88u5240"),
  ]);

  if (company.error) throw company.error;
  if (purchaseOrder.error) throw purchaseOrder.error;

  return json({
    company: company.data,
    purchaseOrder: purchaseOrder.data,
  });
}

export default function AppIndexRoute() {
  // const editor = useEditor(`<h2>Hello, World</h2><p>Welcome to Carbon!</p>`);
  // return <Editor editor={editor} h="calc(100vh - 98px)" />;
  const { company, purchaseOrder } = useLoaderData<typeof loader>();

  return (
    <PurchaseOrderPDFView company={company} purchaseOrder={purchaseOrder} />
  );
}
