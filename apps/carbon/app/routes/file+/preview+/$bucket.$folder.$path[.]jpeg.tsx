import { type LoaderFunctionArgs } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";

export let loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { client } = await requirePermissions(request, {
    view: "documents",
  });
  const { bucket, folder, path } = params;
  if (!bucket) throw new Error("Could not find bucket");
  if (!path) throw new Error("Could not find path");
  if (!folder) throw new Error("Could not find folder");

  const result = await client.storage
    .from(bucket)
    .download(`${folder}/${path}.jpeg`);
  if (result.error) {
    throw new Error("Failed to load file");
  }

  const headers = new Headers({ "Content-Type": "image/jpeg" });
  return new Response(result.data, { status: 200, headers });
};
