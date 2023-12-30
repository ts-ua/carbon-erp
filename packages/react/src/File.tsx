import { Input, InputGroup } from "@chakra-ui/react";
import type { ChangeEvent, ComponentPropsWithoutRef } from "react";
import { useRef } from "react";
import { Button } from "~/Button";

type FileProps = ComponentPropsWithoutRef<"div"> & {
  accept?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
};

const File = ({ accept, className, children, onChange }: FileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <InputGroup w="auto">
      <Input
        ref={fileInputRef}
        type="file"
        hidden
        accept={accept}
        onChange={onChange}
      />
      <Button
        className={className}
        onClick={() => {
          if (fileInputRef.current) fileInputRef.current.click();
        }}
      >
        {children}
      </Button>
    </InputGroup>
  );
};

export { File };
