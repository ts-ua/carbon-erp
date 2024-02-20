import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { sanitize } from "~/utils/supabase";
import type {
  customerContactValidator,
  customerPaymentValidator,
  customerShippingValidator,
  customerTypeValidator,
  customerValidator,
  quotationAssemblyValidator,
  quotationLineValidator,
  quotationValidator,
} from "./sales.models";

export async function deleteCustomerContact(
  client: SupabaseClient<Database>,
  customerId: string,
  customerContactId: string
) {
  return client
    .from("customerContact")
    .delete()
    .eq("customerId", customerId)
    .eq("id", customerContactId);
}

export async function deleteCustomerLocation(
  client: SupabaseClient<Database>,
  customerId: string,
  customerLocationId: string
) {
  return client
    .from("customerLocation")
    .delete()
    .eq("customerId", customerId)
    .eq("id", customerLocationId);
}

export async function deleteCustomerType(
  client: SupabaseClient<Database>,
  customerTypeId: string
) {
  return client.from("customerType").delete().eq("id", customerTypeId);
}

export async function deleteQuote(
  client: SupabaseClient<Database>,
  quoteId: string
) {
  return client.from("quote").delete().eq("id", quoteId);
}

export async function deleteQuoteAssembly(
  client: SupabaseClient<Database>,
  quoteAssemblyId: string
) {
  return client.from("quoteAssembly").delete().eq("id", quoteAssemblyId);
}

export async function deleteQuoteLine(
  client: SupabaseClient<Database>,
  quoteLineId: string
) {
  return client.from("quoteLine").delete().eq("id", quoteLineId);
}

export async function getCustomer(
  client: SupabaseClient<Database>,
  customerId: string
) {
  return client.from("customer").select("*").eq("id", customerId).single();
}

export async function getCustomerContact(
  client: SupabaseClient<Database>,
  customerContactId: string
) {
  return client
    .from("customerContact")
    .select(
      "id, contact(id, firstName, lastName, email, mobilePhone, homePhone, workPhone, fax, title, addressLine1, addressLine2, city, state, postalCode, country(id, name), birthday, notes)"
    )
    .eq("id", customerContactId)
    .single();
}

export async function getCustomerContacts(
  client: SupabaseClient<Database>,
  customerId: string
) {
  return client
    .from("customerContact")
    .select(
      "id, contact(id, firstName, lastName, email, mobilePhone, homePhone, workPhone, fax, title, addressLine1, addressLine2, city, state, postalCode, country(id, name), birthday, notes), user(id, active)"
    )
    .eq("customerId", customerId);
}

export async function getCustomerLocation(
  client: SupabaseClient<Database>,
  customerContactId: string
) {
  return client
    .from("customerLocation")
    .select(
      "id, address(id, addressLine1, addressLine2, city, state, country(id, name), postalCode)"
    )
    .eq("id", customerContactId)
    .single();
}

export async function getCustomerLocations(
  client: SupabaseClient<Database>,
  customerId: string
) {
  return client
    .from("customerLocation")
    .select(
      "id, address(id, addressLine1, addressLine2, city, state, country(id, name), postalCode)"
    )
    .eq("customerId", customerId);
}

export async function getCustomerPayment(
  client: SupabaseClient<Database>,
  customerId: string
) {
  return client
    .from("customerPayment")
    .select("*")
    .eq("customerId", customerId)
    .single();
}

export async function getCustomerShipping(
  client: SupabaseClient<Database>,
  customerId: string
) {
  return client
    .from("customerShipping")
    .select("*")
    .eq("customerId", customerId)
    .single();
}

export async function getCustomers(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
    type: string | null;
    status: string | null;
  }
) {
  let query = client.from("customers").select("*", {
    count: "exact",
  });

  if (args.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args.type) {
    query = query.eq("customerTypeId", args.type);
  }

  if (args.status) {
    query = query.eq("customerStatusId", args.status);
  }

  query = setGenericQueryFilters(query, args, "name");
  return query;
}

export async function getCustomersList(client: SupabaseClient<Database>) {
  return client.from("customer").select("id, name").order("name");
}

