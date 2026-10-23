import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Syarat & Ketentuan",
  description: "Syarat dan Ketentuan Penggunaan Situs Web Resmi NewSystem.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Syarat & Ketentuan
        </h1>
        <p className="text-xs text-slate-400">Terakhir diperbarui: 10 Oktober 2026</p>
      </div>

      <div className="prose-newsystem space-y-6 text-sm text-slate-700 leading-relaxed">
        <p>
          Selamat datang di situs web resmi NewSystem. Dengan mengakses dan menggunakan situs web ini, Anda menyetujui untuk terikat dengan syarat dan ketentuan berikut.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">1. Kepemilikan Hak Cipta & Merek</h2>
        <p>
          Merek &ldquo;NewSystem&rdquo;, logo visual, elemen grafis, token desain, dan seluruh materi edukasi yang dipublikasikan di situs ini adalah milik sah dari PT NewSystem Teknologi Indonesia. Penggunaan logo atau materi tanpa izin tertulis dilarang keras.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">2. Sifat Informasi & Kematangan Produk</h2>
        <p>
          Materi pada situs web ini disajikan untuk tujuan informasi arsitektur produk dan komunikasi program validasi. NewSystem saat ini dalam tahap pengembangan dan validasi Design Partner. Fitur-fitur yang dilabeli &ldquo;Planned&rdquo;, &ldquo;In Development&rdquo;, atau &ldquo;Prototype&rdquo; merupakan target desain teknis yang sedang diselesaikan dan bukan jaminan ketersediaan instan tanpa validasi pilot.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">3. Penggunaan Formulir & Kontak</h2>
        <p>
          Anda setuju untuk hanya memberikan informasi yang akurat dan sah saat mengisi formulir konsultasi atau pendaftaran mitra desain. Penggunaan skrip otomatis untuk melakukan spamming formulir dilarang.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">4. Batasan Tanggung Jawab</h2>
        <p>
          Meskipun kami berupaya menyajikan konten artikel edukasi yang akurat, informasi dalam blog disajikan sebagai panduan umum manajemen manufaktur dan tidak menggantikan nasihat hukum, audit akuntansi formal, atau konsultasi teknik tersertifikasi.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">5. Hukum yang Berlaku</h2>
        <p>
          Syarat dan ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Republik Indonesia.
        </p>
      </div>
    </div>
  );
}
