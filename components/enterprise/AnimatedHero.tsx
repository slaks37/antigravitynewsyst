import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Users,
} from "lucide-react";
import { EnterpriseCanvas } from "./EnterpriseCanvas";

export function AnimatedHero() {
  return (
    <section className="enterprise-hero" aria-labelledby="enterprise-title">
      <div className="enterprise-shell hero-enterprise-heading">
        <p className="enterprise-kicker">
          <span />
          YOUR ENTIRE BUSINESS. WORKING AS ONE.
        </p>
        <h1 id="enterprise-title" className="kinetic-headline">
          <span>
            <span>Seluruh perusahaan.</span>
          </span>
          <span>
            <span>
              Satu sistem <em>yang terhubung.</em>
            </span>
          </span>
        </h1>
        <p className="enterprise-hero-description">
          Dari pelanggan dan tim Anda, hingga operasional, keuangan, dokumen,
          dan keputusan bisnis. NewSystem dirancang untuk menghubungkan
          semuanya.
        </p>
        <div className="enterprise-actions">
          <a className="enterprise-primary" href="#enterprise-story">
            Jelajahi Cara Kerjanya
            <ArrowDown size={16} />
          </a>
          <Link className="enterprise-secondary" href="/contact">
            Diskusikan Kebutuhan Perusahaan
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="hero-brand-caption">
          <span>One System. Every Process. Smarter Business.</span>
          <span>BUSINESS & MANUFACTURING OPERATING SYSTEM</span>
        </div>
      </div>
      <div className="hero-enterprise-art enterprise-shell">
        <div className="hero-canvas-frame">
          <EnterpriseCanvas phase={6} hero />
        </div>
        <div className="enterprise-float float-sales">
          <BriefcaseBusiness size={17} />
          <div>
            <small>PELANGGAN → PELUANG</small>
            <strong>Setiap komitmen punya konteks.</strong>
            <span>SO-1042 · 120 meja · simulasi</span>
          </div>
        </div>
        <div className="enterprise-float float-finance">
          <ChartNoAxesCombined size={17} />
          <div>
            <small>OPERASI → KEUANGAN</small>
            <strong>Biaya mengikuti aktivitas.</strong>
            <span>Estimasi contoh · perlu review</span>
          </div>
        </div>
        <div className="enterprise-float float-people">
          <Users size={16} />
          <span>People. Processes. One connected view.</span>
        </div>
      </div>
      <div className="enterprise-shell hero-bottom-line">
        <span>01 / THE CONNECTED ENTERPRISE</span>
        <span>
          Ilustrasi pengalaman produk · data perusahaan fiktif · kesiapan
          mengikuti status modul
        </span>
        <a href="#enterprise-story" aria-label="Lanjut ke cerita perusahaan">
          <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
}
