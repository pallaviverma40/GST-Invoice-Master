import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Simplified base URL resolution to prevent TypeScript env errors
const domain =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

const baseUrl = domain
  ? `https://${domain}`
  : `http://localhost:${process.env.PORT || 3000}`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "BillForge - Smart GST Invoice Generator",
    template: "%s | BillForge",
  },
  description:
    "Generate professional GST invoices with ease. BillForge is your modern SaaS billing solution – compliant, elegant, and efficient.",
  keywords: [
    "BillForge",
    "GST Invoice Generator",
    "Invoice Builder",
    "GST Billing App",
    "Tax Invoicing",
    "SaaS GST Tool",
    "India GST Invoice",
    "Digital Billing",
    "Create PDF Invoices",
    "Business Billing Software",
  ],
  authors: [
    {
      name: "Pallavi Verma",
      url: "https://Pallaviverma.github.io/",
    },
  ],
  creator: "Pallavi Verma",
  openGraph: {
    title: "BillForge - Smart GST Invoice Generator",
    description:
      "Sleek and modern SaaS platform for generating compliant GST invoices with real-time previews and PDF export.",
    url: baseUrl,
    siteName: "BillForge",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "BillForge Banner Image",
        type: "image/png",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BillForge - Smart GST Invoice Generator",
    description:
      "Create GST-compliant, professional invoices in seconds with BillForge – The modern solution for Indian businesses.",
    images: ["/thumbnail.png"],
    creator: "@pallaviverma_",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#0D0D2D",
  colorScheme: "light" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}