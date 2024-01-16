import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VStack,
} from "@carbon/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PageTitle } from "~/components/Layout";
import type { PrivateAttributes } from "~/modules/account";
import { UserAttributesForm, getPrivateAttributes } from "~/modules/account";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Personal",
  to: path.to.accountPersonal,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {});

  const [privateAttributes] = await Promise.all([
    getPrivateAttributes(client, userId),
  ]);

  if (privateAttributes.error) {
    return redirect(
      path.to.authenticatedRoot,
      await flash(
        request,
        error(privateAttributes.error, "Failed to get user attributes")
      )
    );
  }

  return json({ attributes: privateAttributes.data });
}

export default function AccountPersonal() {
  const { attributes } = useLoaderData<typeof loader>();
  return (
    <>
      <PageTitle
        title="Personal Data"
        subtitle="This information is private and can only be seen by you and authorized employees."
      />
      <VStack spacing={8}>
        {attributes.length ? (
          attributes.map((category: PrivateAttributes) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <UserAttributesForm attributeCategory={category} />
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-muted-foreground w-full py-8 text-center">
              No private attributes
            </CardContent>
          </Card>
        )}
      </VStack>
    </>
  );
}
