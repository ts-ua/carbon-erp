import { InputGroup, InputRightElement } from "@carbon/react";
import type { DateValue } from "@internationalized/date";
import { useDatePicker } from "@react-aria/datepicker";
import { useDatePickerState } from "@react-stately/datepicker";
import type { DatePickerProps } from "@react-types/datepicker";
import { useRef } from "react";
import { MdOutlineCalendarToday, MdOutlineDoNotDisturb } from "react-icons/md";

import TimeField from "./TimePicker";
import { FieldButton } from "./components/Button";
import { Calendar } from "./components/Calendar";
import DateField from "./components/DateField";
import { Popover } from "./components/Popover";

const DateTimePicker = (props: DatePickerProps<DateValue>) => {
  const state = useDatePickerState({
    ...props,
    shouldCloseOnSelect: false,
  });
  const ref = useRef<HTMLDivElement>(null);
  const { groupProps, fieldProps, buttonProps, dialogProps, calendarProps } =
    useDatePicker(props, state, ref);

  return (
    <div className="relative inline-flex flex-col w-full">
      <InputGroup
        {...groupProps}
        ref={ref}
        width="auto"
        className="w-full inline-flex"
      >
        <div className="flex w-full px-4 py-2">
          <DateField {...fieldProps} />
          {state.isInvalid && (
            <MdOutlineDoNotDisturb className="text-destructive-foreground aboslute right-[12px]" />
          )}
        </div>
        <InputRightElement>
          <FieldButton {...buttonProps} isPressed={state.isOpen}>
            <MdOutlineCalendarToday />
          </FieldButton>
        </InputRightElement>
      </InputGroup>
      {state.isOpen && (
        <Popover
          {...dialogProps}
          isOpen={state.isOpen}
          onClose={() => state.setOpen(false)}
        >
          <Calendar {...calendarProps} />
          <TimeField
            label="Time"
            value={state.timeValue}
            onChange={state.setTimeValue}
          />
        </Popover>
      )}
    </div>
  );
};

export default DateTimePicker;
