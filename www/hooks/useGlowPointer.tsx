import { useCallback, useEffect } from "react";

export function useGlowPointer() {
  const update = useCallback(({ x, y }) => {
    document.body.style.setProperty("--x", x.toFixed(2));
    document.body.style.setProperty("--xp", (x / window.innerWidth).toFixed(2));
    document.body.style.setProperty("--y", y.toFixed(2));
    document.body.style.setProperty(
      "--yp",
      (y / window.innerHeight).toFixed(2)
    );
  }, []);

  useEffect(() => {
    if (window.usingGlowPointer) return;
    window.usingGlowPointer = true;
    document.body.addEventListener("pointermove", update);
    document.body.style.setProperty("--base", "0");
    document.body.style.setProperty("--spread", "360");
    return () => {
      window.usingGlowPointer = false;
      document.body.removeEventListener("pointermove", update);
    };
  }, [update]);
  return null;
}
