import type { Database } from "@carbon/database";
import { PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer";

import { Header, Summary, Template } from "../components";
import type { PDF } from "../types";

interface PurchaseOrderPDFProps extends PDF {
  purchaseOrder: Database["public"]["Views"]["purchaseOrders"]["Row"];
  purchaseOrderLines: Database["public"]["Tables"]["purchaseOrderLine"]["Row"][];
}

// TODO: format currency based on settings

const PurchaseOrderPDF = ({
  company,
  meta,
  purchaseOrder,
  purchaseOrderLines,
  title = "Purchase Order",
}: PurchaseOrderPDFProps) => {
  const styles = StyleSheet.create({
    row: {
      display: "flex",
      alignItems: "flex-start",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      width: "100%",
    },
    colFull: {
      display: "flex",
      flexDirection: "column",
      rowGap: 3,
      fontSize: 11,
      fontWeight: 500,
      width: "100%",
    },
    colHalf: {
      display: "flex",
      flexDirection: "column",
      rowGap: 3,
      fontSize: 11,
      fontWeight: 500,
      width: "50%",
    },
    colThird: {
      display: "flex",
      flexDirection: "column",
      rowGap: 3,
      fontSize: 11,
      fontWeight: 500,
      width: "32%",
    },
    label: {
      color: "#7d7d7d",
    },
    total: {
      fontWeight: 700,
      color: "#000000",
    },
    table: {
      marginBottom: 20,
      fontSize: 9,
    },
    thead: {
      flexGrow: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "20px",
      padding: "6px 3px 6px 3px",
      borderTop: 1,
      borderTopColor: "#CCCCCC",
      borderTopStyle: "solid",
      borderBottom: 1,
      borderBottomColor: "#CCCCCC",
      borderBottomStyle: "solid",
      fontWeight: 700,
      color: "#7d7d7d",
      textTransform: "uppercase",
    },
    tr: {
      flexGrow: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      padding: "6px 3px 6px 3px",
      borderBottom: 1,
      borderBottomColor: "#CCCCCC",
    },
    tfoot: {
      flexGrow: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "6px 3px 6px 3px",
      borderTopStyle: "solid",
      borderBottom: 1,
      borderBottomColor: "#CCCCCC",
      borderBottomStyle: "solid",
      fontWeight: 700,
      color: "#7d7d7d",
      textTransform: "uppercase",
    },
    tableCol1: {
      width: "40%",
      textAlign: "left",
    },
    tableCol2: {
      width: "20%",
      textAlign: "center",
    },
    tableCol3: {
      width: "20%",
      textAlign: "center",
    },
    tableCol4: {
      width: "20%",
      textAlign: "right",
    },
  });

  return (
    <Template
      title={title}
      meta={{
        author: meta?.author ?? "Carbon ERP",
        keywords: meta?.keywords ?? "purchase order",
        subject: meta?.subject ?? "Purchase Order",
      }}
    >
      <View>
        <Header title={title} company={company} />
        <Summary
          company={company}
          items={[
            {
              label: "Date",
              value: purchaseOrder?.orderDate,
            },
            {
              label: "PO #",
              value: purchaseOrder?.purchaseOrderId,
            },
          ]}
        />
        <View style={styles.row}>
          <View style={styles.colThird}>
            <Text style={styles.label}>Supplier</Text>
            <Text>John Doe</Text>
            <Text>123 Main Street</Text>
            <Text>Anytown, CA 12345</Text>
          </View>
          <View style={styles.colThird}>
            <Text style={styles.label}>Ship To</Text>
            <Text>Barry Mantelow</Text>
            <Text>123 Strange Rd</Text>
            <Text>Bazooka, AL 12345</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.colThird}>
            <Text style={styles.label}>Supplier Order #</Text>
            <Text>{purchaseOrder?.supplierReference}</Text>
          </View>
          <View style={styles.colThird}>
            <Text style={styles.label}>Requested Date</Text>
            <Text>{purchaseOrder?.receiptRequestedDate}</Text>
          </View>
          <View style={styles.colThird}>
            <Text style={styles.label}>Promised Date</Text>
            <Text>{purchaseOrder?.receiptPromisedDate}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.colThird}>
            <Text style={styles.label}>Shipping Method</Text>
            <Text>{purchaseOrder?.shippingMethodName}</Text>
          </View>
          <View style={styles.colThird}>
            <Text style={styles.label}>Shipping Terms</Text>
            <Text>{purchaseOrder?.shippingTermName}</Text>
          </View>
          <View style={styles.colThird}>
            <Text style={styles.label}>Payment Terms</Text>
            <Text>{purchaseOrder?.paymentTermName}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.thead}>
            <Text style={styles.tableCol1}>Description</Text>
            <Text style={styles.tableCol2}>Qty</Text>
            <Text style={styles.tableCol3}>Price</Text>
            <Text style={styles.tableCol4}>Total</Text>
          </View>
          {purchaseOrderLines.map((line) => (
            <View style={styles.tr} key={line.id}>
              <View style={styles.tableCol1}>
                <Text style={{ marginBottom: 4 }}>
                  {getLineDescription(purchaseOrder, line)}
                </Text>
                <Text style={{ fontSize: 9, opacity: 0.8, width: "95%" }}>
                  {line.description}
                </Text>
              </View>
              <Text style={styles.tableCol2}>
                {line.purchaseOrderLineType === "Comment"
                  ? ""
                  : line.purchaseQuantity}
              </Text>
              <Text style={styles.tableCol3}>
                {line.purchaseOrderLineType === "Comment" ? null : (
                  <>
                    <Text>$</Text>
                    <Text>
                      {line.unitPrice ? line.unitPrice.toFixed(2) : ""}
                    </Text>
                  </>
                )}
              </Text>
              <Text style={styles.tableCol4}>
                {line.purchaseOrderLineType === "Comment" ? null : (
                  <>
                    <Text>$</Text>
                    <Text>{getLineTotal(line)}</Text>
                  </>
                )}
              </Text>
            </View>
          ))}
          <View style={styles.tfoot}>
            <Text>Total</Text>
            <Text style={styles.total}>
              <Text>$</Text>
              <Text>{getTotal(purchaseOrderLines)}</Text>
            </Text>
          </View>
        </View>
        {purchaseOrder?.notes && (
          <View style={styles.row}>
            <View style={styles.colHalf}>
              <Text style={styles.label}>Notes</Text>
              <Text>{purchaseOrder?.notes}</Text>
            </View>
          </View>
        )}
      </View>
    </Template>
  );
};

