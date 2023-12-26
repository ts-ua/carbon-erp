import { HStack, VStack } from "@carbon/react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";
import { Hidden, Input, Password, Submit } from "~/components/Form";
import { useOnboarding } from "~/hooks";
import { getSupabaseServiceRole } from "~/lib/supabase";
import {
  onboardingUserValidator,
  updatePublicAccount,
} from "~/modules/account";
import { getUser } from "~/modules/users/users.server";
import { requirePermissions } from "~/services/auth";
import { destroyAuthSession } from "~/services/session";
import type { TypeOfValidator } from "~/types/validators";
import { assertIsPost } from "~/utils/http";

export async function loader({ request }: ActionFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {
    update: "users",
  });

  const user = await getUser(client, userId);
  if (user.error || !user.data) {
    await destroyAuthSession(request);
  }

  return { user: user.data };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "users",
  });

  const validation = await onboardingUserValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { firstName, lastName, email, password, next } = validation.data;

  const updatePassword =
    await getSupabaseServiceRole().auth.admin.updateUserById(userId, {
      email,
      password,
    });

  if (updatePassword.error) {
    console.error(updatePassword.error);
    throw new Error("Fatal: failed to update password");
  }

  const updateAccount = await updatePublicAccount(client, {
    id: userId,
    email,
    firstName,
    lastName,
    about: "",
  });

  if (updateAccount.error) {
    console.error(updateAccount.error);
    throw new Error("Fatal: failed to update account");
  }

  return redirect(next);
}

export default function OnboardingUser() {
  const { user } = useLoaderData<typeof loader>();
  const { next, previous, onPrevious } = useOnboarding();

  const initialValues = {} as TypeOfValidator<typeof onboardingUserValidator>;

  if (user?.email && user.email !== "admin@carbon.us.org") {
    initialValues.email = user.email;
  }
  if (
    user?.firstName &&
    user?.lastName &&
    user?.firstName !== "Carbon" &&
    user?.lastName !== "Admin"
  ) {
    initialValues.firstName = user?.firstName!;
    initialValues.lastName = user?.lastName!;
  }

  return (
    <Modal size="lg" isOpen onClose={() => 0}>
      <ModalOverlay />
      <ModalContent>
        <ValidatedForm
          autoComplete="off"
          validator={onboardingUserValidator}
          defaultValues={initialValues}
          method="post"
        >
          <ModalHeader>First let's setup your account</ModalHeader>

          <ModalBody>
            <Hidden name="next" value={next} />
            <VStack spacing={4}>
              <Input name="firstName" label="First Name" />
              <Input name="lastName" label="Last Name" />
              <Input autoComplete="off" name="email" label="Email" />
              <Password autoComplete="off" name="password" label="Password" />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Button
                isDisabled={!previous}
                size="md"
                disabled
                onClick={onPrevious}
              >
                Previous
              </Button>
              <Submit>Next</Submit>
            </HStack>
          </ModalFooter>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
}
