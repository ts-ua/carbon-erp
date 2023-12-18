import { PurchaseOrderPDFView } from "@carbon/documents";
// import { Editor, useEditor } from "@carbon/react";

export default function AppIndexRoute() {
  // const editor = useEditor(`<h2>Hello, World</h2><p>Welcome to Carbon!</p>`);
  // return <Editor editor={editor} h="calc(100vh - 98px)" />;
  return (
    <PurchaseOrderPDFView
      company={{
        name: "The Carbon Corporation",
        logo: "https://cdn.iconscout.com/icon/free/png-256/free-framer-logo-3609961-3014601.png",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        phone: "555-555-5555",
      }}
    />
  );
}
