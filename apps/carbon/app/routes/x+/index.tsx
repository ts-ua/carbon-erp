import { type LoaderFunctionArgs } from "@remix-run/node";

import { Editor, useEditor } from "@carbon/react";

export async function loader({ request }: LoaderFunctionArgs) {
  return null;
}

export default function AppIndexRoute() {
  const editor = useEditor(`<h2>Hello, World</h2><p>Welcome to Carbon!</p>`);
  return <Editor editor={editor} className="h-[calc(100vh-98px)]" />;
}
