import { InputGroup, InputRightElement } from "@carbon/react";
import { useDateRangePicker } from "@react-aria/datepicker";
import { useDateRangePickerState } from "@react-stately/datepicker";
import type { DateRangePickerProps, DateValue } from "@react-types/datepicker";
import { useRef } from "react";
import { MdCalendarToday, MdOutlineDoNotDisturb } from "react-icons/md";
import TimeField from "./TimePicker";
import { FieldButton } from "./components/Button";
import DateField from "./components/DateField";
import { Popover } from "./components/Popover";
import { RangeCalendar } from "./components/RangeCalendar";

const DateRangePicker = (props: DateRangePickerProps<DateValue>) => {
  const state = useDateRangePickerState({
    ...props,
    shouldCloseOnSelect: false,
  });
  const ref = useRef<HTMLDivElement>(null);
  const {
    groupProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDateRangePicker(props, state, ref);

  return (
    <div className="relative inline-flex flex-col w-full">
      <InputGroup {...groupProps} ref={ref} className="w-full inline-flex">
        <div className="flex w-auto px-4 py-2">
          <DateField {...startFieldProps} />
          <span aria-hidden="true" className="px-2">
            –
          </span>
          <DateField {...endFieldProps} />
          {state.isInvalid && (
            <MdOutlineDoNotDisturb className="text-destructive-foreground aboslute right-[12px]" />
          )}
        </div>
        <InputRightElement>
          <FieldButton {...buttonProps} isPressed={state.isOpen}>
            <MdCalendarToday />
          </FieldButton>
        </InputRightElement>
      </InputGroup>
      {state.isOpen && (
        <Popover
          {...dialogProps}
          isOpen={state.isOpen}
          onClose={() => state.setOpen(false)}
        >
          <RangeCalendar {...calendarProps} />
          <div className="flex gap-2">
            <TimeField
              label="Start time"
              value={state.timeRange?.start || null}
              onChange={(v) => state.setTime("start", v)}
            />
            <TimeField
              label="End time"
              value={state.timeRange?.end || null}
              onChange={(v) => state.setTime("end", v)}
            />
          </div>
        </Popover>
      )}
    </div>
  );
};

export default DateRangePicker;
