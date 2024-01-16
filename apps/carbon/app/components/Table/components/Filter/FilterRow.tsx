import { IconButton, Input, useDebounce } from "@carbon/react";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Select } from "~/components";
import { filterOperatorLabels } from "~/utils/query";

type FilterRowProps = {
  column: string;
  columnAccessors: Record<string, string>;
  operator: string;
  searchValue: string;
  onRemove: () => void;
  onUpdate: (newFilter: string) => void;
};

const FilterRow = ({
  column,
  columnAccessors,
  operator,
  searchValue,
  onRemove,
  onUpdate,
}: FilterRowProps) => {
  const [value, setValue] = useState(searchValue || "");
  const [debouncedQuery] = useDebounce(value, 500);

  useEffect(() => {
    const newFilter = `${column}:${operator}:${debouncedQuery}`;
    onUpdate(newFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const onColumnChange = (value: string) => {
    const newFilter = `${value}:${operator}:${searchValue}`;
    onUpdate(newFilter);
  };

  const onOperatorChange = (value: string) => {
    const newFilter = `${column}:${value}:${searchValue}`;
    onUpdate(newFilter);
  };

  return (
    <div className="grid gap-x-2 grid-cols-[1fr_1fr_1fr_auto]">
      <Select
        size="sm"
        defaultValue={column}
        placeholder="Column"
        onChange={onColumnChange}
        options={Object.entries(columnAccessors).map(([accessor, title]) => ({
          label: title,
          value: accessor,
        }))}
        className="w-[100px]"
      />
      <Select
        size="sm"
        placeholder="Operator"
        defaultValue={operator}
        onChange={onOperatorChange}
        options={filterOperatorLabels.map(({ operator, label }) => ({
          label,
          value: operator,
        }))}
        className="w-[100px]"
      />
      <Input
        defaultValue={searchValue}
        onChange={(e) => setValue(e.target.value)}
        size="sm"
        placeholder="Value"
      />
      <IconButton
        aria-label="Remove filter"
        icon={<IoMdClose />}
        onClick={onRemove}
        variant="ghost"
      />
    </div>
  );
};

export default FilterRow;
