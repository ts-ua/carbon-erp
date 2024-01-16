import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import type {
  CustomerContact as CustomerContactType,
  getCustomerContacts,
} from "~/modules/sales";
import { path } from "~/utils/path";

import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

type CustomerContactSelectProps = Omit<
  ComboboxProps,
  "options" | "onChange"
> & {
  customer?: string;
  onChange?: (customer: CustomerContactType["contact"] | null) => void;
};

const CustomerContact = (props: CustomerContactSelectProps) => {
  const customerContactsFetcher =
    useFetcher<Awaited<ReturnType<typeof getCustomerContacts>>>();

  useEffect(() => {
    if (props?.customer) {
      customerContactsFetcher.load(
        path.to.api.customerContacts(props.customer)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.customer]);

  const options = useMemo(
    () =>
      customerContactsFetcher.data?.data?.map((c) => ({
        value: c.id,
        label: `${c.contact?.firstName} ${c.contact?.lastName}`,
      })) ?? [],

    [customerContactsFetcher.data]
  );

  const onChange = (newValue: { label: string; value: string } | null) => {
    const contact =
      customerContactsFetcher.data?.data?.find(
        (contact) => contact.id === newValue?.value
      ) ?? null;

    props.onChange?.(contact?.contact ?? null);
  };

  return (
    <Combobox
      options={options}
      {...props}
      onChange={onChange}
      label={props?.label ?? "Customer Contact"}
    />
  );
};

export default CustomerContact;
