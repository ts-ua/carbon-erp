import { useOutsideClick } from "@chakra-ui/react";
import { useRef } from "react";
import { useEscape } from "../../hooks";

export function Popover(props: any) {
  const ref = useRef();
  const { popoverRef = ref, onClose, children, ...rest } = props;

  useEscape(onClose);
  useOutsideClick({
    ref: popoverRef,
    handler: onClose,
  });

  return (
    <div
      {...rest}
      className="absolute rounded-md z-[10] top-[100%] shadow-lg mt-1 p-6 outline-none bg-popover"
    >
      {children}
    </div>
  );
}
