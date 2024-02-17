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
import { Outlet, useNavigate, useParams } from "@remix-run/react";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { CollapsibleSidebar } from "~/components/Layout/Navigation/CollapsibleSidebar";
import { getLocationsList } from "~/modules/resources";
import {
  QuotationStatus,
  getQuote,
  getQuoteExternalDocuments,
  getQuoteInternalDocuments,
  getQuoteLines,
} from "~/modules/sales";

import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

import { AiOutlinePartition } from "react-icons/ai";
import { HiOutlineCube } from "react-icons/hi";
import { LuClock } from "react-icons/lu";
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
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] w-full">
      <CollapsibleSidebar width={260}>
        <VStack className="border-b border-border p-4" spacing={1}>
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
                  onClick={() => navigate(path.to.newQuoteLine(id))}
                />
              </TooltipTrigger>
              <TooltipContent>Add Quote Line</TooltipContent>
            </Tooltip>
          </HStack>
        </VStack>
        <VStack className="h-[calc(100vh-183px)] p-2 w-full">
          <BillOfMaterialExplorer />
        </VStack>
      </CollapsibleSidebar>
      <VStack className="p-4">
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

        <Outlet />
      </VStack>
      {/* <QuotationHeader />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_4fr] h-full w-full gap-4">
        <QuotationSidebar />
        <Outlet />
      </div> */}
    </div>
  );
}

type BillOfMaterialNodeType =
  | "parent"
  | "part"
  | "part"
  | "assemblies"
  | "operations"
  | "materials"
  | "assembly"
  | "operation"
  | "material";

type BillOfMaterialNode = {
  id: string;
  label: string;
  type: BillOfMaterialNodeType;
  children?: BillOfMaterialNode[];
};

const data: BillOfMaterialNode[] = [
  {
    id: "0",
    label: "QUO000001",
    type: "parent",
    children: [
      {
        id: "1",
        label: "P00001234",
        type: "part",
      },
      {
        id: "2",
        label: "P00001233",
        type: "part",
        children: [
          {
            id: "3",
            label: "Assemblies",
            type: "assemblies",
            children: [
              {
                id: "4",
                label: "F5000123",
                type: "part",
                children: [
                  {
                    id: "5",
                    label: "Assemblies",
                    type: "assemblies",
                    children: [],
                  },
                  {
                    id: "6",
                    label: "Operations",
                    type: "operations",
                    children: [
                      {
                        id: "7",
                        label: "OP0003",
                        type: "operation",
                        children: [
                          {
                            id: "8",
                            label: "Materials",
                            type: "materials",
                            children: [
                              {
                                id: "9",
                                label: "RAW000001",
                                type: "material",
                              },
                              {
                                id: "10",
                                label: "FAS000002",
                                type: "material",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "11",
            label: "Operations",
            type: "operations",
            children: [
              {
                id: "12",
                label: "OP0001",
                type: "operation",
                children: [
                  {
                    id: "13",
                    label: "Materials",
                    type: "materials",
                    children: [
                      {
                        id: "14",
                        label: "RAW000003",
                        type: "material",
                      },
                    ],
                  },
                ],
              },
              {
                id: "13",
                label: "OP0002",
                type: "operation",
                children: [
                  {
                    id: "13",
                    label: "Materials",
                    type: "materials",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const BillOfMaterialItem = ({
  type,
  id,
  label,
}: Omit<BillOfMaterialNode, "children">) => {
  switch (type) {
    case "assemblies":
      return (
        <Button
          variant="ghost"
          className="w-full justify-between text-muted-foreground"
        >
          <span>{label}</span>
          <IoMdAdd />
        </Button>
      );
    case "materials":
      return (
        <Button
          variant="ghost"
          className="w-full justify-between text-muted-foreground"
        >
          <span>{label}</span>
          <IoMdAdd />
        </Button>
      );
    case "operations":
      return (
        <Button
          variant="ghost"
          className="w-full justify-between text-muted-foreground"
        >
          <span>{label}</span>
          <IoMdAdd />
        </Button>
      );
    case "part":
    case "assembly":
      return (
        <Button
          leftIcon={<AiOutlinePartition />}
          variant="ghost"
          className="flex-1 justify-start"
        >
          {label}
        </Button>
      );
    case "operation":
      return (
        <Button
          leftIcon={<LuClock />}
          variant="ghost"
          className="flex-1 justify-start"
        >
          {label}
        </Button>
      );
    case "material":
      return (
        <Button
          leftIcon={<HiOutlineCube />}
          variant="ghost"
          className="flex-1 justify-start"
        >
          {label}
        </Button>
      );
    case "parent":
    default:
      return (
        <Button variant="ghost" className="flex-1 justify-start">
          {label}
        </Button>
      );
  }
};

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
            <BillOfMaterialItem
              type={node.type}
              id={node.id}
              label={node.label}
            />
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
