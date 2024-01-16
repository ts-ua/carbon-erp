import { useMount } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useMemo } from "react";
import type { ServiceType, getServicesList } from "~/modules/parts";
import { path } from "~/utils/path";
import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

type ServiceSelectProps = Omit<ComboboxProps, "options"> & {
  serviceType?: ServiceType;
};

const Service = ({ serviceType, ...props }: ServiceSelectProps) => {
  const servicesFetcher =
    useFetcher<Awaited<ReturnType<typeof getServicesList>>>();

  useMount(() => {
    const typeQueryParams = serviceType ? `type=${serviceType}` : "";
    servicesFetcher.load(`${path.to.api.services}?${typeQueryParams}`);
  });

  const options = useMemo(
    () =>
      servicesFetcher.data?.data
        ? servicesFetcher.data?.data.map((s) => ({
            value: s.id,
            label: `${s.id} - ${s.name}`,
          }))
        : [],
    [servicesFetcher.data]
  );

  return (
    <Combobox options={options} {...props} label={props?.label ?? "Service"} />
  );
};

Service.displayName = "Service";

export default Service;
