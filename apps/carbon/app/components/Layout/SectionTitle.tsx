import { Heading, VStack } from "@carbon/react";
import type { PropsWithChildren } from "react";

type SectionTitleProps = PropsWithChildren<{
  subtitle?: string;
}>;

const SectionTitle = ({ children, subtitle, ...props }: SectionTitleProps) => {
  return (
    <VStack className="mb4" {...props}>
      <Heading size="h3" className="font-light">
        {children}
      </Heading>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </VStack>
  );
};

export default SectionTitle;
