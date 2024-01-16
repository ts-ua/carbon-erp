import type { InputProps } from "@carbon/react";
import { Input, useDebounce } from "@carbon/react";
import { useEffect, useRef, useState } from "react";
import { useUrlParams } from "~/hooks";

type DebounceInputProps = InputProps & {
  param: string;
};

const DebouncedInput = ({ param, ...props }: DebounceInputProps) => {
  const initialLoad = useRef(true);
  const [params, setParams] = useUrlParams();
  const [query, setQuery] = useState(params.get(param) || "");
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
    } else {
      setParams({ [param]: debouncedQuery });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <Input
      defaultValue={params.get(param) || ""}
      onChange={(e) => setQuery(e.target.value)}
      {...props}
    />
  );
};

export default DebouncedInput;
