import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak sah." }, { status: 401 });
    }

    const { mode, topic, currentContent } = await req.json();

    if (!topic && !currentContent) {
      return NextResponse.json(
        { error: "Topik atau konten wajib disertakan." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is provided, call Google Gemini 2.0 Flash
    if (apiKey) {
      try {
        const prompt = `Anda adalah Asisten Editorial Teknis untuk blog manufaktur NewSystem.
Kaidah: Berikan jawaban profesional dalam Bahasa Indonesia tanpa mengarang klaim sertifikasi atau hasil palsu.
Mode: ${mode}
Topik/Konteks: ${topic}
Konten saat ini: ${currentContent || "-"}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (res.ok) {
          const geminiData = await res.json();
          const text =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (text) {
            return NextResponse.json({ success: true, suggestion: text });
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local template:", err);
      }
    }

    // Fallback template-assisted generation
    let suggestion = "";
    if (mode === "headline") {
      suggestion = `${topic}: Panduan Komprehensif & Praktik Terbaik untuk Manufaktur`;
    } else if (mode === "meta") {
      suggestion = `Pelajari analisis mendalam seputar ${topic}. Panduan terstruktur alur proses bisnis pabrik dan kalkulasi biaya dari tim NewSystem.`;
    } else if (mode === "claim_check") {
      suggestion =
        "Pemeriksaan Kepatuhan: Tidak ditemukan klaim palsu sertifikasi atau klaim ROI yang belum diverifikasi. Pastikan seluruh angka numerik diberi keterangan 'ilustratif' atau 'berdasarkan sampel pengujian'.";
    } else {
      // Outline mode
      suggestion = `## 1. Pendahuluan & Masalah Umum di Pabrik
Jelaskan mengapa ${topic} menjadi titik sakit operasional banyak pabrik manufaktur di Indonesia.

## 2. Batasan Tanggung Jawab & Bounded Contexts
Bedah pemisahan peran antara transaksi ERP di kantor dan eksekusi fisik di lantai produksi (shop floor).

## 3. Langkah Implementasi Terstandarisasi
Berikan panduan alur bertahap dari penerimaan pesanan hingga verifikasi bukti transaksi akhir.

## 4. Studi Kasus Pemetaan Biaya & Dampak
Jelaskan rumus kalkulasi dan contoh ilustratif penekanan biaya scrap atau selisih inventori.

## 5. Kesimpulan & Rekomendasi Manajemen
Rangkum langkah awal yang dapat diambil oleh pimpinan pabrik tanpa harus mengubah seluruh sistem dalam satu malam.`;
    }

    return NextResponse.json({ success: true, suggestion });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal memproses permintaan asisten AI: " + (err as Error).message },
      { status: 500 }
    );
  }
}
