import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  Menubar,
  MenubarItem,
  VStack,
} from "@carbon/react";
import { Grid } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import {
  Hidden,
  Input,
  Select,
  SelectControlled,
  Submit,
} from "~/components/Form";
import DataGrid from "~/components/Grid";
import { SectionTitle } from "~/components/Layout";
import type { ReceiptLine, ReceiptSourceDocument } from "~/modules/inventory";
import {
  receiptSourceDocumentType,
  receiptValidator,
} from "~/modules/inventory";
import type { Note } from "~/modules/shared";
import { Notes } from "~/modules/shared";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";
import useReceiptForm from "./useReceiptForm";

type ReceiptFormProps = {
  initialValues: TypeOfValidator<typeof receiptValidator>;
  isPosted: boolean;
  notes: Note[];
  receiptLines?: ReceiptLine[];
};

const formId = "receipt-form";

const ReceiptForm = ({
  initialValues,
  isPosted,
  notes,
  receiptLines,
}: ReceiptFormProps) => {
  const {
    editableComponents,
    locationId,
    locations,
    internalReceiptLines,
    canPost,
    isDisabled,
    receiptLineColumns,
    sourceDocumentId,
    supplierId,
    sourceDocuments,
    onClose,
    onPost,
    setLocationId,
    setReceiptLines,
    setSourceDocument,
    setSourceDocumentId,
  } = useReceiptForm({
    receipt: initialValues,
    receiptLines: receiptLines ?? [],
  });

  return (
    <>
      <Drawer
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DrawerContent size="full">
          <DrawerHeader>
            <DrawerTitle>{initialValues.receiptId}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <Menubar className="mb-2 mt--2">
                <MenubarItem isDisabled={!canPost || isPosted} onClick={onPost}>
                  Post
                </MenubarItem>
              </Menubar>

              <div className="w-full">
                <ValidatedForm
                  id={formId}
                  validator={receiptValidator}
                  method="post"
                  action={path.to.receipt(initialValues.id)}
                  defaultValues={initialValues}
                  style={{ width: "100%" }}
                >
                  <Hidden name="id" />
                  <Hidden
                    name="sourceDocumentReadableId"
                    value={
                      sourceDocuments.find((d) => d.id === sourceDocumentId)
                        ?.name ?? ""
                    }
                  />
                  <Hidden name="supplierId" value={supplierId ?? ""} />
                  <VStack spacing={4} className="min-h-full">
                    <Grid
                      gridTemplateColumns={["1fr", "1fr", "1fr 1fr"]}
                      gridColumnGap={8}
                      gridRowGap={4}
                      w="full"
                    >
                      <Input name="receiptId" label="Receipt ID" isReadOnly />
                      <SelectControlled
                        name="locationId"
                        label="Location"
                        options={
                          locations.map((l) => ({
                            label: l.name,
                            value: l.id,
                          })) ?? []
                        }
                        value={locationId ?? undefined}
                        onChange={(newValue) =>
                          setLocationId(newValue as string)
                        }
                        isReadOnly={isPosted}
                      />
                      <Select
                        name="sourceDocument"
                        label="Source Document"
                        options={receiptSourceDocumentType.map((v) => ({
                          label: v,
                          value: v,
                        }))}
                        onChange={(newValue) => {
                          setSourceDocument(
                            newValue.value as ReceiptSourceDocument
                          );
                          setSourceDocumentId(null);
                        }}
                        isReadOnly={isPosted}
                      />
                      <SelectControlled
                        name="sourceDocumentId"
                        label="Source Document ID"
                        options={sourceDocuments.map((d) => ({
                          label: d.name,
                          value: d.id,
                        }))}
                        value={sourceDocumentId ?? undefined}
                        onChange={(newValue) => {
                          setSourceDocumentId(newValue as string);
                        }}
                        isReadOnly={isPosted}
                      />
                      <Input
                        name="externalDocumentId"
                        label="External Reference"
                      />
                    </Grid>
                  </VStack>
                </ValidatedForm>
              </div>

              <VStack>
                <SectionTitle>Receipt Lines</SectionTitle>
                <DataGrid<ReceiptLine>
                  data={internalReceiptLines}
                  columns={receiptLineColumns}
                  canEdit={!isPosted}
                  contained={false}
                  editableComponents={editableComponents}
                  onDataChange={setReceiptLines}
                />
              </VStack>

              <Notes notes={notes} documentId={initialValues.id} />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit formId={formId} isDisabled={isDisabled}>
                Save
              </Submit>
              <Button size="md" variant="solid" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Outlet />
    </>
  );
};

export default ReceiptForm;
