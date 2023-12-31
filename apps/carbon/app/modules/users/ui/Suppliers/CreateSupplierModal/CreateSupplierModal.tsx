import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Select,
  VStack,
} from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
} from "@chakra-ui/react";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ValidatedForm, useControlField, useField } from "remix-validated-form";
import { Submit, Supplier } from "~/components/Form";
import { useUrlParams } from "~/hooks";
import type {
  SupplierContact as SupplierContactType,
  getSupplierContacts,
} from "~/modules/purchasing";
import { createSupplierAccountValidator } from "~/modules/users";
import type { Result } from "~/types";
import { path } from "~/utils/path";

const CreateSupplierModal = () => {
  const navigate = useNavigate();
  const [params] = useUrlParams();

  const formFetcher = useFetcher<Result>();
  const [supplier, setSupplier] = useState<string | undefined>(
    (params.get("supplier") as string) ?? undefined
  );
  const [contact, setContact] = useState<SupplierContactType["contact"] | null>(
    null
  );

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) navigate(path.to.supplierAccounts);
      }}
    >
      <ModalContent>
        <ValidatedForm
          method="post"
          action={`${path.to.newSupplierAccount}${
            params.get("supplier") ? `?supplier=${params.get("supplier")}` : ""
          }`}
          validator={createSupplierAccountValidator}
          defaultValues={{
            id: params.get("id") ?? "",
            supplier: params.get("supplier") ?? "",
          }}
          // @ts-ignore
          fetcher={formFetcher}
          className="flex flex-col h-full"
        >
          <ModalHeader>
            <ModalTitle>Create an account</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Supplier
                name="supplier"
                label="Supplier"
                onChange={(newValue) =>
                  setSupplier(newValue?.value as string | undefined)
                }
              />
              <SupplierContact
                name="id"
                supplier={supplier}
                onChange={setContact}
              />
              {contact && (
                <>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      isReadOnly
                      value={contact?.email ?? ""}
                      variant="filled"
                    />
                  </FormControl>
                  <Grid templateColumns="1fr 1fr" gap={4}>
                    <FormControl>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        isReadOnly
                        value={contact?.firstName ?? ""}
                        variant="filled"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        isReadOnly
                        value={contact?.lastName ?? ""}
                        variant="filled"
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Submit>Create User</Submit>
            </HStack>
          </ModalFooter>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
};

const SupplierContact = ({
  name,
  supplier,
  onChange,
}: {
  name: string;
  supplier?: string;
  onChange?: (newValue: SupplierContactType["contact"] | null) => void;
}) => {
  const initialLoad = useRef(true);
  const { error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | null>(name);

  const supplierContactFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierContacts>>>();

  useEffect(() => {
    if (supplier) {
      supplierContactFetcher.load(path.to.api.supplierContacts(supplier));
    }

    if (initialLoad.current) {
      initialLoad.current = false;
    } else {
      setValue(null);
      if (onChange) {
        onChange(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier]);

  const options = useMemo(
    () =>
      supplierContactFetcher.data?.data
        ? supplierContactFetcher.data?.data.map((c) => ({
            value: c.id,
            // @ts-ignore
            label: `${c.contact?.firstName} ${c.contact?.lastName}`,
          }))
        : [],
    [supplierContactFetcher.data]
  );

  const handleChange = (
    selection: {
      value: string | number;
      label: string;
    } | null
  ) => {
    const newValue = selection === null ? null : (selection.value as string);
    setValue(newValue);
    if (onChange && typeof onChange === "function") {
      if (newValue === null) onChange(newValue);
      const contact = supplierContactFetcher.data?.data?.find(
        (c) => c.id === newValue
      );

      onChange(contact?.contact ?? null);
    }
  };

  const controlledValue = useMemo(
    // @ts-ignore
    () => options.find((option) => option.value === value),
    [value, options]
  );

  // so that we can call onChange on load
  useEffect(() => {
    if (controlledValue && controlledValue.value === defaultValue) {
      handleChange(controlledValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledValue?.value]);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>Supplier Contact</FormLabel>
      <input type="hidden" name={name} id={name} value={value ?? ""} />
      <Select
        id={name}
        value={controlledValue}
        options={options}
        onChange={handleChange}
        isClearable
        w="full"
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default CreateSupplierModal;
