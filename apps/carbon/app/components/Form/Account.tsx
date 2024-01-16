import { useMount } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useMemo } from "react";
import type { AccountClass, getAccountsList } from "~/modules/accounting";
import { path } from "~/utils/path";
import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

type AccountSelectProps = Omit<ComboboxProps, "options"> & {
  classes?: AccountClass[];
};

const Account = ({ classes, ...props }: AccountSelectProps) => {
  const accountFetcher =
    useFetcher<Awaited<ReturnType<typeof getAccountsList>>>();

  useMount(() => {
    let classQueryParamas = classes?.map((c) => `class=${c}`).join("&") ?? "";
    accountFetcher.load(
      `${path.to.api.accounts}?type=Posting&${classQueryParamas}`
    );
  });

  const options = useMemo(
    () =>
      accountFetcher.data?.data
        ? accountFetcher.data?.data.map((c) => ({
            value: c.number,
            label: `${c.number} - ${c.name}`,
          }))
        : [],
    [accountFetcher.data]
  );

  return (
    <Combobox options={options} {...props} label={props?.label ?? "Account"} />
  );
};

Account.displayName = "Account";

export default Account;
