import * as cookie from "cookie";
import type { Mode } from "~/types/validators";

const cookieName = "mode";

export function getMode(request: Request): Mode | null {
  const cookieHeader = request.headers.get("cookie");
  const parsed = cookieHeader
    ? cookie.parse(cookieHeader)[cookieName]
    : "light";
  if (parsed === "light" || parsed === "dark") return parsed;
  return null;
}

export function setMode(Mode: Mode | "system") {
  if (Mode === "system") {
    return cookie.serialize(cookieName, "", { path: "/", maxAge: -1 });
  } else {
    return cookie.serialize(cookieName, Mode, { path: "/", maxAge: 31536000 });
  }
}
