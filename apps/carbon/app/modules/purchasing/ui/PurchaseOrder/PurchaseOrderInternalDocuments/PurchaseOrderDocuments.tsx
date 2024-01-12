import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  HStack,
  Hyperlink,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@carbon/react";
import { convertKbToString } from "@carbon/utils";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";
import { MdMoreVert } from "react-icons/md";
import { DocumentIcon } from "~/modules/documents";
import type { PurchaseOrderAttachment } from "~/modules/purchasing";
import { PurchaseOrderDocumentForm } from "~/modules/purchasing";
import { usePurchaseOrderDocuments } from "./usePurchaseOrderDocuments";

type PurchaseOrderDocumentsProps = {
  attachments: PurchaseOrderAttachment[];
  isExternal: boolean;
  orderId: string;
};

const PurchaseOrderDocuments = ({
  attachments,
  isExternal,
  orderId,
}: PurchaseOrderDocumentsProps) => {
  const { canDelete, download, deleteAttachment } = usePurchaseOrderDocuments({
    attachments,
    isExternal,
    orderId,
  });

  return (
    <>
      <Card>
        <HStack className="justify-between items-start">
          <CardHeader>
            <CardTitle>
              {isExternal ? "External" : "Internal"} Attachments
            </CardTitle>
          </CardHeader>
          <CardAction>
            <PurchaseOrderDocumentForm
              isExternal={isExternal}
              orderId={orderId}
            />
          </CardAction>
        </HStack>
        <CardContent>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Size</Th>

                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {attachments.length ? (
                attachments.map((attachment) => (
                  <Tr key={attachment.id}>
                    <Td>
                      <HStack>
                        <DocumentIcon fileName={attachment.name} />
                        <Hyperlink onClick={() => download(attachment)}>
                          {attachment.name}
                        </Hyperlink>
                      </HStack>
                    </Td>
                    <Td>
                      {convertKbToString(
                        Math.floor((attachment.metadata?.size ?? 0) / 1024)
                      )}
                    </Td>
                    <Td>
                      <div className="flex justify-end w-full">
                        <Menu>
                          <MenuButton
                            aria-label="More"
                            as={IconButton}
                            icon={<MdMoreVert />}
                            variant="outline"
                          />
                          <MenuList>
                            <MenuItem onClick={() => download(attachment)}>
                              Download
                            </MenuItem>
                            <MenuItem
                              isDisabled={!canDelete}
                              onClick={() => deleteAttachment(attachment)}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td
                    colSpan={24}
                    className="py-8 text-muted-foreground text-center"
                  >
                    No {isExternal ? "external" : "internal"} attachments
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
};

export default PurchaseOrderDocuments;
