import { useMemo } from "react";
import { useCustomers } from "~/stores";
import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

type CustomerSelectProps = Omit<ComboboxProps, "options">;

const Customer = (props: CustomerSelectProps) => {
  const [customers] = useCustomers();

  const options = useMemo(
    () =>
      customers.map((c) => ({
        value: c.id,
        label: c.name,
      })) ?? [],
    [customers]
  );

  return (
    <Combobox options={options} {...props} label={props?.label ?? "Customer"} />
  );
};

Customer.displayName = "Customer";

export default Customer;