function getTotal(
  lines: Database["public"]["Tables"]["purchaseOrderLine"]["Row"][]
) {
  let total = 0;

  lines.forEach((line) => {
    if (line?.purchaseQuantity && line?.unitPrice) {
      total += line.purchaseQuantity * line.unitPrice;
    }
  });

  return total.toFixed(2);
}

function getLineTotal(
  line: Database["public"]["Tables"]["purchaseOrderLine"]["Row"]
) {
  if (line?.purchaseQuantity && line?.unitPrice) {
    return (line.purchaseQuantity * line.unitPrice).toFixed(2);
  }

  return "";
}

function getLineDescription(
  purchaseOrder: Database["public"]["Views"]["purchaseOrders"]["Row"],
  line: Database["public"]["Tables"]["purchaseOrderLine"]["Row"]
) {
  switch (line?.purchaseOrderLineType) {
    case "Comment":
      return line?.description;
    case "Part":
      return line?.description;
    case "Service":
      return line?.description;
    case "Fixed Asset":
      return line?.description;
    default:
      return "";
  }
}

const PurchaseOrderPDFView = (props: PurchaseOrderPDFProps) => (
  <PDFViewer
    style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#FFFFFF",
    }}
  >
    <PurchaseOrderPDF {...props} />
  </PDFViewer>
);

export { PurchaseOrderPDF, PurchaseOrderPDFView };
