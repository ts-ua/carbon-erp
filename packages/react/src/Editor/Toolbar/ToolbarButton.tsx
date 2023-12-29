import type { ReactElement } from "react";
import type { ButtonProps } from "~/Button";
import { IconButton } from "~/IconButton";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/Tooltip";

type ToolbarButtonProps = Omit<ButtonProps, "aria-label"> & {
  label: string;
  icon: ReactElement;
};

const ToolbarButton = ({ label, ...rest }: ToolbarButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton variant="ghost" aria-label={label} {...rest} />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default ToolbarButton;
