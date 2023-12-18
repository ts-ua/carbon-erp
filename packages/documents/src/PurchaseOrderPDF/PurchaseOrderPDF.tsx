import type { Database } from "@carbon/database";
import { PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer";

import { Header, Summary, Template } from "../components";
import type { PDF } from "../types";

interface PurchaseOrderPDFProps extends PDF {
  lines?: Database["public"]["Tables"]["purchaseOrderLine"]["Row"];
}

const PurchaseOrderPDF = ({
  company,
  meta,
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
    },
    thead: {
      fontSize: 9,
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
      fontSize: "11px",
      padding: "15px 7px 15px 7px",
    },
    tfoot: {
      fontSize: 9,
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
              value: "12/3/2023",
            },
            {
              label: "PO #",
              value: "PO00000000001",
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
            <Text></Text>
          </View>
          <View style={styles.colThird}>
            <Text style={styles.label}>Requested Date</Text>
            <Text>1/15/2024</Text>
          </View>
          <View style={styles.colThird}>
            <Text style={styles.label}>Promised Date</Text>
            <Text></Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.colThird}>
            <Text style={styles.label}>Shipping Method</Text>
            <Text></Text>
          </View>
          <View style={styles.colThird}>
            <Text style={styles.label}>Shipping Terms</Text>
            <Text></Text>
          </View>
          <View style={styles.colThird}>
            <Text style={styles.label}>Payment Terms</Text>
            <Text>Net 30</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.thead}>
            <Text style={{ width: "40%" }}>Description</Text>
            <Text style={{ width: "20%", textAlign: "center" }}>Qty</Text>
            <Text style={{ width: "20%", textAlign: "center" }}>Price</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>Total</Text>
          </View>
          {/* {lines.map(({ id, description, details, rate, quantity, amount }) => (
            <View style={styles.tr} key={id}>
              <View style={{textAlign: "left", width: "40%"}}>
                <Text style={{ marginBottom: "10" }}>{description}</Text>
                <Text style={{ fontSize: "10", opacity: 0.8, width: "95%" }}>
                  {details}
                </Text>
              </View>
              <Text style={{ width: "20%", textAlign: "center" }}>
                {quantity}
              </Text>
              <Text style={{ width: "20%", textAlign: "center" }}>
                <Text>{currencySymbol}</Text>
                <Text>{rate ? rate.toFixed(2) : "0.00"}</Text>
              </Text>
              <Text style={{ width: "20%", textAlign: "right" }}>
                <Text>{currencySymbol}</Text>
                <Text>{amount}</Text>
              </Text>
            </View>
          ))} */}
          <View style={styles.tfoot}>
            <Text>Total</Text>
            <Text style={styles.total}>
              <Text>$</Text>
              <Text>49,340.32</Text>
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.colHalf}>
            <Text style={styles.label}>Notes</Text>
            <Text>This is a note</Text>
          </View>
        </View>
      </View>
    </Template>
  );
};

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
