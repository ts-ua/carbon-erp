import type { ComponentProps } from "react";
export interface CountProps extends ComponentProps<"div"> {
  count: number;
}

const Count = ({ count, ...props }: CountProps) => {
  const c = count > 99 ? "99+" : count;
  return (
    <div
      className="text-foreground font-mono font-semibold text-sm flex items-center justify-center"
      {...props}
    >{`${c}`}</div>
  );
};

export { Count };
