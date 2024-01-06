import { useFetcher } from "@remix-run/react";
import { useMemo } from "react";
import { path } from "~/utils/path";

import { useMount } from "@carbon/react";
import type { getSequencesList } from "~/modules/settings";
import type { SelectProps } from "./Select";
import Select from "./Select";

type SequenceSelectProps = Omit<SelectProps, "options"> & {
  table: string;
};

const Sequence = (props: SequenceSelectProps) => {
  const sequenceFetcher =
    useFetcher<Awaited<ReturnType<typeof getSequencesList>>>();

  useMount(() => {
    sequenceFetcher.load(path.to.api.sequences(props.table));
  });

  const options = useMemo(
    () =>
      sequenceFetcher.data?.data
        ? sequenceFetcher.data?.data.map((c) => ({
            value: c.id,
            label: c.id,
          }))
        : [],
    [sequenceFetcher.data]
  );

  return (
    <Select options={options} {...props} label={props?.label ?? "Sequence"} />
  );
};

export default Sequence;
