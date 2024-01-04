import type { AvatarProps as AvatarBaseProps } from "@chakra-ui/react";
import { Avatar as AvatarBase, forwardRef } from "@chakra-ui/react";
import { getStoragePath } from "~/utils/path";

type AvatarProps = AvatarBaseProps & {
  path: string | null;
  bucket?: string;
};

const Avatar = forwardRef(
  ({ path, bucket = "avatars", ...props }: AvatarProps, ref) => {
    const imagePath = path ? getStoragePath(bucket, path) : undefined;

    return <AvatarBase ref={ref} src={imagePath} {...props} />;
  }
);

export default Avatar;
