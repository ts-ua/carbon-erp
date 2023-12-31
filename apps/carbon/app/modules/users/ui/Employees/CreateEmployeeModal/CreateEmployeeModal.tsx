import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  VStack,
  useMount,
} from "@carbon/react";
import { Grid } from "@chakra-ui/react";
import { useFetcher, useNavigate } from "@remix-run/react";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { useRef } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Input, Select, Submit } from "~/components/Form";
import type { EmployeeType } from "~/modules/users";
import { createEmployeeValidator } from "~/modules/users";
import type { Result } from "~/types";
import { path } from "~/utils/path";

const CreateEmployeeModal = () => {
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const formFetcher = useFetcher<Result>();
  const employeeTypeFetcher = useFetcher<PostgrestResponse<EmployeeType>>();

  useMount(() => {
    employeeTypeFetcher.load(path.to.api.employeeTypes);
  });

  const employeeTypeOptions =
    employeeTypeFetcher.data?.data?.map((et) => ({
      value: et.id,
      label: et.name,
    })) ?? [];

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) navigate(path.to.employeeAccounts);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ValidatedForm
          method="post"
          action={path.to.newEmployee}
          validator={createEmployeeValidator}
          // @ts-ignore
          fetcher={formFetcher}
          className="flex flex-col h-full"
        >
          <ModalHeader>
            <ModalTitle>Create an account</ModalTitle>
          </ModalHeader>

          <ModalBody>
            <VStack spacing={4}>
              <Input ref={initialFocusRef} name="email" label="Email" />
              <Grid templateColumns="1fr 1fr" gap={4}>
                <Input name="firstName" label="First Name" />
                <Input name="lastName" label="Last Name" />
              </Grid>
              <Select
                name="employeeType"
                label="Employee Type"
                isLoading={employeeTypeFetcher.state === "loading"}
                options={employeeTypeOptions}
                placeholder="Select Employee Type"
              />
            </VStack>
            <ModalFooter>
              <HStack>
                <Submit>Create User</Submit>
              </HStack>
            </ModalFooter>
          </ModalBody>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
};

export default CreateEmployeeModal;
