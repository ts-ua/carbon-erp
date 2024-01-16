import type { ComponentProps } from "react";
import { RxDotFilled } from "react-icons/rx";
import { cn } from "~/utils/cn";
import { Badge } from "./Badge";

type StatusProps = ComponentProps<"div"> & {
  color?: "green" | "orange" | "red" | "yellow" | "blue" | "gray";
};

const Status = ({
  color = "gray",
  children,
  className,
  ...props
}: StatusProps) => {
  return (
    <Badge variant={color} className={cn("pl-1.5", className)} {...props}>
      <RxDotFilled className="w-5 h-5 mr-1" />
      {children}
    </Badge>
  );
};

export { Status };
