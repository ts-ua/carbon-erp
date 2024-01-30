import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import type { Email } from "../types";

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
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="px-5 py-8 max-w-[100%] w-[660px]">
            <Heading className="text-2xl font-normal text-center p-0 mt-4 mb-8 mx-0">
              <span className="font-bold tracking-tighter">{`${company.name}`}</span>
            </Heading>
            <Heading className="text-lg font-seminbold text-center p-0 mt-4 mb-8 mx-0">
              {`Purchase Order ${purchaseOrder.id}`}
            </Heading>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PurchaseOrderEmail;
