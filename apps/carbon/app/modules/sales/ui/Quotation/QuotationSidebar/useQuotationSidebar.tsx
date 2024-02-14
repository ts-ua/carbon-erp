import { useParams } from "@remix-run/react";
import { BsBank, BsListCheck } from "react-icons/bs";
import {
  HiOutlineDocumentArrowDown,
  HiOutlineDocumentArrowUp,
} from "react-icons/hi2";
import { usePermissions } from "~/hooks";
import type { Role } from "~/types";
import { path } from "~/utils/path";

type Props = {
  lines?: number;
  externalDocuments?: number;
  internalDocuments?: number;
};

export function useQuotationSidebar({
  lines = 0,
  internalDocuments = 0,
  externalDocuments = 0,
}: Props) {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const permissions = usePermissions();
  return [
    {
      name: "Summary",
      to: path.to.quoteDetails(id),
      icon: BsBank,
    },
    {
      name: "Lines",
      to: path.to.quoteLines(id),
      count: lines,
      icon: BsListCheck,
    },
    {
      name: "Internal Documents",
      to: path.to.quoteInternalDocuments(id),
      role: ["employee"],
      count: internalDocuments,
      icon: HiOutlineDocumentArrowDown,
    },
    {
      name: "External Documents",
      to: path.to.quoteExternalDocuments(id),
      role: ["employee", "supplier"],
      count: externalDocuments,
      icon: HiOutlineDocumentArrowUp,
    },
  ].filter(
    (item) =>
      item.role === undefined ||
      item.role.some((role) => permissions.is(role as Role))
  );
}
