'use client';
import { Button } from "@/components/ui/button";
import useInvoiceStore from "@/lib/store";
import { Share2, Mail, Printer } from "lucide-react";
import { toast } from "sonner";

export default function ActionButtons() {
  const items = useInvoiceStore((state) => state.items) || [];
  const invoiceNumber = useInvoiceStore((state) => state.invoiceNumber) || "";
  const business = useInvoiceStore((state) => state.business);
  const client = useInvoiceStore((state) => state.client);

  // Compute total amount directly from items
  const totalAmount = items.reduce((sum, item) => {
    const amount = item.amount || (item.quantity * item.rate) || 0;
    const gst = item.gst || 0;
    return sum + amount + (amount * gst) / 100;
  }, 0);

  const businessName = business?.name || "Business";
  const clientName = client?.name || "Valued Customer";
  const clientEmail = client?.email || "";

  const shareViaWhatsApp = () => {
    try {
      const message =
        `*Invoice ${invoiceNumber} from ${businessName}*\n\n` +
        `*To:* ${clientName}\n` +
        `*Total Amount:* ₹${totalAmount.toFixed(2)}\n`;

      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
      toast.info("WhatsApp sharing initiated");
    } catch (error) {
      toast.error("Failed to open WhatsApp");
      console.error("WhatsApp sharing error:", error);
    }
  };

  const shareViaEmail = () => {
    try {
      const subject = `Invoice ${invoiceNumber} from ${businessName}`;
      const body =
        `Dear ${clientName},\n\n` +
        `Please find your invoice details:\n` +
        `- Invoice Number: ${invoiceNumber}\n` +
        `- Total Amount: ₹${totalAmount.toFixed(2)}\n\n` +
        `Best regards,\n${businessName}`;

      window.location.href = `mailto:${clientEmail}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      toast.info("Email client opened");
    } catch (error) {
      toast.error("Failed to open email client");
      console.error("Email sharing error:", error);
    }
  };

  const printInvoice = () => {
    try {
      window.print();
      toast.info("Print dialog opened");
    } catch (error) {
      toast.error("Printing failed");
      console.error("Print error:", error);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg flex space-x-2 z-50">
      <Button
        variant="outline"
        onClick={shareViaWhatsApp}
        className="bg-green-50 hover:bg-green-100 border-green-200"
      >
        <Share2 className="mr-2 h-4 w-4 text-green-600" /> WhatsApp
      </Button>

      <Button
        variant="outline"
        onClick={shareViaEmail}
        className="bg-blue-50 hover:bg-blue-100 border-blue-200"
      >
        <Mail className="mr-2 h-4 w-4 text-blue-600" /> Email
      </Button>

      <Button
        variant="outline"
        onClick={printInvoice}
        className="bg-purple-50 hover:bg-purple-100 border-purple-200"
      >
        <Printer className="mr-2 h-4 w-4 text-purple-600" /> Print
      </Button>
    </div>
  );
}