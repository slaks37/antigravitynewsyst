import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan Privasi dan Perlindungan Data Industri NewSystem.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Kebijakan Privasi
        </h1>
        <p className="text-xs text-slate-400">Terakhir diperbarui: 10 Oktober 2026</p>
      </div>

      <div className="prose-newsystem space-y-6 text-sm text-slate-700 leading-relaxed">
        <p>
          NewSystem (&ldquo;kami&rdquo;, &ldquo;kita&rdquo;, atau &ldquo;perusahaan&rdquo;) berkomitmen untuk melindungi privasi pengunjung situs web dan kerahasiaan data operasional mitra manufaktur kami. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">1. Informasi yang Kami Kumpulkan</h2>
        <p>
          Kami mengumpulkan data bisnis yang Anda berikan secara sukarela melalui formulir konsultasi, pendaftaran Design Partner, atau buletin wawasan manufaktur. Informasi tersebut mencakup: nama lengkap, alamat email bisnis, nomor telepon/WhatsApp, nama perusahaan, sektor industri, dan catatan tantangan operasional pabrik.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">2. Penggunaan Informasi</h2>
        <p>
          Informasi yang dikumpulkan digunakan semata-mata untuk:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Menghubungi Anda terkait penjadwalan konsultasi dan demonstrasi alur sistem.</li>
          <li>Mengevaluasi kualifikasi partisipasi dalam program Design Partner.</li>
          <li>Mengirimkan buletin artikel edukasi manufaktur (jika Anda mendaftar).</li>
          <li>Meningkatkan kualitas konten dan arsitektur produk kami.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">3. Kerahasiaan Data Industri</h2>
        <p>
          Kami sangat memahami sifat sensitif dari struktur biaya, formula produk, dan data pelanggan manufaktur. NewSystem tidak akan pernah menjual, menyewakan, atau membagikan data industri Anda kepada pihak ketiga untuk kepentingan periklanan.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">4. Keamanan Data</h2>
        <p>
          Seluruh pengiriman data melalui situs web dilindungi dengan enkripsi Transport Layer Security (TLS/HTTPS). Data tersimpan dalam database dengan kontrol akses ketat yang diaudit secara berkala.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">5. Kontak Privasi</h2>
        <p>
          Jika Anda memiliki pertanyaan mengenai kebijakan privasi atau ingin memperbarui/menghapus data Anda dari sistem kami, silakan hubungi tim kami melalui email <strong>privacy@newsystem.space</strong>.
        </p>
      </div>
    </div>
  );
}
