import { Box, Icon } from "@chakra-ui/react";
import type { DateValue } from "@internationalized/date";
import { createCalendar } from "@internationalized/date";
import type { RangeCalendarProps } from "@react-aria/calendar";
import { useRangeCalendar } from "@react-aria/calendar";
import { useLocale } from "@react-aria/i18n";
import { useRangeCalendarState } from "@react-stately/calendar";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Heading } from "~/Heading";

import { CalendarButton } from "./Button";
import { CalendarGrid } from "./CalendarGrid";

export function RangeCalendar(props: RangeCalendarProps<DateValue>) {
  const { locale } = useLocale();
  const state = useRangeCalendarState({
    ...props,
    visibleDuration: { months: 2 },
    locale,
    createCalendar,
  });

  const ref = useRef<HTMLDivElement>(null);
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useRangeCalendar(props, state, ref);

  return (
    <div {...calendarProps} ref={ref}>
      <Box display="flex" alignItems="center" paddingBottom="4">
        <CalendarButton {...prevButtonProps}>
          <Icon as={FaAngleLeft} w={6} h={6} />
        </CalendarButton>
        <Heading as="h2" size="h3" className="flex-1 text-center">
          {title}
        </Heading>
        <CalendarButton {...nextButtonProps}>
          <Icon as={FaAngleRight} w={6} h={6} />
        </CalendarButton>
      </Box>
      <Box display="flex" gap="8">
        <CalendarGrid state={state} />
        <CalendarGrid state={state} offset={{ months: 1 }} />
      </Box>
    </div>
  );
}
