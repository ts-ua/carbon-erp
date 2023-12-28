import { Heading, VStack } from "@carbon/react";

type PageTitleProps = {
  title: string;
  subtitle?: string;
};

const PageTitle = ({ title, subtitle }: PageTitleProps) => {
  return (
    <VStack className="mb-4">
      <Heading size="h1">{title}</Heading>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </VStack>
  );
};

export default PageTitle;
