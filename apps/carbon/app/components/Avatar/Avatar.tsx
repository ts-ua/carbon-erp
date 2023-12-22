import type { AvatarProps as AvatarBaseProps } from "@chakra-ui/react";
import { Avatar as AvatarBase, forwardRef } from "@chakra-ui/react";
import { SUPABASE_API_URL } from "~/config/env";

type AvatarProps = AvatarBaseProps & {
  path: string | null;
  bucket?: string;
};

export const Avatar = forwardRef(
  ({ path, bucket = "avatars", ...props }: AvatarProps, ref) => {
    const imagePath = path
      ? `${SUPABASE_API_URL}/storage/v1/object/public/${bucket}/${path}`
      : undefined;

    return <AvatarBase ref={ref} src={imagePath} {...props} />;
  }
);
