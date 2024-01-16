import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import type {
  CustomerLocation as CustomerLocationType,
  getCustomerLocations,
} from "~/modules/sales";
import { path } from "~/utils/path";

import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

type CustomerLocationSelectProps = Omit<
  ComboboxProps,
  "options" | "onChange"
> & {
  customer?: string;
  onChange?: (customer: CustomerLocationType | null) => void;
};

const CustomerLocation = (props: CustomerLocationSelectProps) => {
  const customerLocationsFetcher =
    useFetcher<Awaited<ReturnType<typeof getCustomerLocations>>>();

  useEffect(() => {
    if (props?.customer) {
      customerLocationsFetcher.load(
        path.to.api.customerLocations(props.customer)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.customer]);

  const options = useMemo(
    () =>
      customerLocationsFetcher.data?.data?.map((c) => ({
        value: c.id,
        label: `${c.address?.addressLine1} ${c.address?.city}, ${c.address?.state}`,
      })) ?? [],

    [customerLocationsFetcher.data]
  );

  const onChange = (newValue: { label: string; value: string } | null) => {
    const location =
      customerLocationsFetcher.data?.data?.find(
        (location) => location.id === newValue?.value
      ) ?? null;

    props.onChange?.(location as CustomerLocationType | null);
  };

  return (
    <Combobox
      options={options}
      {...props}
      onChange={onChange}
      label={props?.label ?? "Customer Location"}
    />
  );
};

export default CustomerLocation;
