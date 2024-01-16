import { useMemo } from "react";
import { useSuppliers } from "~/stores";
import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

type SupplierSelectProps = Omit<ComboboxProps, "options">;

const Supplier = (props: SupplierSelectProps) => {
  const [suppliers] = useSuppliers();

  const options = useMemo(
    () =>
      suppliers.map((c) => ({
        value: c.id,
        label: c.name,
      })) ?? [],
    [suppliers]
  );

  return (
    <Combobox options={options} {...props} label={props?.label ?? "Supplier"} />
  );
};

Supplier.displayName = "Supplier";

export default Supplier;
