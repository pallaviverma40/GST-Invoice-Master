'use client';
import { Button } from "@/components/ui/button";
import useInvoiceStore from "@/lib/store";
import { Share2, Mail } from "lucide-react";
import { toast } from "sonner";

export default function ActionButtons() {
  const invoiceNumber = useInvoiceStore((state) => state.invoiceNumber) || "";
  const items = useInvoiceStore((state) => state.items) || [];
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
      toast.info("WhatsApp opened");
    } catch {
      toast.error("Failed to open WhatsApp");
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
    } catch {
      toast.error("Failed to open email client");
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={shareViaWhatsApp} variant="outline" size="sm">
        <Share2 className="w-4 h-4 mr-2" /> WhatsApp
      </Button>
      <Button onClick={shareViaEmail} variant="outline" size="sm">
        <Mail className="w-4 h-4 mr-2" /> Email
      </Button>
    </div>
  );
}