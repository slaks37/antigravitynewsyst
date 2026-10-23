import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy text-slate-300 border-t border-slate-800">
      {/* Top Banner / Truthful Maturity Statement */}
      <div className="bg-navy-900 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span className="font-medium text-slate-300">Transparansi Kematangan Produk:</span>
            <span>
              NewSystem saat ini dalam tahap pengembangan intensif dan validasi bersama Design Partner. Seluruh prototipe dan analitik diberi label resmi.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/design-partner"
              className="text-brand-cyan hover:text-white transition-colors underline flex items-center gap-1"
            >
              <span>Info Program Validasi Pilot</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="relative h-9 w-44">
                <Image
                  src="/brand/logo-horizontal-dark.svg"
                  alt="NewSystem"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
              One System. Every Process. Smarter Business.
              <br />
              Sistem operasi bisnis dan manufaktur terpadu bertenaga AI untuk digitalisasi pabrik modern di Indonesia.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <p>Fokus Segmen: General, F&B, Garment, Furnitur & Assembly</p>
              <p>Model Operasional: MTO, MTS, Batch, Discrete, Hybrid</p>
            </div>
          </div>

          {/* Col 2: Platform & Modules */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Platform & Modul
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/modules/erp" className="hover:text-white transition-colors">
                  ERP Core
                </Link>
              </li>
              <li>
                <Link href="/modules/mes" className="hover:text-white transition-colors">
                  MES Shop Floor
                </Link>
              </li>
              <li>
                <Link href="/modules/accounting" className="hover:text-white transition-colors">
                  Accounting & HPP
                </Link>
              </li>
              <li>
                <Link href="/modules/crm" className="hover:text-white transition-colors">
                  CRM & Sales
                </Link>
              </li>
              <li>
                <Link href="/modules/hris" className="hover:text-white transition-colors">
                  HRIS & Shift
                </Link>
              </li>
              <li>
                <Link href="/modules/quality" className="hover:text-white transition-colors">
                  Quality Management
                </Link>
              </li>
              <li>
                <Link href="/modules/automation" className="hover:text-white transition-colors">
                  Workflow Studio
                </Link>
              </li>
              <li>
                <Link href="/copilot" className="hover:text-white transition-colors">
                  AI Copilot
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Solusi Industri */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Solusi Industri
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/solutions/general-manufacturing"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>General Manufacturing</span>
                </Link>
              </li>
              <li>
                <Link href="/solutions/food-beverage" className="hover:text-white transition-colors">
                  Food & Beverage
                </Link>
              </li>
              <li>
                <Link href="/solutions/garment" className="hover:text-white transition-colors">
                  Garment & Tekstil
                </Link>
              </li>
              <li>
                <Link href="/solutions/furniture-assembly" className="hover:text-white transition-colors">
                  Furnitur & Assembly
                </Link>
              </li>
              <li>
                <Link href="/solutions/batch" className="hover:text-white transition-colors">
                  Batch Manufacturing
                </Link>
              </li>
              <li>
                <Link href="/solutions/discrete" className="hover:text-white transition-colors">
                  Discrete Manufacturing
                </Link>
              </li>
              <li>
                <Link href="/solutions/hybrid" className="hover:text-white transition-colors">
                  Hybrid Manufacturing
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Blog */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Blog & Wawasan
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors font-semibold text-brand-cyan">
                  Pusat Wawasan Pabrik
                </Link>
              </li>
              <li>
                <Link href="/blog/category/erp-core" className="hover:text-white transition-colors">
                  ERP & Perencanaan
                </Link>
              </li>
              <li>
                <Link href="/blog/category/mes-shop-floor" className="hover:text-white transition-colors">
                  MES & Shop Floor
                </Link>
              </li>
              <li>
                <Link href="/blog/category/accounting-hpp" className="hover:text-white transition-colors">
                  Kalkulasi HPP Aktual
                </Link>
              </li>
              <li>
                <Link href="/design-partner" className="hover:text-white transition-colors">
                  Design Partner Program
                </Link>
              </li>
              <li><Link href="/services" className="hover:text-white transition-colors">Pendekatan Layanan</Link></li>
              <li>
                <Link href="/rss.xml" className="hover:text-white transition-colors">
                  RSS Feed
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 NewSystem. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
