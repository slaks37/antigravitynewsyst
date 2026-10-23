import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceJourney } from "@/components/enterprise/ServiceJourney";
import { LeadForm } from "@/components/marketing/LeadForm";
import "@/app/enterprise.css";

export const metadata: Metadata = {
  title: "Pendekatan Layanan & Pendampingan Perusahaan",
  description:
    "Jelajahi kerangka pendampingan yang diusulkan NewSystem: Discover, Implement, Connect, dan Grow. Diskusikan kebutuhan proses, ruang lingkup pilot, integrasi, dan adopsi tim.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Pendekatan Layanan NewSystem",
    description:
      "Mulai dari memahami cara perusahaan Anda bekerja. Empat fase pendampingan untuk didiskusikan bersama.",
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <div className="enterprise-site services-page">
      <div className="enterprise-shell services-breadcrumb">
        <Link href="/">NewSystem</Link>
        <span>/</span>
        <span>Services</span>
      </div>
      <section className="enterprise-shell services-main">
        <ServiceJourney detailed />
      </section>
      <section className="services-scope enterprise-shell">
        <div>
          <p className="enterprise-kicker">SEBELUM MENENTUKAN SOLUSI</p>
          <h2>
            Kebutuhan Anda menjadi
            <br />
            titik awal pembahasan.
          </h2>
        </div>
        <div>
          <p>
            Manufaktur adalah fokus awal NewSystem. Kecocokan kebutuhan
            perusahaan, kesiapan modul, dan kapasitas pendampingan perlu
            ditinjau bersama sebelum ada komitmen implementasi.
          </p>
          <ul>
            <li>
              Ruang lingkup pilot dan kriteria keberhasilan disepakati bersama.
            </li>
            <li>
              Data, izin akses, dan penanggung jawab dipetakan terlebih dahulu.
            </li>
            <li>
              Tidak ada janji durasi, integrasi aktif, atau hasil bisnis tanpa
              validasi.
            </li>
          </ul>
          <Link className="enterprise-secondary" href="/design-partner">
            Kenali program Design Partner
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
      <section className="enterprise-conversion" id="services-consultation">
        <div className="enterprise-shell enterprise-conversion-grid">
          <div>
            <p className="enterprise-kicker">MARI PETAKAN KEBUTUHANNYA</p>
            <h2>
              Mulai dari satu proses.
              <br />
              <em>Bangun pemahaman bersama.</em>
            </h2>
            <p>
              Ceritakan tantangan dan prioritas perusahaan Anda untuk
              mendiskusikan langkah selanjutnya.
            </p>
          </div>
          <div className="enterprise-form">
            <LeadForm variant="CONTACT" sourcePage="/services" />
          </div>
        </div>
      </section>
    </div>
  );
}
