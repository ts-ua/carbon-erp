import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import type {
  SupplierContact as SupplierContactType,
  getSupplierContacts,
} from "~/modules/purchasing";
import { path } from "~/utils/path";

import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

type SupplierContactSelectProps = Omit<
  ComboboxProps,
  "options" | "onChange"
> & {
  supplier?: string;
  onChange?: (supplier: SupplierContactType | null) => void;
};

const SupplierContact = (props: SupplierContactSelectProps) => {
  const supplierContactsFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierContacts>>>();

  useEffect(() => {
    if (props?.supplier) {
      supplierContactsFetcher.load(
        path.to.api.supplierContacts(props.supplier)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.supplier]);

  const options = useMemo(
    () =>
      supplierContactsFetcher.data?.data?.map((c) => ({
        value: c.id,
        label: `${c.contact?.firstName} ${c.contact?.lastName}`,
      })) ?? [],

    [supplierContactsFetcher.data]
  );

  const onChange = (newValue: { label: string; value: string } | null) => {
    const contact =
      supplierContactsFetcher.data?.data?.find(
        (contact) => contact.id === newValue?.value
      ) ?? null;

    props.onChange?.(contact as SupplierContactType | null);
  };

  return (
    <Combobox
      options={options}
      {...props}
      onChange={onChange}
      label={props?.label ?? "Supplier Contact"}
    />
  );
};

export default SupplierContact;