export async function getCustomerStatuses(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client
    .from("customerStatus")
    .select("id, name", { count: "exact" });

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function getCustomerType(
  client: SupabaseClient<Database>,
  customerTypeId: string
) {
  return client
    .from("customerType")
    .select("id, name, color, protected")
    .eq("id", customerTypeId)
    .single();
}

export async function getCustomerTypes(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client
    .from("customerType")
    .select("id, name, color, protected", { count: "exact" });

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function getCustomerTypesList(client: SupabaseClient<Database>) {
  return client.from("customerType").select("id, name").order("name");
}

export async function getQuote(
  client: SupabaseClient<Database>,
  quoteId: string
) {
  return client.from("quotes").select("*").eq("id", quoteId).single();
}

export async function getQuotes(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    search: string | null;
    status: string | null;
    customerId: string | null;
    partId: string | null;
  }
) {
  let query = client.from("quotes").select("*", { count: "exact" });

  if (args.search) {
    query = query.or(
      `id.ilike.%${args.search}%,quoteId.ilike.%${args.search}%,name.ilike.%${args.search}%`
    );
  }

  if (args.status) {
    query = query.eq("status", args.status);
  }

  if (args.customerId) {
    query = query.eq("customerId", args.customerId);
  }

  if (args.partId) {
    query = query.contains("partIds", [args.partId]);
  }

  query = setGenericQueryFilters(query, args, "id", false);
  return query;
}

export async function getQuoteAssembly(
  client: SupabaseClient<Database>,
  quoteAssemblyId: string
) {
  return client
    .from("quoteAssembly")
    .select("*")
    .eq("id", quoteAssemblyId)
    .single();
}

export async function getQuoteExternalDocuments(
  client: SupabaseClient<Database>,
  quoteId: string
) {
  return client.storage.from("quote-external").list(quoteId);
}

export async function getQuoteInternalDocuments(
  client: SupabaseClient<Database>,
  quoteId: string
) {
  return client.storage.from("quote-internal").list(quoteId);
}

export async function getQuoteLine(
  client: SupabaseClient<Database>,
  quoteLineId: string
) {
  return client.from("quoteLine").select("*").eq("id", quoteLineId).single();
}

export async function getQuoteLines(
  client: SupabaseClient<Database>,
  quoteId: string
) {
  return client.from("quoteLine").select("*").eq("quoteId", quoteId);
}

export async function getQuoteLineQuantities(
  client: SupabaseClient<Database>,
  quoteLineId: string
) {
  return client
    .from("quoteLineQuantity")
    .select("*")
    .eq("quoteLineId", quoteLineId);
}

export async function insertCustomer(
  client: SupabaseClient<Database>,
  customer:
    | (Omit<TypeOfValidator<typeof customerValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof customerValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  return client.from("customer").insert([customer]).select("id").single();
}

export async function insertCustomerContact(
  client: SupabaseClient<Database>,
  customerContact: {
    customerId: string;
    contact: TypeOfValidator<typeof customerContactValidator>;
  }
) {
  const insertContact = await client
    .from("contact")
    .insert([customerContact.contact])
    .select("id")
    .single();
  if (insertContact.error) {
    return insertContact;
  }

  const contactId = insertContact.data?.id;
  if (!contactId) {
    return { data: null, error: new Error("Contact ID not found") };
  }

  return client
    .from("customerContact")
    .insert([
      {
        customerId: customerContact.customerId,
        contactId,
      },
    ])
    .select("id")
    .single();
}

export async function insertCustomerLocation(
  client: SupabaseClient<Database>,
  customerLocation: {
    customerId: string;
    address: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      // countryId: string;
      postalCode?: string;
    };
  }
) {
  const insertAddress = await client
    .from("address")
    .insert([customerLocation.address])
    .select("id")
    .single();
  if (insertAddress.error) {
    return insertAddress;
  }

  const addressId = insertAddress.data?.id;
  if (!addressId) {
    return { data: null, error: new Error("Address ID not found") };
  }

  return client
    .from("customerLocation")
    .insert([
      {
        customerId: customerLocation.customerId,
        addressId,
      },
    ])
    .select("id")
    .single();
}

export async function insertQuoteLineQuantity(
  client: SupabaseClient<Database>,
  quoteLineQuantity: {
    quoteLineId: string;
    quantity?: number;
    createdBy: string;
  }
) {
  const quoteLine = await getQuoteLine(client, quoteLineQuantity.quoteLineId);
  if (quoteLine.error) {
    return quoteLine;
  }

  const partId = quoteLine.data?.partId;
  const [partCost] = await Promise.all([
    client.from("partCost").select("unitCost").eq("partId", partId).single(),
  ]);

  if (partCost.error) {
    return partCost;
  }

  return client.from("quoteLineQuantity").insert([
    {
      ...quoteLineQuantity,
      materialCost:
        quoteLine.data.replenishmentSystem === "Make"
          ? partCost.data?.unitCost
          : 0,
    },
  ]);
}

export async function updateCustomer(
  client: SupabaseClient<Database>,
  customer: Omit<TypeOfValidator<typeof customerValidator>, "id"> & {
    id: string;
    updatedBy: string;
  }
) {
  return client
    .from("customer")
    .update(sanitize(customer))
    .eq("id", customer.id)
    .select("id")
    .single();
}

export async function updateCustomerContact(
  client: SupabaseClient<Database>,
  customerContact: {
    contactId: string;
    contact: {
      firstName?: string;
      lastName?: string;
      email: string;
      mobilePhone?: string;
      homePhone?: string;
      workPhone?: string;
      fax?: string;
      title?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      // countryId: string;
      postalCode?: string;
      birthday?: string;
      notes?: string;
    };
  }
) {
  return client
    .from("contact")
    .update(sanitize(customerContact.contact))
    .eq("id", customerContact.contactId)
    .select("id")
    .single();
}

export async function updateCustomerLocation(
  client: SupabaseClient<Database>,
  customerLocation: {
    addressId: string;
    address: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      // countryId: string;
      postalCode?: string;
    };
  }
) {
  return client
    .from("address")
    .update(sanitize(customerLocation.address))
    .eq("id", customerLocation.addressId)
    .select("id")
    .single();
}
export async function updateCustomerPayment(
  client: SupabaseClient<Database>,
  customerPayment: TypeOfValidator<typeof customerPaymentValidator> & {
    updatedBy: string;
  }
) {
  return client
    .from("customerPayment")
    .update(sanitize(customerPayment))
    .eq("customerId", customerPayment.customerId);
}

