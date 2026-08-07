"use client";

import useSafeInvoiceTotals from "@/lib/store";
import { InvoiceDoc } from "../Templates/Invoice";
import { formatDate } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Button } from "../../ui/button";

export default function InvoicePreview() {
  const business = useSafeInvoiceTotals((state) => state.business);
  const client = useSafeInvoiceTotals((state) => state.client);
  const items = useSafeInvoiceTotals((state) => state.items);
  const invoiceNumber = useSafeInvoiceTotals((state) => state.invoiceNumber) || "";
  const invoiceDate = useSafeInvoiceTotals((state) => state.invoiceDate);

  const totals = useSafeInvoiceTotals();

  const PDFViewer = dynamic(() => import("../../pdf/PDFViewerWrapper"), {
    ssr: false,
  });
  const PDFDownloadLink = dynamic(
    () => import("../../pdf/PDFDownloadLinkWrapper"),
    { ssr: false }
  );

  const clientName = client?.name || "client";

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">
      <Button asChild>
        <PDFDownloadLink
          document={
            <InvoiceDoc
              business={business}
              client={client}
              items={items}
              invoiceNumber={invoiceNumber}
              invoiceDate={formatDate(invoiceDate)}
              totals={totals}
            />
          }
          fileName={`invoice-${invoiceNumber}-${clientName}.pdf`}
        >
          {({ loading }) =>
            loading ? "Loading document..." : "Download now!"
          }
        </PDFDownloadLink>
      </Button>

      <PDFViewer className="w-full h-screen">
        <InvoiceDoc
          business={business}
          client={client}
          items={items}
          invoiceNumber={invoiceNumber}
          invoiceDate={formatDate(invoiceDate)}
          totals={totals}
        />
      </PDFViewer>
    </div>
  );
}