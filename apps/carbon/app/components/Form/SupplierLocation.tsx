import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import type {
  SupplierLocation as SupplierLocationType,
  getSupplierLocations,
} from "~/modules/purchasing";
import { path } from "~/utils/path";

import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

type SupplierLocationSelectProps = Omit<
  ComboboxProps,
  "options" | "onChange"
> & {
  supplier?: string;
  onChange?: (supplier: SupplierLocationType | null) => void;
};

const SupplierLocation = (props: SupplierLocationSelectProps) => {
  const supplierLocationsFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierLocations>>>();

  useEffect(() => {
    if (props?.supplier) {
      supplierLocationsFetcher.load(
        path.to.api.supplierLocations(props.supplier)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.supplier]);

  const options = useMemo(
    () =>
      supplierLocationsFetcher.data?.data?.map((c) => ({
        value: c.id,
        label: `${c.address?.addressLine1} ${c.address?.city}, ${c.address?.state}`,
      })) ?? [],

    [supplierLocationsFetcher.data]
  );

  const onChange = (newValue: { label: string; value: string } | null) => {
    const location =
      supplierLocationsFetcher.data?.data?.find(
        (location) => location.id === newValue?.value
      ) ?? null;

    props.onChange?.(location as SupplierLocationType | null);
  };

  return (
    <Combobox
      options={options}
      {...props}
      onChange={onChange}
      label={props?.label ?? "Supplier Location"}
    />
  );
};

export default SupplierLocation;
