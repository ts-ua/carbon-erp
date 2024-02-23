import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  VStack,
  cn,
} from "@carbon/react";
import { useNavigate, useParams } from "@remix-run/react";
import { useState } from "react";
import { BsDownload, BsThreeDotsVertical, BsUpload } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { ValidatedForm } from "remix-validated-form";
import {
  Hidden,
  InputControlled,
  Number,
  Part,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import { quotationAssemblyValidator } from "~/modules/sales";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type QuotationAssemblyFormValues = TypeOfValidator<
  typeof quotationAssemblyValidator
>;

type QuotationAssemblyFormProps = {
  initialValues: QuotationAssemblyFormValues;
};

const QuotationAssemblyForm = ({
  initialValues,
}: QuotationAssemblyFormProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const { supabase } = useSupabase();

  const { id: quoteId, lineId } = useParams();
  if (!quoteId) throw new Error("quoteId not found");
  if (!lineId) throw new Error("lineId not found");

  const isEditing = initialValues.id !== undefined;

  const [partData, setPartData] = useState<{
    partId: string;
    description: string;
    uom: string;
  }>({
    partId: initialValues.partId ?? "",
    description: initialValues.description ?? "",
    uom: initialValues.unitOfMeasureCode ?? "",
  });

  const onPartChange = async (partId: string) => {
    if (!supabase) return;
    const [part] = await Promise.all([
      supabase
        .from("part")
        .select("name, replenishmentSystem, unitOfMeasureCode")
        .eq("id", partId)
        .single(),
    ]);

    setPartData({
      partId,
      description: part.data?.name ?? "",
      uom: part.data?.unitOfMeasureCode ?? "",
    });
  };

  return (
    <ValidatedForm
      method="post"
      validator={quotationAssemblyValidator}
      defaultValues={initialValues}
      className="w-full"
      action={
        isEditing
          ? path.to.quoteAssembly(quoteId, lineId, initialValues.id!)
          : path.to.newQuoteAssembly(quoteId, lineId)
      }
    >
      <Card className={cn(!isEditing && "mt-4")}>
        <HStack className="w-full justify-between items-start">
          <CardHeader>
            <CardTitle>
              {isEditing ? partData?.partId : "New Assembly"}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? partData?.description
                : "A quote assembly is a collection of operations, materials, and subassemblies that are used to build a product."}
            </CardDescription>
          </CardHeader>
          <CardAction>
            {isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    icon={<BsThreeDotsVertical />}
                    aria-label="More"
                    variant="secondary"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("delete")}>
                    <DropdownMenuIcon icon={<IoMdTrash />} />
                    Delete Assembly
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <DropdownMenuIcon icon={<BsDownload />} />
                    Get Part
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <DropdownMenuIcon icon={<BsUpload />} />
                    Save Part
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardAction>
        </HStack>
        <CardContent>
          <Hidden name="id" />
          <Hidden name="parentAssemblyId" />
          <Hidden name="unitOfMeasureCode" value={partData?.uom} />
          <VStack>
            <div className="grid w-full gap-x-8 gap-y-2 grid-cols-1 md:grid-cols-3">
              <VStack>
                <Part
                  name="partId"
                  label="Part"
                  partReplenishmentSystem="Make"
                  onChange={(value) => {
                    onPartChange(value?.value as string);
                  }}
                />
              </VStack>
              <VStack>
                <InputControlled
                  name="description"
                  label="Description"
                  value={partData.description}
                  onChange={(newValue) =>
                    setPartData((d) => ({ ...d, description: newValue }))
                  }
                />
              </VStack>
              <VStack>
                <Number
                  name="quantityPerParent"
                  label="Quantity per Parent"
                  minValue={0}
                />
              </VStack>
            </div>
          </VStack>
        </CardContent>
        <CardFooter>
          <Submit
            isDisabled={
              isEditing
                ? !permissions.can("update", "sales")
                : !permissions.can("create", "sales")
            }
          >
            Save
          </Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default QuotationAssemblyForm;
