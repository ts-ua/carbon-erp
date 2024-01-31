import type { Database } from "@carbon/database";
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { Email } from "../types";
import {
  getLineDescription,
  getLineDescriptionDetails,
  getTotal,
} from "../utils/purchase-order";
import { formatAddress } from "../utils/shared";

interface PurchaseOrderEmailProps extends Email {
  purchaseOrder: Database["public"]["Views"]["purchaseOrders"]["Row"];
  purchaseOrderLines: Database["public"]["Views"]["purchaseOrderLines"]["Row"][];
  purchaseOrderLocations: Database["public"]["Views"]["purchaseOrderLocations"]["Row"];
}

const PurchaseOrderEmail = ({
  company,
  purchaseOrder,
  purchaseOrderLines,
  purchaseOrderLocations,
  recipient,
  sender,
}: PurchaseOrderEmailProps) => {
  const {
    deliveryName,
    deliveryAddressLine1,
    deliveryAddressLine2,
    deliveryCity,
    deliveryState,
    deliveryPostalCode,
    deliveryCountryCode,
    dropShipment,
    customerName,
    customerAddressLine1,
    customerAddressLine2,
    customerCity,
    customerState,
    customerPostalCode,
    customerCountryCode,
  } = purchaseOrderLocations;

  const reSubject = `Re: ${purchaseOrder.purchaseOrderId} from ${company.name}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{`${purchaseOrder.purchaseOrderId} from ${company.name}`}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section>
            <Row>
              <Column>
                {company.logo ? (
                  <Img
                    src={company.logo}
                    width="auto"
                    height="42"
                    alt={`${company.name} Logo`}
                  />
                ) : (
                  <Text style={logoText}>{company.name}</Text>
                )}
              </Column>

              <Column align="right" style={tableCell}>
                <Text style={heading}>Purchase Order</Text>
              </Column>
            </Row>
          </Section>
          <Section>
            <Text style={subtleText}>
              Hi {recipient.firstName}, please see the attached purchase order
              and let me know if you have any questions.
            </Text>
          </Section>
          <Section style={informationTable}>
            <Row style={informationTableRow}>
              <Column colSpan={2}>
                <Section>
                  <Row>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>Buyer</Text>
                      <Link
                        style={{
                          ...informationTableValue,
                          color: "#15c",
                          textDecoration: "underline",
                        }}
                        href={`mailto:${sender.email}?subject=${reSubject}`}
                      >
                        {`${sender.firstName} ${sender.lastName}`}
                      </Link>
                    </Column>
                  </Row>

                  <Row>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>Payment Terms</Text>
                      <Text style={informationTableValue}>
                        {purchaseOrder.paymentTermName ?? "--"}
                      </Text>
                    </Column>
                  </Row>

                  <Row>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>Order ID</Text>
                      <Text style={informationTableValue}>
                        {purchaseOrder.purchaseOrderId}
                      </Text>
                    </Column>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>Requested Date</Text>
                      <Text style={informationTableValue}>
                        {purchaseOrder.receiptRequestedDate ?? "--"}
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Column>
              <Column style={informationTableColumn} colSpan={2}>
                <Text style={informationTableLabel}>Ship To</Text>
                {dropShipment ? (
                  <>
                    <Text style={informationTableValue}>{customerName}</Text>
                    {customerAddressLine1 && (
                      <Text style={informationTableValue}>
                        {customerAddressLine1}
                      </Text>
                    )}
                    {customerAddressLine2 && (
                      <Text style={informationTableValue}>
                        {customerAddressLine2}
                      </Text>
                    )}
                    <Text style={informationTableValue}>
                      {formatAddress(
                        customerCity,
                        customerState,
                        customerPostalCode
                      )}
                    </Text>
                    <Text style={informationTableValue}>
                      {customerCountryCode}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={informationTableValue}>{company.name}</Text>
                    <Text style={informationTableValue}>{deliveryName}</Text>
                    {deliveryAddressLine1 && (
                      <Text style={informationTableValue}>
                        {deliveryAddressLine1}
                      </Text>
                    )}
                    {deliveryAddressLine2 && (
                      <Text style={informationTableValue}>
                        {deliveryAddressLine2}
                      </Text>
                    )}
                    <Text style={informationTableValue}>
                      {formatAddress(
                        deliveryCity,
                        deliveryState,
                        deliveryPostalCode
                      )}
                    </Text>
                    <Text>{deliveryCountryCode}</Text>
                  </>
                )}
              </Column>
            </Row>
          </Section>
          <Section style={linesHeader}>
            <Text style={{ ...informationTableLabel, paddingLeft: "20px" }}>
              Purchase Order Lines
            </Text>
          </Section>
          <Section>
            {purchaseOrderLines.map((line) => (
              <Row key={line.id} style={lineRow}>
                <Column
                  style={{
                    paddingLeft: "5px",
                  }}
                >
                  <Text style={lineTitle}>{getLineDescription(line)}</Text>
                  {getLineDescriptionDetails(line)
                    ?.split("\n")
                    .map((l, i) => (
                      <Text key={i} style={lineDescription}>
                        {l}
                      </Text>
                    ))}
                </Column>
                <Column style={lineValueWrapper} align="right">
                  <Text style={lineValue}>
                    {line.purchaseOrderLineType === "Comment"
                      ? ""
                      : `(${line.purchaseQuantity})`}
                  </Text>
                </Column>
                <Column style={lineValueWrapper} align="right">
                  <Text style={lineValue}>
                    {line.purchaseOrderLineType === "Comment"
                      ? "--"
                      : line.unitPrice
                      ? `$${line.unitPrice.toFixed(2)}`
                      : "--"}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>
          <Hr style={priceLine} />
          <Section align="right">
            <Row>
              <Column style={tableCell} align="right">
                <Text style={priceTotal}>TOTAL</Text>
              </Column>
              <Column style={priceVerticalLine}></Column>
              <Column style={priceLargeWrapper}>
                <Text style={priceLarge}>
                  {`$${getTotal(purchaseOrderLines)}`}
                </Text>
              </Column>
            </Row>
          </Section>
          <Hr style={priceLineBottom} />
          <Section>
            <Row>
              <Column align="center" style={block}>
                {company.logo ? (
                  <Img
                    src={company.logo}
                    width="60"
                    height="auto"
                    alt={`${company.name} Logo`}
                  />
                ) : (
                  <Text style={logoText}>{company.name}</Text>
                )}
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PurchaseOrderEmail;

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: "#ffffff",
};

const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "660px",
  maxWidth: "100%",
};

const tableCell = { display: "table-cell" };

const logoText = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#111111",
};

const heading = {
  fontSize: "32px",
  fontWeight: "300",
  color: "#888888",
};

const subtleText = {
  textAlign: "left" as const,
  margin: "36px 0 40px 0",
  fontSize: "14px",
  fontWeight: "500",
  color: "#111111",
};

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "6px",
  fontSize: "12px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableLabel = {
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "10px",
  textTransform: "uppercase" as const,
};

const informationTableValue = {
  fontSize: "12px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const linesHeader = {
  ...informationTable,
  margin: "30px 0 15px 0",
  height: "24px",
};

const lineTitle = { fontSize: "12px", fontWeight: "600", ...resetText };

const lineDescription = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  ...resetText,
};

const lineRow = {
  marginBottom: "10px",
  paddingLeft: "20px",
};

const priceTotal = {
  margin: "0",
  color: "rgb(102,102,102)",
  fontSize: "10px",
  fontWeight: "600",
  padding: "0px 30px 0px 0px",
  textAlign: "right" as const,
};

const lineValue = {
  fontSize: "12px",
  fontWeight: "600",
  margin: "0",
};

const priceLarge = {
  margin: "0px 20px 0px 0px",
  fontSize: "16px",
  fontWeight: "600",
  whiteSpace: "nowrap" as const,
  textAlign: "right" as const,
};

const lineValueWrapper = {
  display: "table-cell",
  padding: "0px 20px 0px 0px",
  width: "100px",
  verticalAlign: "top",
};

const priceLine = { margin: "30px 0 0 0" };

const priceVerticalLine = {
  height: "48px",
  borderLeft: "1px solid",
  borderColor: "rgb(238,238,238)",
};

const priceLargeWrapper = { display: "table-cell", width: "90px" };

const priceLineBottom = { margin: "0 0 75px 0" };

const block = { display: "block" };
