import { Td as TdBase, Th as ThBase, Tr as TrBase } from "@carbon/react";
import { motion } from "framer-motion";

export const spring = {
  type: "spring",
  damping: 10,
  stiffness: 30,
};

export const Th = motion(ThBase);
export const Tr = motion(TrBase);
export const Td = motion(TdBase);
