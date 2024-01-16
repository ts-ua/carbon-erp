import { useMount } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useMemo } from "react";
import type { getLocationsList } from "~/modules/resources";
import { path } from "~/utils/path";
import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

type LocationSelectProps = Omit<ComboboxProps, "options">;

const Location = (props: LocationSelectProps) => {
  const locationFetcher =
    useFetcher<Awaited<ReturnType<typeof getLocationsList>>>();

  useMount(() => {
    locationFetcher.load(path.to.api.locations);
  });

  const options = useMemo(
    () =>
      locationFetcher.data?.data
        ? locationFetcher.data?.data.map((c) => ({
            value: c.id,
            label: c.name,
          }))
        : [],
    [locationFetcher.data]
  );

  return (
    <Combobox options={options} {...props} label={props?.label ?? "Location"} />
  );
};

Location.displayName = "Location";

export default Location;
