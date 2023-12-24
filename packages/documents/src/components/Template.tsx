import { Document, Font, Page, StyleSheet } from "@react-pdf/renderer";
import type { PropsWithChildren } from "react";
import type { Meta } from "../types";

type TemplateProps = PropsWithChildren<{ title: string; meta: Meta }>;

const Template = ({ title, meta, children }: TemplateProps) => {
  // TODO: build fonts -- right now remix is struggling server side to load fonts
  Font.register({
    family: "Satoshi",
    fonts: [
      { src: "https://bradbarb.in/fonts/Satoshi-Regular.ttf" },
      { src: "https://bradbarb.in/fonts/Satoshi-Light.ttf", fontWeight: 300 },
      { src: "https://bradbarb.in/fonts/Satoshi-Medium.ttf", fontWeight: 500 },
      { src: "https://bradbarb.in/fonts/Satoshi-Bold.ttf", fontWeight: 700 },
      { src: "https://bradbarb.in/fonts/Satoshi-Black.ttf", fontWeight: 900 },
    ],
  });

  const styles = StyleSheet.create({
    body: {
      fontFamily: "Satoshi",
      padding: "20px 60px",
      color: "#000000",
      backgroundColor: "#FFFFFF",
    },
  });

  return (
    <Document
      author={meta?.author ?? "Carbon ERP"}
      keywords={meta?.keywords}
      subject={meta?.subject}
      title={title}
    >
      <Page size="A4" style={styles.body}>
        {children}
      </Page>
    </Document>
  );
};

export default Template;
