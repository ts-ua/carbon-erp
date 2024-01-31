import type { Database } from "@carbon/database";

export function getLineDescription(
  line: Database["public"]["Views"]["purchaseOrderLines"]["Row"]
) {
  switch (line?.purchaseOrderLineType) {
    case "Part":
      const supplierPartNumber = line.supplierPartId
        ? ` (${line.supplierPartId})`
        : "";
      return line?.partId + supplierPartNumber;
    case "Service":
      const supplierServiceNumber = line.supplierServiceId
        ? ` (${line.supplierServiceId})`
        : "";
      return line?.serviceId + supplierServiceNumber;
    case "Fixed Asset":
      return line?.assetId;
    case "G/L Account":
    case "Comment":
      return line?.description;
    default:
      return "";
  }
}

export function getLineDescriptionDetails(
  line: Database["public"]["Views"]["purchaseOrderLines"]["Row"]
) {
  switch (line?.purchaseOrderLineType) {
    case "Part":
      const partDescription = line?.partDescription
        ? `\n${line.partDescription}`
        : "";
      return line?.description + partDescription;
    case "Service":
      const serviceDescription = line?.serviceDescription
        ? `\n${line.serviceDescription}`
        : "";
      return line?.description + serviceDescription;
    case "Fixed Asset":
      return line?.description;
    case "G/L Account":
      return `GL Account: ${line?.accountNumber}`;
    case "Comment":
    default:
      return "";
  }
}

export function getLineTotal(
  line: Database["public"]["Views"]["purchaseOrderLines"]["Row"]
) {
  if (line?.purchaseQuantity && line?.unitPrice) {
    return (line.purchaseQuantity * line.unitPrice).toFixed(2);
  }

  return "";
}

export function getTotal(
  lines: Database["public"]["Views"]["purchaseOrderLines"]["Row"][]
) {
  let total = 0;

  lines.forEach((line) => {
    if (line?.purchaseQuantity && line?.unitPrice) {
      total += line.purchaseQuantity * line.unitPrice;
    }
  });

  return total.toFixed(2);
}
