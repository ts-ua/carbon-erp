import { useStore } from "@nanostores/react";
import idb from "localforage";
import { type WritableAtom } from "nanostores";
import { useCallback } from "react";

export function useNanoStore<T>(atom: WritableAtom<T>, localKey?: string) {
  const value = useStore(atom);

  const set = useCallback(
    (value: T | ((current: T) => T)) => {
      if (typeof value === "function") {
        atom.set((value as (current: T) => T)(atom.get()));
        if (localKey) idb.setItem(localKey, atom.get());
      } else {
        atom.set(value);
        if (localKey) idb.setItem(localKey, value);
      }
    },
    [atom, localKey]
  );

  return [value, set] as const;
}
