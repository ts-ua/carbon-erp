import { Heading, VStack } from "@carbon/react";
import type { PropsWithChildren } from "react";

type SectionTitleProps = PropsWithChildren<{
  subtitle?: string;
}>;

const SectionTitle = ({ children, subtitle, ...props }: SectionTitleProps) => {
  return (
    <VStack spacing={2} className="mb4" {...props}>
      <Heading size="h2">{children}</Heading>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </VStack>
  );
};

export default SectionTitle;
