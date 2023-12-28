import {
  Box,
  Icon,
  InputGroup,
  InputRightElement,
  useOutsideClick,
} from "@chakra-ui/react";
import type { CalendarDate } from "@internationalized/date";
import { useDatePicker } from "@react-aria/datepicker";
import { useDatePickerState } from "@react-stately/datepicker";
import type { DatePickerProps } from "@react-types/datepicker";
import { useRef } from "react";
import { MdOutlineCalendarToday, MdOutlineDoNotDisturb } from "react-icons/md";

import { FieldButton } from "./components/Button";
import { Calendar } from "./components/Calendar";
import DateField from "./components/DateField";
import { Popover } from "./components/Popover";
import { StyledField } from "./components/StyledField";

const DatePicker = (props: DatePickerProps<CalendarDate>) => {
  const state = useDatePickerState({
    ...props,
    shouldCloseOnSelect: false,
  });
  const ref = useRef<HTMLDivElement>(null);
  const { groupProps, fieldProps, buttonProps, dialogProps, calendarProps } =
    useDatePicker(props, state, ref);

  useOutsideClick({
    ref,
    handler: () => state.setOpen(false),
  });

  return (
    <Box
      position="relative"
      display="inline-flex"
      flexDirection="column"
      w="full"
    >
      <InputGroup
        {...groupProps}
        ref={ref}
        width="auto"
        display="inline-flex"
        w="full"
      >
        <StyledField pr="4.5rem">
          <DateField {...fieldProps} />
          {state.validationState === "invalid" && (
            <Icon
              as={MdOutlineDoNotDisturb}
              color="red.600"
              position="absolute"
              right="12"
            />
          )}
        </StyledField>
        <InputRightElement>
          <FieldButton {...buttonProps} isPressed={state.isOpen}>
            <Icon as={MdOutlineCalendarToday} />
          </FieldButton>
        </InputRightElement>
      </InputGroup>
      {state.isOpen && (
        <Popover {...dialogProps} onClose={() => state.setOpen(false)}>
          <Calendar {...calendarProps} />
        </Popover>
      )}
    </Box>
  );
};

export default DatePicker;