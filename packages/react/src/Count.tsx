import type { ComponentProps } from "react";
export interface CountProps extends ComponentProps<"div"> {
  count: number;
}

const Count = ({ count, ...props }: CountProps) => {
  const c = count > 99 ? "99+" : count;
  return (
    <div
      className="bg-primary text-primary-foreground rounded-full text-xs h-5 min-w-[1.25rem] flex items-center justify-center"
      {...props}
    >{`${c}`}</div>
  );
};

export { Count };
