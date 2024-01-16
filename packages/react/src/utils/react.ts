import { Children, isValidElement } from "react";

/**
 * Gets only the valid children of a component,
 * and ignores any nullish or falsy child.
 *
 * @param children the children
 */
export function getValidChildren(children: React.ReactNode) {
  return Children.toArray(children).filter((child) =>
    isValidElement(child)
  ) as React.ReactElement[];
}

export type Merge<T, P> = P & Omit<T, keyof P>;

export type MaybeRenderProp<P> =
  | React.ReactNode
  | ((props: P) => React.ReactNode);

export type ReactRef<T> = React.RefCallback<T> | React.MutableRefObject<T>;

export function assignRef<T = any>(
  ref: ReactRef<T> | null | undefined,
  value: T
) {
  if (ref == null) return;

  if (typeof ref === "function") {
    ref(value);
    return;
  }

  try {
    ref.current = value;
  } catch (error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`);
  }
}

export function mergeRefs<T>(...refs: (ReactRef<T> | null | undefined)[]) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      assignRef(ref, node);
    });
  };
}
