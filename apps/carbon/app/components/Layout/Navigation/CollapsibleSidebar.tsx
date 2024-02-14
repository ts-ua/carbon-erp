import {
  IconButton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDisclosure,
} from "@carbon/react";
import { motion } from "framer-motion";
import { useMemo, type PropsWithChildren } from "react";
import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";

export const CollapsibleSidebar = ({
  children,
  width = 180,
}: PropsWithChildren<{ width?: number }>) => {
  const sidebar = useDisclosure({
    defaultIsOpen: true,
  });

  const variants = useMemo(() => {
    return {
      visible: {
        width,
      },
      hidden: {
        width: 4,
      },
    };
  }, [width]);

  return (
    <TooltipProvider>
      <motion.div
        animate={sidebar.isOpen ? "visible" : "hidden"}
        initial={variants.visible}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        variants={variants}
        className="bg-popover text-popover-foreground border-r border-border h-full min-h-[calc(100vh-50px)] sticky top-50 z-[3]"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton
              onClick={sidebar.onToggle}
              icon={sidebar.isOpen ? <TbArrowBarLeft /> : <TbArrowBarRight />}
              aria-label="Toggle sidebar"
              className="bg-popover inline-block border border-border border-l-0 absolute pl-2 top-[calc(100vh-135px)] text-muted-foreground right-[-32px] left-auto rounded-l-none z-[3] hover:bg-popover p-0"
            />
          </TooltipTrigger>

          <TooltipContent side="right">
            {<span>{sidebar.isOpen ? "Collapse" : "Expand"}</span>}
          </TooltipContent>
        </Tooltip>

        {sidebar.isOpen ? children : null}
      </motion.div>
    </TooltipProvider>
  );
};
