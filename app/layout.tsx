import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space"),
  title: {
    default: "NewSystem — One System. Every Process. Smarter Business.",
    template: "%s | NewSystem",
  },
  description:
    "NewSystem adalah sistem operasi bisnis & manufaktur terpadu bertenaga AI untuk pabrik modern Indonesia. Menghubungkan ERP, MES, HRIS, CRM, Akuntansi, Dokumen, dan Otomasi.",
  keywords: [
    "NewSystem",
    "ERP Manufaktur Indonesia",
    "MES Shop Floor",
    "Sistem Operasi Pabrik",
    "HPP Manufaktur",
    "Software Pabrik",
    "Manufacturing Operating System",
    "AI Copilot Pabrik",
  ],
  authors: [{ name: "NewSystem Engineering Team" }],
  creator: "NewSystem",
  publisher: "NewSystem",
  icons: {
    icon: "/brand/app-icon.png",
    apple: "/brand/app-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://newsystem.space",
    title: "NewSystem — One System. Every Process. Smarter Business.",
    description:
      "Sistem operasi bisnis dan manufaktur terpadu bertenaga AI untuk pabrik modern Indonesia. Menghubungkan seluruh proses dari pesanan hingga lantai produksi.",
    siteName: "NewSystem",
    images: [
      {
        url: "/brand/logo-with-tagline.png",
        width: 1200,
        height: 630,
        alt: "NewSystem — One System. Every Process. Smarter Business.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NewSystem — One System. Every Process. Smarter Business.",
    description:
      "Sistem operasi bisnis dan manufaktur terpadu bertenaga AI untuk pabrik modern Indonesia.",
    images: ["/brand/logo-with-tagline.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NewSystem",
    url: "https://newsystem.space",
    logo: "https://newsystem.space/brand/logo-horizontal-light.png",
    description:
      "AI-Powered Business & Manufacturing Operating System connecting operations, people, customers, finance, documents, automation, and BI.",
    foundingDate: "2026",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
    },
  };

  return (
    <html lang="id" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-slate-50">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
