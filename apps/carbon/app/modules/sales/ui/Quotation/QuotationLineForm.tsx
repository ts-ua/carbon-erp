import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack,
} from "@carbon/react";

import { useNavigate, useParams } from "@remix-run/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Hidden,
  Input,
  InputControlled,
  Number,
  NumberControlled,
  Part,
  Submit,
} from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { Quotation } from "~/modules/sales";
import { quotationLineValidator } from "~/modules/sales";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type QuotationLineFormProps = {
  initialValues: TypeOfValidator<typeof quotationLineValidator>;
};

const QuotationLineForm = ({ initialValues }: QuotationLineFormProps) => {
  const permissions = usePermissions();
  const { supabase } = useSupabase();
  const navigate = useNavigate();

  const { id } = useParams();

  if (!id) throw new Error("id not found");

  const routeData = useRouteData<{
    quotation: Quotation;
  }>(path.to.quote(id));

  const [partData, setPartData] = useState<{
    partId: string;
    description: string;
    unitCost: number;
    unitPrice: number;
    // uom: string;
  }>({
    partId: initialValues.partId ?? "",
    description: initialValues.description ?? "",
    unitCost: initialValues.unitCost ?? 0,
    unitPrice: initialValues.unitPrice ?? 0,
    // uom: initialValues.unitOfMeasureCode ?? "",
  });

  const isEditable = ["Draft", "To Review"].includes(
    routeData?.quotation?.status ?? ""
  );

  const isEditing = initialValues.id !== undefined;
  const isDisabled = !isEditable
    ? true
    : isEditing
    ? !permissions.can("update", "sales")
    : !permissions.can("create", "sales");

  const onClose = () => navigate(-1);

  const onPartChange = async (partId: string) => {
    if (!supabase) return;
    const [part, cost] = await Promise.all([
      supabase
        .from("part")
        .select("name, unitOfMeasureCode")
        .eq("id", partId)
        .single(),
      supabase
        .from("partCost")
        .select("unitCost")
        .eq("partId", partId)
        .single(),
    ]);

    setPartData({
      partId,
      description: part.data?.name ?? "",
      unitCost: cost.data?.unitCost ?? 0,
      unitPrice: cost.data?.unitCost ?? 0,
      // uom: part.data?.unitOfMeasureCode ?? "EA",
    });
  };

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          defaultValues={initialValues}
          validator={quotationLineValidator}
          method="post"
          action={
            isEditing
              ? path.to.quoteLine(id, initialValues.id!)
              : path.to.newQuoteLine(id)
          }
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>
              {isEditing ? "Edit" : "New"} Quotation Line
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <Hidden name="quoteId" />
            <Hidden name="unitCost" value={partData.unitCost} />
            <VStack spacing={4}>
              <Part
                name="partId"
                label="Part"
                onChange={(value) => {
                  onPartChange(value?.value as string);
                }}
              />

              <InputControlled
                name="description"
                label="Description"
                value={partData.description}
                onChange={(newValue) =>
                  setPartData((d) => ({ ...d, description: newValue }))
                }
              />
              <Input name="customerPartId" label="Customer Part ID" />
              <Number name="quantity" label="Quantity" />
              <NumberControlled
                name="unitPrice"
                label="Unit Price"
                value={partData.unitPrice}
              />
              <Number name="leadTime" label="Lead Time (Days)" />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button size="md" variant="solid" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </ValidatedForm>
      </DrawerContent>
    </Drawer>
  );
};

export default QuotationLineForm;
