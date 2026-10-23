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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NewSystem — Sistem Operasi Manufaktur & Bisnis Terpadu",
    template: "%s | NewSystem",
  },
  description:
    "NewSystem adalah sistem operasi cloud modern untuk manufaktur Indonesia. Menghubungkan ERP, MES Shop Floor, Akuntansi & HPP Aktual, CRM, Inventori, dan AI Copilot dalam satu kebenaran data.",
  keywords: [
    "NewSystem",
    "ERP Manufaktur Indonesia",
    "MES Shop Floor",
    "Sistem Operasi Pabrik",
    "HPP Manufaktur Aktual",
    "Software Pabrik Cloud",
    "Manufacturing Execution System",
    "AI Copilot Pabrik",
    "BOM & Work Order Tracking",
  ],
  authors: [{ name: "NewSystem Engineering Team" }],
  creator: "NewSystem",
  publisher: "NewSystem",
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  icons: {
    icon: "/brand/app-icon.png",
    apple: "/brand/app-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    title: "NewSystem — Sistem Operasi Manufaktur & Bisnis Terpadu",
    description:
      "Tinggalkan ERP kaku dan spreadsheet terpisah. Hubungkan seluruh alur pabrik Anda—dari Sales, MRP, Shop Floor MES, hingga HPP Aktual dalam satu platform real-time.",
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
    title: "NewSystem — Sistem Operasi Manufaktur & Bisnis Terpadu",
    description:
      "Platform ERP & MES cloud modern untuk pabrik di Indonesia. Real-time shop floor control, inventori akurat, dan kalkulasi HPP presisi.",
    images: ["/brand/logo-with-tagline.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
    url: siteUrl,
    logo: `${siteUrl}/brand/logo-horizontal-light.png`,
    description:
      "AI-Powered Cloud Manufacturing & Business Operating System connecting ERP, MES, inventory, actual costing, and automation.",
    foundingDate: "2026",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
    },
    sameAs: ["https://github.com/slaks37/antigravitynewsyst"],
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NewSystem",
    url: siteUrl,
    description: "Sistem Operasi Bisnis dan Manufaktur Terpadu Bertenaga AI",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="id" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-slate-50 selection:bg-brand-blue selection:text-white">
        <a href="#main-content" className="skip-link">
          Langsung ke konten
        </a>
        <Navbar />
        <main id="main-content" className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
