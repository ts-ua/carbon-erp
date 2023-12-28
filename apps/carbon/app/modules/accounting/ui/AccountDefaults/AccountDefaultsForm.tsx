import { Button, Heading, HStack, VStack } from "@carbon/react";
import {
  Grid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { AccountListItem } from "~/modules/accounting";
import { defaultAcountValidator } from "~/modules/accounting";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type AccountDefaultsFormProps = {
  balanceSheetAccounts: AccountListItem[];
  incomeStatementAccounts: AccountListItem[];
  initialValues: TypeOfValidator<typeof defaultAcountValidator>;
};

const AccountDefaultsForm = ({
  balanceSheetAccounts,
  incomeStatementAccounts,
  initialValues,
}: AccountDefaultsFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isDisabled = !permissions.can("update", "accounting");

  const incomeStatementAccountOptions = incomeStatementAccounts.map((c) => ({
    value: c.number,
    label: `${c.number} - ${c.name}`,
  }));

  const balanceSheetAccountOptions = balanceSheetAccounts.map((c) => ({
    value: c.number,
    label: `${c.number} - ${c.name}`,
  }));

  return (
    <VStack spacing={0} className="h-full">
      <ValidatedForm
        validator={defaultAcountValidator}
        method="post"
        action={path.to.accountingDefaults}
        defaultValues={initialValues}
        style={{
          width: "100%",
        }}
      >
        <Tabs colorScheme="gray">
          <TabList>
            <Tab>Income Statement</Tab>
            <Tab>Balance Sheet</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={8}>
                <VStack spacing={4}>
                  <Heading
                    size="h4"
                    className="uppercase text-muted-foreground"
                  >
                    Revenue
                  </Heading>
                  <Grid
                    gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr"]}
                    gridColumnGap={8}
                    gridRowGap={4}
                    mb={4}
                    w="full"
                  >
                    <Select
                      name="salesAccount"
                      label="Sales"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="salesDiscountAccount"
                      label="Sales Discounts"
                      options={incomeStatementAccountOptions}
                    />
                  </Grid>
                </VStack>
                <VStack spacing={4}>
                  <Heading
                    size="h4"
                    className="uppercase text-muted-foreground"
                  >
                    Expenses
                  </Heading>
                  <Grid
                    gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr"]}
                    gridColumnGap={8}
                    gridRowGap={4}
                    mb={4}
                    w="full"
                  >
                    <Select
                      name="costOfGoodsSoldAccount"
                      label="Cost of Goods Sold"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="purchaseAccount"
                      label="Purchases"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="directCostAppliedAccount"
                      label="Direct Cost Applied"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="overheadCostAppliedAccount"
                      label="Overhead Cost Applied"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="purchaseVarianceAccount"
                      label="Purchase Variance"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="inventoryAdjustmentVarianceAccount"
                      label="Inventory Adjustment"
                      options={incomeStatementAccountOptions}
                    />

                    <Select
                      name="materialVarianceAccount"
                      label="Material Variance"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="capacityVarianceAccount"
                      label="Capacity Variance"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="overheadAccount"
                      label="Overhead"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="maintenanceAccount"
                      label="Maintenance Expense"
                      options={incomeStatementAccountOptions}
                    />
                  </Grid>
                </VStack>
                <VStack spacing={4}>
                  <Heading
                    size="h4"
                    className="uppercase text-muted-foreground"
                  >
                    Fixed Assets
                  </Heading>
                  <Grid
                    gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr"]}
                    gridColumnGap={8}
                    gridRowGap={4}
                    mb={4}
                    w="full"
                  >
                    <Select
                      name="assetDepreciationExpenseAccount"
                      label="Depreciation Expense"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="assetGainsAndLossesAccount"
                      label="Gains and Losses"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="serviceChargeAccount"
                      label="Service Charges"
                      options={incomeStatementAccountOptions}
                    />
                  </Grid>
                </VStack>
                <VStack spacing={4}>
                  <Heading
                    size="h4"
                    className="uppercase text-muted-foreground"
                  >
                    Interest
                  </Heading>
                  <Grid
                    gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr"]}
                    gridColumnGap={8}
                    gridRowGap={4}
                    mb={4}
                    w="full"
                  >
                    <Select
                      name="interestAccount"
                      label="Interest"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="supplierPaymentDiscountAccount"
                      label="Supplier Payment Discounts"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="customerPaymentDiscountAccount"
                      label="Customer Payment Discounts"
                      options={incomeStatementAccountOptions}
                    />
                    <Select
                      name="roundingAccount"
                      label="Rounding Account"
                      options={incomeStatementAccountOptions}
                    />
                  </Grid>
                </VStack>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={8}>
                <VStack spacing={4}>
                  <Heading
                    size="h4"
                    className="uppercase text-muted-foreground"
                  >
                    Current Assets
                  </Heading>
                  <Grid
                    gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr"]}
                    gridColumnGap={8}
                    gridRowGap={4}
                    mb={4}
                    w="full"
                  >
                    <Select
                      name="inventoryAccount"
                      label="Inventory"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="inventoryInterimAccrualAccount"
                      label="Inventory Interim Accrual"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="workInProgressAccount"
                      label="Work in Progress (WIP)"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="receivablesAccount"
                      label="Receivables"
                      options={balanceSheetAccountOptions}
                    />

                    <Select
                      name="inventoryInvoicedNotReceivedAccount"
                      label="Inventory Invoiced Not Received"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="bankCashAccount"
                      label="Bank - Cash"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="bankLocalCurrencyAccount"
                      label="Bank - Local Currency"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="bankForeignCurrencyAccount"
                      label="Bank - Foreign Currency"
                      options={balanceSheetAccountOptions}
                    />
                  </Grid>
                </VStack>
                <VStack spacing={4}>
                  <Heading
                    size="h4"
                    className="uppercase text-muted-foreground"
                  >
                    Fixed Assets
                  </Heading>
                  <Grid
                    gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr"]}
                    gridColumnGap={8}
                    gridRowGap={4}
                    mb={4}
                    w="full"
                  >
                    <Select
                      name="assetAquisitionCostAccount"
                      label="Asset Aquisition Cost"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="assetAquisitionCostOnDisposalAccount"
                      label="Asset Cost on Disposal"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="accumulatedDepreciationAccount"
                      label="Accumulated Depreciation"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="accumulatedDepreciationOnDisposalAccount"
                      label="Accumulated Depreciation on Disposal"
                      options={balanceSheetAccountOptions}
                    />
                  </Grid>
                </VStack>
                <VStack spacing={4}>
                  <Heading
                    size="h4"
                    className="uppercase text-muted-foreground"
                  >
                    Liabilities
                  </Heading>
                  <Grid
                    gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr"]}
                    gridColumnGap={8}
                    gridRowGap={4}
                    mb={4}
                    w="full"
                  >
                    <Select
                      name="prepaymentAccount"
                      label="Prepayments"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="payablesAccount"
                      label="Payables"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="inventoryReceivedNotInvoicedAccount"
                      label="Inventory Received Not Invoiced"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="inventoryShippedNotInvoicedAccount"
                      label="Inventory Shipped Not Invoiced"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="salesTaxPayableAccount"
                      label="Sales Tax Payable"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="purchaseTaxPayableAccount"
                      label="Purchase Tax Payable"
                      options={balanceSheetAccountOptions}
                    />
                    <Select
                      name="reverseChargeSalesTaxPayableAccount"
                      label="Reverse Charge Sales Tax"
                      options={balanceSheetAccountOptions}
                    />
                  </Grid>
                </VStack>
                <VStack spacing={4}>
                  <Heading
                    size="h4"
                    className="uppercase text-muted-foreground"
                  >
                    Equity
                  </Heading>
                  <Grid
                    gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr"]}
                    gridColumnGap={8}
                    gridRowGap={4}
                    w="full"
                  >
                    <Select
                      name="retainedEarningsAccount"
                      label="Retained Earnings"
                      options={balanceSheetAccountOptions}
                    />
                  </Grid>
                </VStack>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <HStack>
          <Submit isDisabled={isDisabled}>Save</Submit>
          <Button size="md" variant="solid" onClick={onClose}>
            Cancel
          </Button>
        </HStack>
      </ValidatedForm>
    </VStack>
  );
};

export default AccountDefaultsForm;