export async function updateCustomerShipping(
  client: SupabaseClient<Database>,
  customerShipping: TypeOfValidator<typeof customerShippingValidator> & {
    updatedBy: string;
  }
) {
  return client
    .from("customerShipping")
    .update(sanitize(customerShipping))
    .eq("customerId", customerShipping.customerId);
}

export async function upsertCustomerType(
  client: SupabaseClient<Database>,
  customerType:
    | (Omit<TypeOfValidator<typeof customerTypeValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof customerTypeValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("createdBy" in customerType) {
    return client.from("customerType").insert([customerType]);
  } else {
    return client
      .from("customerType")
      .update(sanitize(customerType))
      .eq("id", customerType.id);
  }
}

export async function updateQuoteFavorite(
  client: SupabaseClient<Database>,
  args: {
    id: string;
    favorite: boolean;
    userId: string;
  }
) {
  const { id, favorite, userId } = args;
  if (!favorite) {
    return client
      .from("quoteFavorite")
      .delete()
      .eq("quoteId", id)
      .eq("userId", userId);
  } else {
    return client.from("quoteFavorite").insert({ quoteId: id, userId: userId });
  }
}

export async function upsertQuote(
  client: SupabaseClient<Database>,
  quote:
    | (Omit<TypeOfValidator<typeof quotationValidator>, "id" | "quoteId"> & {
        quoteId: string;
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof quotationValidator>, "id" | "quoteId"> & {
        id: string;
        quoteId: string;
        updatedBy: string;
      })
) {
  if ("createdBy" in quote) {
    return client.from("quote").insert([quote]).select("id, quoteId");
  } else {
    return client.from("quote").update(sanitize(quote)).eq("id", quote.id);
  }
}

export async function upsertQuoteAssembly(
  client: SupabaseClient<Database>,
  quotationAssembly:
    | (Omit<TypeOfValidator<typeof quotationAssemblyValidator>, "id"> & {
        quoteId: string;
        quoteLineId: string;
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof quotationAssemblyValidator>, "id"> & {
        id: string;
        quoteId: string;
        quoteLineId: string;
        updatedBy: string;
      })
) {
  if ("id" in quotationAssembly) {
    return client
      .from("quoteAssembly")
      .update(sanitize(quotationAssembly))
      .eq("id", quotationAssembly.id)
      .select("id")
      .single();
  }
  return client
    .from("quoteAssembly")
    .insert([quotationAssembly])
    .select("id")
    .single();
}

export async function upsertQuoteLine(
  client: SupabaseClient<Database>,
  quotationLine:
    | (Omit<TypeOfValidator<typeof quotationLineValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof quotationLineValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("id" in quotationLine) {
    return client
      .from("quoteLine")
      .update(sanitize(quotationLine))
      .eq("id", quotationLine.id)
      .select("id")
      .single();
  }
  return client.from("quoteLine").insert([quotationLine]).select("id").single();
}
