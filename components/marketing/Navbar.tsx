"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Menu,
  X,
  Cpu,
  Layers,
  Factory,
  Bot,
  BookOpen,
  Building2,
  FileText,
  Boxes,
  Workflow,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavSubItem {
  name: string;
  href: string;
  description: string;
  badge?: string;
}

interface NavCategory {
  title: string;
  items: NavSubItem[];
}

interface NavSection {
  name: string;
  href?: string;
  megaMenu?: NavCategory[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    name: "Platform",
    megaMenu: [
      {
        title: "Arsitektur Inti",
        items: [
          {
            name: "Unified Operating System",
            href: "/platform#unified-architecture",
            description: "Satu arsitektur terintegrasi tanpa database yang bertentangan.",
          },
          {
            name: "Multi-Company & Multi-Plant",
            href: "/platform#multi-plant",
            description: "Visibilitas terpusat untuk holding dan fasilitas banyak pabrik.",
          },
          {
            name: "Configurable Workflows",
            href: "/platform#workflows",
            description: "Penyesuaian alur kerja pabrik via konfigurasi, bukan fork kode.",
          },
        ],
      },
      {
        title: "Keamanan & Konektivitas",
        items: [
          {
            name: "Data & Business Intelligence",
            href: "/platform#bi-governance",
            description: "Single system of record dengan audit trail double-entry.",
          },
          {
            name: "Security & Governance",
            href: "/platform#security",
            description: "RBAC ketat, segregasi tugas, dan isolasi tenant aman.",
          },
          {
            name: "Integration Hub",
            href: "/modules/connect",
            description: "Konektor email, Google Drive, OneDrive, dan Open API.",
          },
        ],
      },
    ],
  },
  {
    name: "Solusi Industri",
    megaMenu: [
      {
        title: "Sektor Manufaktur",
        items: [
          {
            name: "General Manufacturing",
            href: "/solutions/general-manufacturing",
            description: "Work centers, routing fleksibel, costing HPP aktual.",
            badge: "Fokus Pilot",
          },
          {
            name: "Food & Beverage (F&B)",
            href: "/solutions/food-beverage",
            description: "Produksi batch, resep formula, kontrol expired & lot.",
          },
          {
            name: "Garment & Tekstil",
            href: "/solutions/garment",
            description: "Varian ukuran/warna, cutting, sewing, dan efisiensi lini.",
          },
          {
            name: "Furnitur & Assembly",
            href: "/solutions/furniture-assembly",
            description: "Pesanan custom MTO, multi-level BOM, dan biaya per job order.",
          },
        ],
      },
      {
        title: "Tipe Operasional",
        items: [
          {
            name: "Batch Manufacturing",
            href: "/solutions/batch",
            description: "Pelacakan batch, formula konsumsi, dan kepatuhan QC.",
          },
          {
            name: "Discrete Manufacturing",
            href: "/solutions/discrete",
            description: "Perakitan komponen presisi dengan penomoran serial.",
          },
          {
            name: "Hybrid Manufacturing",
            href: "/solutions/hybrid",
            description: "Kombinasi proses kontinu dan perakitan pesanan akhir.",
          },
        ],
      },
    ],
  },
  {
    name: "Modul",
    megaMenu: [
      {
        title: "Core Enterprise Suites",
        items: [
          {
            name: "ERP",
            href: "/modules/erp",
            description: "Pengadaan, multi-gudang, BOM, routing, & perencanaan PPIC.",
          },
          {
            name: "MES",
            href: "/modules/mes",
            description: "Shop floor dispatching, job cards, scrap, & jam kerja operator.",
          },
          {
            name: "Accounting & Costing",
            href: "/modules/accounting",
            description: "Double-entry otomatis, buku besar, dan HPP aktual riil.",
          },
          {
            name: "CRM",
            href: "/modules/crm",
            description: "Lead B2B, penawaran harga (Quotation), hingga Sales Order.",
          },
          {
            name: "HRIS",
            href: "/modules/hris",
            description: "Karyawan, shift pabrik, absensi, dan alokasi direct labor.",
          },
        ],
      },
      {
        title: "Operasi & Workspace",
        items: [
          {
            name: "Quality Management (QMS)",
            href: "/modules/quality",
            description: "IQC, in-process inspection, lot hold, dan laporan NCR.",
          },
          {
            name: "Maintenance (CMMS)",
            href: "/modules/maintenance",
            description: "Jadwal preventif mesin, suku cadang, dan tracking downtime.",
          },
          {
            name: "Workflow Automation",
            href: "/modules/automation",
            description: "Visual builder approval Event → Condition → Approval → Action.",
          },
          {
            name: "Smart Workspace & DMS",
            href: "/modules/workspace",
            description: "Penerbitan dokumen resmi bisnis & arsip SOP digital.",
          },
          {
            name: "Business Intelligence",
            href: "/modules/intelligence",
            description: "Visualisasi metrik lintas departemen dari single source of truth.",
          },
        ],
      },
    ],
  },
  {
    name: "AI Copilot",
    megaMenu: [
      {
        title: "Kecerdasan Perusahaan",
        items: [
          {
            name: "Company Copilot",
            href: "/copilot#company-copilot",
            description: "Wawasan lintas departemen: analisis profit, efisiensi & risiko.",
            badge: "Intelligent",
          },
          {
            name: "ERP & Supply Chain Copilot",
            href: "/copilot#erp-copilot",
            description: "Rekomendasi kuantitas pemesanan ekonomis dan deteksi bottleneck.",
          },
          {
            name: "MES & Shop Floor Copilot",
            href: "/copilot#mes-copilot",
            description: "Analisis anomali reject rate dan optimasi jadwal mesin.",
          },
        ],
      },
      {
        title: "Copilot Departemen",
        items: [
          {
            name: "Finance & Costing Copilot",
            href: "/copilot#finance-copilot",
            description: "Penjelasan varians HPP aktual vs standar dan margin pesanan.",
          },
          {
            name: "Quality & Maintenance Copilot",
            href: "/copilot#quality-copilot",
            description: "Korelasi penyebab cacat material dengan parameter mesin.",
          },
          {
            name: "Prinsip Tata Kelola AI",
            href: "/copilot#governance",
            description: "AI tidak pernah mem-bypass approval atau posting transaksi sepihak.",
          },
        ],
      },
    ],
  },
  {
    name: "Resources",
    megaMenu: [
      {
        title: "Pusat Pengetahuan",
        items: [
          {
            name: "Blog & Wawasan Manufaktur",
            href: "/blog",
            description: "Artikel mendalam mengenai ERP, MES, HPP, dan manajemen pabrik.",
          },
          {
            name: "MES & Lantai Produksi",
            href: "/blog/category/mes-shop-floor",
            description: "Standardisasi alur dari penerimaan pesanan hingga pengiriman.",
          },
          {
            name: "Kalkulasi HPP & Biaya",
            href: "/blog/category/accounting-hpp",
            description: "Metodologi perhitungan HPP aktual dan pengendalian scrap.",
          },
        ],
      },
      {
        title: "Perusahaan & Program",
        items: [
          {
            name: "Design Partner Program",
            href: "/design-partner",
            description: "Peluang kolaborasi validasi langsung untuk 3 pabrik percontohan.",
            badge: "Terbuka",
          },
          {
            name: "Tentang NewSystem",
            href: "/about",
            description: "Visi, misi, dan tim di balik arsitektur NewSystem.",
          },
          {
            name: "Kontak & Konsultasi",
            href: "/contact",
            description: "Diskusikan pemetaan alur dan tantangan spesifik pabrik Anda.",
          },
        ],
      },
    ],
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3"
          : "bg-white/80 backdrop-blur-sm border-b border-slate-100 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-lg p-1">
            <div className="relative h-8 w-36 sm:h-9 sm:w-40">
              <Image
                src="/brand/logo-horizontal-light.svg"
                alt="NewSystem Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_SECTIONS.map((section) => (
              <div
                key={section.name}
                className="relative"
                onMouseEnter={() => setActiveMegaMenu(section.name)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeMegaMenu === section.name
                      ? "text-brand-blue bg-blue-50/70"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  aria-expanded={activeMegaMenu === section.name}
                >
                  <span>{section.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeMegaMenu === section.name ? "rotate-180 text-brand-blue" : "text-slate-400"
                    }`}
                  />
                </button>

                {/* Mega Menu Dropdown */}
                {activeMegaMenu === section.name && section.megaMenu && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[650px] pt-2">
                    <div className="bg-white rounded-xl shadow-hover border border-slate-200 p-6 grid grid-cols-2 gap-6 animate-in fade-in-50 zoom-in-95 duration-150">
                      {section.megaMenu.map((col, idx) => (
                        <div key={idx} className="space-y-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                            {col.title}
                          </p>
                          <div className="space-y-2">
                            {col.items.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setActiveMegaMenu(null)}
                                className="block p-2 rounded-lg hover:bg-slate-50 transition-colors group/item"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-slate-900 group-hover/item:text-brand-blue transition-colors">
                                    {item.name}
                                  </span>
                                  {item.badge && (
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue border border-blue-200">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                  {item.description}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button href="/platform" variant="ghost" size="sm">
              Pelajari Platform
            </Button>
            <Button href="/contact" variant="primary" size="sm">
              Diskusikan Pabrik Anda
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-white border-b border-slate-200 shadow-xl max-h-[85vh] overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.name} className="border-b border-slate-100 pb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  {section.name}
                </p>
                <div className="grid grid-cols-1 gap-2 pl-2">
                  {section.megaMenu?.flatMap((cat) => cat.items).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-1 text-sm font-medium text-slate-800 hover:text-brand-blue flex items-center justify-between"
                    >
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button
              href="/contact"
              variant="primary"
              size="md"
              className="w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Diskusikan Pabrik Anda
            </Button>
            <Button
              href="/platform"
              variant="outline"
              size="md"
              className="w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pelajari Platform
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
