import { Body, Container, Tailwind } from "@react-email/components";
import type { PropsWithChildren } from "react";

const EmailBody = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Tailwind>
      <Body className="bg-white my-auto mx-auto font-sans">
        <Container className="my-10 mx-auto p-5 w-[465px]">
          {children}
        </Container>
      </Body>
    </Tailwind>
  );
};

export default EmailBody;
