import { Outlet } from "@remix-run/react";
import { QuotationLines } from "~/modules/sales";

export default function QuotationLinesRoute() {
  return (
    <div className="flex flex-col w-full space-x-4 space-y-4">
      <QuotationLines />
      <Outlet />
    </div>
  );
}
