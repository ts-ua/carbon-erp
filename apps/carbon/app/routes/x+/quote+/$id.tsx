import {
  Button,
  HStack,
  Heading,
  IconButton,
  Input,
  Menubar,
  MenubarItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VStack,
  useMount,
} from "@carbon/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { CollapsibleSidebar } from "~/components/Layout/Navigation/CollapsibleSidebar";
import { getLocationsList } from "~/modules/resources";
import {
  QuotationStatus,
  getQuote,
  getQuoteExternalDocuments,
  getQuoteInternalDocuments,
  getQuoteLines,
  useQuotationTotals,
} from "~/modules/sales";

import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

import { RxChevronDown } from "react-icons/rx";

export const handle: Handle = {
  breadcrumb: "Quotations",
  to: path.to.quotes,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
  });

  const { id } = params;
  if (!id) throw new Error("Could not find id");

  const [
    quotation,
    quotationLines,
    externalDocuments,
    internalDocuments,
    locations,
  ] = await Promise.all([
    getQuote(client, id),
    getQuoteLines(client, id),
    getQuoteExternalDocuments(client, id),
    getQuoteInternalDocuments(client, id),
    getLocationsList(client),
  ]);

  if (quotation.error) {
    return redirect(
      path.to.quotes,
      await flash(
        request,
        error(quotation.error, "Failed to load quotation summary")
      )
    );
  }

  return json({
    quotation: quotation.data,
    quotationLines: quotationLines.data ?? [],
    externalDocuments: externalDocuments.data ?? [],
    internalDocuments: internalDocuments.data ?? [],
    locations: locations.data ?? [],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  return redirect(request.headers.get("Referer") ?? request.url);
}

export default function QuotationRoute() {
  const { quotationLines } = useLoaderData<typeof loader>();
  const [, setQuotationTotals] = useQuotationTotals();

  useEffect(() => {
    const totals = quotationLines.reduce(
      (acc, line) => {
        acc.total += (line.quantity ?? 0) * (line.unitPrice ?? 0);

        return acc;
      },
      { total: 0 }
    );
    setQuotationTotals(totals);
  }, [quotationLines, setQuotationTotals]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] w-full">
      <CollapsibleSidebar width={260}>
        <VStack className="border-b border-border p-4" spacing={0}>
          <Heading size="h3" noOfLines={1}>
            QUO000001
          </Heading>
          <QuotationStatus status="Draft" />
        </VStack>
        <VStack className="border-b border-border p-2" spacing={0}>
          <HStack className="w-full justify-between">
            <Input className="flex-1" placeholder="Search" size="sm" />
            <Tooltip>
              <TooltipTrigger>
                <IconButton
                  aria-label="Add Quote Line"
                  variant="secondary"
                  icon={<IoMdAdd />}
                />
              </TooltipTrigger>
              <TooltipContent>Add Quote Line</TooltipContent>
            </Tooltip>
          </HStack>
        </VStack>
        <VStack className="p-2 w-full">
          <BillOfMaterialExplorer />
        </VStack>
      </CollapsibleSidebar>
      <div className="p-4">
        <Menubar>
          <MenubarItem asChild>
            <a
              target="_blank"
              href={path.to.file.quote("TODO")}
              rel="noreferrer"
            >
              Preview
            </a>
          </MenubarItem>
        </Menubar>
      </div>
      {/* <QuotationHeader />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_4fr] h-full w-full gap-4">
        <QuotationSidebar />
        <Outlet />
      </div> */}
    </div>
  );
}

type BillOfMaterialNode = {
  id: string;
  type: "folder" | "file";
  children?: BillOfMaterialNode[];
};

const data: BillOfMaterialNode[] = [
  {
    id: "QUO000001",
    type: "folder",
    children: [
      {
        id: "F505555",
        type: "folder",
      },
      {
        id: "F505556",
        type: "folder",
      },
    ],
  },
];

const BillOfMaterialExplorer = () => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );

  useMount(() => {
    const map: Record<string, boolean> = {};
    const traverse = (node: BillOfMaterialNode[]) => {
      node.forEach((n) => {
        map[n.id] = true; // open all nodes by default;
        if (n.children) {
          traverse(n.children);
        }
      });
    };

    traverse(data);
    setExpandedNodes(map);
  });

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderBillOfMaterial = (
    data: BillOfMaterialNode[],
    level: number = 0
  ) => {
    return data.map((node) => {
      return (
        <div className="w-full" role="group" key={node.id}>
          <HStack
            className="items-stretch w-full"
            spacing={0}
            style={{
              paddingLeft: `calc(${0.5 * level}rem)`,
            }}
          >
            <IconButton
              aria-label={expandedNodes[node.id] ? "Collapse" : "Expand"}
              onClick={() => toggleNode(node.id)}
              isDisabled={!node.children}
              icon={<RxChevronDown />}
              style={{
                transition: "transform .25s ease",
                transform:
                  expandedNodes[node.id] || !node.children
                    ? undefined
                    : "rotate(-0.25turn)",
              }}
              variant="ghost"
            />

            <Button variant="ghost" className="flex-1 justify-start">
              {node.id}
            </Button>
          </HStack>
          {node.children &&
            expandedNodes[node.id] &&
            renderBillOfMaterial(node.children, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="w-full h-full overflow-auto" role="tree">
      {renderBillOfMaterial(data)}
    </div>
  );
};
