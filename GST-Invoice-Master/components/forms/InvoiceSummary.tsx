"use client";

import useInvoiceStore from "@/lib/store";
import { ToWords } from "to-words";

const towords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paisa",
        plural: "Paisa",
        symbol: "",
      },
    },
  },
});

export default function InvoiceSummary() {
  const totals = useInvoiceStore((state) => state.totals) || { total: 0 };
  const numericTotal = totals.total || 0;
  
  const totalInWords = numericTotal > 0 ? towords.convert(numericTotal) : "Zero Rupees Only";

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-3">
      <h3 className="font-semibold text-gray-700">Amount Summary</h3>
      <div className="flex justify-between text-sm">
        <span>Subtotal / Total:</span>
        <span className="font-bold">₹{numericTotal.toFixed(2)}</span>
      </div>
      <div className="text-xs text-gray-500 italic">
        {totalInWords}
      </div>
    </div>
  );
}