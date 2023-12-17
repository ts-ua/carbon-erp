import { Flex } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";
import { PurchaseOrderLines } from "~/modules/purchasing";

export default function PurchaseOrderLinesRoute() {
  return (
    <>
      <Flex w="full" rowGap={4} flexDirection="column">
        <PurchaseOrderLines />
        <Outlet />
      </Flex>
    </>
  );
}
