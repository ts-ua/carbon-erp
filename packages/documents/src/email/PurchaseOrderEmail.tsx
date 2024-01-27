import { Head, Heading, Html, Preview } from "@react-email/components";
import type { Email } from "../types";
import { EmailBody } from "./components";

interface PurchaseOrderEmailProps extends Email {
  purchaseOrder: {
    id: string;
  };
}

const PurchaseOrderEmail = ({
  company,
  purchaseOrder,
  recipient,
  sender,
}: PurchaseOrderEmailProps) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>{`${purchaseOrder.id} from ${company.name}`}</Preview>
      <EmailBody>
        <Heading className="text-2xl font-normal text-center p-0 mt-4 mb-8 mx-0">
          <span className="font-bold tracking-tighter">{`${company.name}`}</span>
        </Heading>
        <Heading className="text-lg font-seminbold text-center p-0 mt-4 mb-8 mx-0">
          {`Purchase Order ${purchaseOrder.id}`}
        </Heading>
      </EmailBody>
    </Html>
  );
};

export default PurchaseOrderEmail;
