import type { IconButtonProps } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/Tooltip";

type ToolbarButtonProps = Omit<IconButtonProps, "aria-label"> & {
  label: string;
};

const ToolbarButton = ({ label, ...rest }: ToolbarButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="gray"
          aria-label={label}
          {...rest}
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default ToolbarButton;
