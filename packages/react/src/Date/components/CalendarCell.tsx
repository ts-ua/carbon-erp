import type { CalendarDate } from "@internationalized/date";
import { isSameMonth } from "@internationalized/date";
import { useCalendarCell } from "@react-aria/calendar";
import type {
  CalendarState,
  RangeCalendarState,
} from "@react-stately/calendar";
import clsx from "clsx";
import { useRef } from "react";
import { Button } from "~/Button";
import { Td } from "~/Table";

export const CalendarCell = ({
  state,
  date,
  currentMonth,
}: {
  state: CalendarState | RangeCalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isInvalid,
    isDisabled,
    isUnavailable,
    isFocused,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  const isOutsideMonth = !isSameMonth(currentMonth, date);

  return (
    <Td {...cellProps} className="border-none text-center p-1">
      <Button
        {...buttonProps}
        ref={ref}
        className={clsx("w-8 h-8 rounded-full hover:bg-muted", {
          "opacity-50 disabled:cursor-not-allowed": isDisabled,
          "bg-destructive text-destructive-foreground": isInvalid,
          "bg-muted": isFocused,
          "bg-primary text-primary-foreground hover:bg-primary": isSelected,
          "opacity-50 hover:bg-white focus:bg-white":
            isInvalid || isDisabled || isUnavailable,
          hidden: isOutsideMonth,
        })}
        variant={isSelected ? "primary" : "ghost"}
        style={{
          opacity: isOutsideMonth
            ? 0.25
            : isInvalid || isDisabled || isUnavailable
            ? 0.5
            : 1,
        }}
      >
        {formattedDate}
      </Button>
    </Td>
  );
};
