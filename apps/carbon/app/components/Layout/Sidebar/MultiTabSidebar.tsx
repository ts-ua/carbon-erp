import { VStack, useDisclosure, useOutsideClick } from "@carbon/react";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { useRef, useState } from "react";

type MultiTabSidebarNode = {
  id: string;
  icon: ReactElement;
  label: string;
  component: ReactElement | null;
};

type MultiTabSidebarProps = {
  canCollapse?: boolean;
  defaultIsOpen?: boolean;
  hideOnClickOutside?: boolean;
  nodes: MultiTabSidebarNode[];
};

const MultiTabSidebar = ({
  nodes,
  canCollapse = true,
  defaultIsOpen = false,
  hideOnClickOutside = false,
}: MultiTabSidebarProps) => {
  const [activeNode, setActiveNode] = useState<string | null>(
    defaultIsOpen || !canCollapse ? nodes?.[0].id ?? null : null
  );

  const sidebar = useDisclosure({
    defaultIsOpen,
  });

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: ref,
    handler: () => {
      if (hideOnClickOutside) sidebar.onClose();
    },
  });

  const getActiveNode = () => {
    if (activeNode === null) return null;
    const node = nodes.find((n) => n.id === activeNode);
    return node?.component;
  };

  const onIconClick = (id: string) => {
    if (activeNode === id && canCollapse) {
      setActiveNode(null);
      sidebar.onClose();
    } else {
      setActiveNode(id);
      if (!sidebar.isOpen) sidebar.onOpen();
    }
  };

  return (
    <>
      <motion.div
        animate={!sidebar.isOpen ? "hidden" : "visible"}
        initial={
          defaultIsOpen
            ? {
                position: "relative",
                x: "0%",
                left: "48px",
              }
            : {
                position: "fixed",
                x: "-100%",
                left: "-100%",
              }
        }
        variants={{
          visible: {
            position: "absolute",
            x: "0%",
            z: "0px",
            left: "48px",
          },
          hidden: {
            position: "relative",
            x: "-100%",
            z: "0px",
            left: "0",
          },
        }}
        transition={{
          duration: 0.5,
        }}
        ref={ref}
        className="h-full w-[20rem] bg-background border-r border-border "
      >
        <VStack className="h-full">
          <div className="p-2 pb-8 overflow-y-auto w-full h-full">
            {/* TODO: persist state between changes */}
            {getActiveNode()}
          </div>
        </VStack>
      </motion.div>

      <div className="absolute h-full bg-background border-r border-border ">
        <VStack spacing={0}>
          {nodes.map((node) => (
            <Tooltip key={node.id} label={node.label} placement="right">
              <IconButton
                onClick={() => onIconClick(node.id)}
                variant={node.id === activeNode ? "solid" : "outline"}
                colorScheme="gray"
                size="lg"
                borderRadius={0}
                border="none"
                aria-label={node.label}
                icon={node.icon}
              />
            </Tooltip>
          ))}
        </VStack>
      </div>
    </>
  );
};

export default MultiTabSidebar;
