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
    <div className="flex w-auto">
      <input
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
    </div>
  );
};

export { File };
