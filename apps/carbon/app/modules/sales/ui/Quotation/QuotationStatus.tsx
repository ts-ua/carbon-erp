import { Status } from "@carbon/react";
import type { quoteStatusType } from "~/modules/sales";

type QuotationStatusProps = {
  status?: (typeof quoteStatusType)[number] | null;
};

const QuotationStatus = ({ status }: QuotationStatusProps) => {
  switch (status) {
    case "Draft":
      return <Status color="gray">{status}</Status>;
    case "Open":
    case "Replied":
      return <Status color="orange">{status}</Status>;
    case "Ordered":
    case "Partially Ordered":
      return <Status color="green">{status}</Status>;
    case "Lost":
    case "Cancelled":
    case "Expired":
      return <Status color="red">{status}</Status>;
    default:
      return null;
  }
};

export default QuotationStatus;
