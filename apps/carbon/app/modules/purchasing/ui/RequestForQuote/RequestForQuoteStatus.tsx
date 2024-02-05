import { Status } from "@carbon/react";
import type { requestForQuoteStatusType } from "~/modules/purchasing";

type RequestForQuoteStatusProps = {
  status?: (typeof requestForQuoteStatusType)[number] | null;
};

const RequestForQuoteStatus = ({ status }: RequestForQuoteStatusProps) => {
  switch (status) {
    case "Draft":
      return <Status color="gray">{status}</Status>;
    case "Sent":
      return <Status color="orange">{status}</Status>;
    case "Closed":
      return <Status color="green">{status}</Status>;
    case "Expired":
      return <Status color="red">{status}</Status>;
    default:
      return null;
  }
};

export default RequestForQuoteStatus;
