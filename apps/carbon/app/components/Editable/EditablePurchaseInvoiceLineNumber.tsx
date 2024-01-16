/* eslint-disable react/display-name */
import type { Database } from "@carbon/database";
import type {
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";
import { Combobox } from "~/components";
import type { EditableTableCellComponentProps } from "~/components/Editable";
import type { PurchaseInvoiceLine } from "~/modules/invoicing";

const EditablePurchaseInvoiceLineNumber =
  (
    mutation: (
      accessorKey: string,
      newValue: string,
      row: PurchaseInvoiceLine
    ) => Promise<PostgrestSingleResponse<unknown>>,
    options: {
      client?: SupabaseClient<Database>;
      parts: { label: string; value: string }[];
      accounts: { label: string; value: string }[];
      services: { label: string; value: string }[];
      defaultLocationId: string | null;
      userId: string;
    }
  ) =>
  ({
    value,
    row,
    accessorKey,
    onError,
    onUpdate,
  }: EditableTableCellComponentProps<PurchaseInvoiceLine>) => {
    const { client, parts, services, accounts, userId } = options;
    const selectOptions =
      row.invoiceLineType === "Part"
        ? parts
        : row.invoiceLineType === "Service"
        ? services
        : row.invoiceLineType === "G/L Account"
        ? accounts
        : [];

    const onAccountChange = async (accountNumber: string) => {
      if (!client) throw new Error("Supabase client not found");

      const account = await client
        .from("account")
        .select("name")
        .eq("number", accountNumber)
        .single();

      onUpdate("description", account.data?.name ?? "");
      onUpdate("accountNumber", accountNumber);

      try {
        const { error } = await client
          .from("purchaseInvoiceLine")
          .update({
            accountNumber: accountNumber,
            description: account.data?.name ?? "",
            updatedBy: userId,
          })
          .eq("id", row.id);

        if (error) onError();
      } catch (error) {
        console.error(error);
        onError();
      }
    };

    const onPartChange = async (partId: string) => {
      if (!client) throw new Error("Supabase client not found");
      const [part, shelf, cost] = await Promise.all([
        client
          .from("part")
          .select("name, unitOfMeasureCode")
          .eq("id", partId)
          .single(),
        client
          .from("partInventory")
          .select("defaultShelfId")
          .eq("partId", partId)
          .eq("locationId", options.defaultLocationId!)
          .single(),
        client
          .from("partCost")
          .select("unitCost")
          .eq("partId", partId)
          .single(),
      ]);

      if (part.error) {
        onError();
        return;
      }

      onUpdate("partId", partId);
      onUpdate("description", part.data?.name);
      onUpdate("unitOfMeasureCode", part.data?.unitOfMeasureCode ?? null);
      onUpdate("locationId", options.defaultLocationId);
      onUpdate("shelfId", shelf.data?.defaultShelfId ?? null);
      onUpdate("unitPrice", cost.data?.unitCost ?? null);

      try {
        const { error } = await client
          .from("purchaseInvoiceLine")
          .update({
            partId: partId,
            assetId: null,
            accountNumber: null,
            description: part.data?.name,
            unitOfMeasureCode: part.data?.unitOfMeasureCode ?? null,
            locationId: options.defaultLocationId,
            shelfId: shelf.data?.defaultShelfId ?? null,
            unitPrice: cost.data?.unitCost,
            updatedBy: userId,
          })
          .eq("id", row.id);

        if (error) onError();
      } catch (error) {
        console.error(error);
        onError();
      }
    };

    const onServiceChange = async (serviceId: string) => {
      if (!client) throw new Error("Supabase client not found");
      const service = await client
        .from("service")
        .select("name")
        .eq("id", serviceId)
        .single();

      if (service.error) {
        onError();
        return;
      }

      onUpdate("serviceId", serviceId);
      onUpdate("description", service.data?.name);

      try {
        const { error } = await client
          .from("purchaseInvoiceLine")
          .update({
            serviceId: serviceId,
            updatedBy: userId,
          })
          .eq("id", row.id);

        if (error) onError();
      } catch (error) {
        console.error(error);
        onError();
      }
    };

    const onChange = (newValue: string | null) => {
      if (!newValue) return;

      if (row.invoiceLineType === "Part") {
        onPartChange(newValue);
      } else if (row.invoiceLineType === "G/L Account") {
        onAccountChange(newValue);
      } else if (row.invoiceLineType === "Service") {
        onServiceChange(newValue);
      }
    };

    const selectedValue = getValue(row);

    return (
      <Combobox
        autoFocus
        value={selectedValue ?? ""}
        options={selectOptions}
        onChange={onChange}
        size="sm"
        className="border-0 rounded-none w-full"
      />
    );
  };

EditablePurchaseInvoiceLineNumber.displayName =
  "EditablePurchaseInvoiceLineNumber";
export default EditablePurchaseInvoiceLineNumber;

function getValue(row: PurchaseInvoiceLine) {
  switch (row.invoiceLineType) {
    case "Part":
      return row.partId;
    case "Service":
      return row.serviceId;
    case "G/L Account":
      return row.accountNumber;
    case "Fixed Asset":
      return row.assetId;
    default:
      return null;
  }
}
