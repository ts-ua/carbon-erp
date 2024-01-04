import { Button, DatePicker, HStack } from "@carbon/react";
import {
  Grid,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { parseDate } from "@internationalized/date";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { MdCalendarMonth, MdClose } from "react-icons/md";
import { Select } from "~/components";
import { TableFilters } from "~/components/Layout";
import { usePermissions, useUrlParams } from "~/hooks";
import { incomeBalanceTypes } from "~/modules/accounting";

const ChartOfAccountsTableFilters = () => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const startDate = params.get("startDate");
  const endDate = params.get("endDate");

  const incomeBalanceOptions = incomeBalanceTypes.map((type) => ({
    label: type,
    value: type,
  }));

  return (
    <TableFilters>
      <HStack>
        <Select
          value={params.get("incomeBalance") ?? ""}
          placeholder="Income/Balance Sheet"
          options={incomeBalanceOptions}
          size="sm"
          isClearable
          onChange={(newValue) => setParams({ incomeBalance: newValue })}
        />
        <Popover placement="bottom" closeOnBlur>
          <PopoverTrigger>
            <Button variant="solid" leftIcon={<MdCalendarMonth />}>
              Date Range
            </Button>
          </PopoverTrigger>
          <PopoverContent w={360} boxShadow="xl">
            <PopoverHeader>
              <p className="text-sm">Edit date range</p>
              <p className="text-xs text-muted-foreground">
                Select date range to filter net change and balance at date
              </p>
            </PopoverHeader>
            <PopoverArrow />
            <PopoverBody maxH="50vh">
              <Grid
                gridTemplateColumns={"1fr 3fr"}
                gridRowGap={2}
                alignItems="center"
              >
                <p className="text-sm text-muted-foreground">Start Date</p>
                <DatePicker
                  value={startDate ? parseDate(startDate) : null}
                  onChange={(value) =>
                    setParams({ startDate: value.toString() })
                  }
                />
                <p className="text-sm text-muted-foreground">End Date</p>
                <DatePicker
                  value={endDate ? parseDate(endDate) : null}
                  onChange={(value) => setParams({ endDate: value.toString() })}
                />
              </Grid>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        {[...params.entries()].length > 0 && (
          <Button
            variant="solid"
            rightIcon={<MdClose />}
            onClick={() =>
              setParams({
                incomeBalance: undefined,
                startDate: undefined,
                endDate: undefined,
              })
            }
          >
            Reset
          </Button>
        )}
      </HStack>
      <HStack>
        {permissions.can("create", "accounting") && (
          <Button asChild leftIcon={<IoMdAdd />}>
            <Link to={`new?${params.toString()}`}>New Account</Link>
          </Button>
        )}
      </HStack>
    </TableFilters>
  );
};

export default ChartOfAccountsTableFilters;
