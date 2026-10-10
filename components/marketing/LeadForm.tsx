"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/events";

export type FormVariant = "CONTACT" | "DEMO_REQUEST" | "DESIGN_PARTNER";

interface LeadFormProps {
  variant?: FormVariant;
  defaultIndustry?: string;
  sourcePage?: string;
  onSuccess?: () => void;
  className?: string;
}

export function LeadForm({
  variant = "DEMO_REQUEST",
  defaultIndustry = "General Manufacturing",
  sourcePage = "/",
  onSuccess,
  className = "",
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    businessEmail: "",
    phoneNumber: "",
    company: "",
    industry: defaultIndustry,
    plantCount: 1,
    employeeRange: "20-50",
    productionType: "Make-to-Order (MTO)",
    businessProblem: "",
    consent: true,
    // Honeypot field for anti-spam
    websiteUrlHoneypot: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Anti-spam honeypot check
    if (formData.websiteUrlHoneypot) {
      console.warn("Spam bot detected via honeypot.");
      setSubmitted(true);
      return;
    }

    if (!formData.businessEmail || !formData.fullName || !formData.company) {
      setErrorMessage("Mohon lengkapi nama, email bisnis, dan nama perusahaan.");
      return;
    }

    if (!formData.consent) {
      setErrorMessage("Mohon setujui persetujuan pemrosesan data.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formType: variant,
          fullName: formData.fullName,
          businessEmail: formData.businessEmail,
          phoneNumber: formData.phoneNumber,
          company: formData.company,
          industry: formData.industry,
          plantCount: Number(formData.plantCount),
          employeeRange: formData.employeeRange,
          productionType: formData.productionType,
          businessProblem: formData.businessProblem,
          sourcePage,
          consent: formData.consent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirimkan formulir.");
      }

      setSubmitted(true);

      // Track analytics event
      if (variant === "DESIGN_PARTNER") {
        trackEvent("submit_design_partner_form", { form_type: variant, industry_id: formData.industry });
      } else if (variant === "DEMO_REQUEST") {
        trackEvent("submit_demo_request", { form_type: variant, industry_id: formData.industry });
      } else {
        trackEvent("submit_contact_form", { form_type: variant });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center animate-in fade-in">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Terima Kasih, Data Berhasil Dikirimkan
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
          Tim arsitek solusi NewSystem telah menerima data Anda dan akan menghubungi email bisnis{" "}
          <strong className="text-slate-900">{formData.businessEmail}</strong> untuk mengagendakan diskusi pemetaan proses bisnis pabrik Anda.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              fullName: "",
              businessEmail: "",
              phoneNumber: "",
              company: "",
              industry: defaultIndustry,
              plantCount: 1,
              employeeRange: "20-50",
              productionType: "Make-to-Order (MTO)",
              businessProblem: "",
              consent: true,
              websiteUrlHoneypot: "",
            });
          }}
        >
          Kirim Data Lainnya
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 text-left ${className}`}>
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Honeypot field (hidden from real users) */}
      <input
        type="text"
        name="websiteUrlHoneypot"
        value={formData.websiteUrlHoneypot}
        onChange={(e) => setFormData({ ...formData, websiteUrlHoneypot: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nama Lengkap <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="misal: Hendra Pratama"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Bisnis Pabrik <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="nama@perusahaan.co.id"
            value={formData.businessEmail}
            onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nama Perusahaan / Pabrik <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="PT / CV Nama Pabrik"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nomor WhatsApp / Telepon
          </label>
          <input
            type="tel"
            placeholder="0812-XXXX-XXXX"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Sektor Industri
          </label>
          <select
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
          >
            <option value="General Manufacturing">General Manufacturing</option>
            <option value="Food & Beverage">Food & Beverage (F&B)</option>
            <option value="Garment & Tekstil">Garment & Tekstil</option>
            <option value="Furniture & Assembly">Furnitur & Assembly</option>
            <option value="Batch Chemical / Pharma">Batch Chemical / Pharma</option>
            <option value="Discrete Electronics / Metal">Discrete Component</option>
            <option value="Lainnya">Industri Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Jumlah Fasilitas Pabrik (Plants)
          </label>
          <select
            value={formData.plantCount}
            onChange={(e) => setFormData({ ...formData, plantCount: Number(e.target.value) })}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
          >
            <option value={1}>1 Pabrik (Single Plant)</option>
            <option value={2}>2 Pabrik</option>
            <option value={3}>3 Pabrik</option>
            <option value={5}>4 - 10 Pabrik (Multi-Plant)</option>
            <option value={15}>Lebih dari 10 Pabrik</option>
          </select>
        </div>
      </div>

      {variant !== "CONTACT" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tipe Operasi Manufaktur
            </label>
            <select
              value={formData.productionType}
              onChange={(e) => setFormData({ ...formData, productionType: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
            >
              <option value="Make-to-Order (MTO)">Make-to-Order (MTO)</option>
              <option value="Make-to-Stock (MTS)">Make-to-Stock (MTS)</option>
              <option value="Batch Production">Batch Production</option>
              <option value="Discrete Assembly">Discrete Assembly</option>
              <option value="Hybrid (Campuran MTO & MTS)">Hybrid (Campuran)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Estimasi Tenaga Kerja
            </label>
            <select
              value={formData.employeeRange}
              onChange={(e) => setFormData({ ...formData, employeeRange: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
            >
              <option value="1-20 Pekerja">Kurang dari 20 Pekerja</option>
              <option value="20-50 Pekerja">20 - 50 Pekerja</option>
              <option value="50-100 Pekerja">50 - 100 Pekerja</option>
              <option value="100-250 Pekerja">100 - 250 Pekerja</option>
              <option value="250+ Pekerja">Lebih dari 250 Pekerja</option>
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {variant === "DESIGN_PARTNER"
            ? "Tantangan Utama / Titik Paling Sakit Saat Ini di Pabrik"
            : "Tantangan Operasional yang Ingin Diatasi"}
        </label>
        <textarea
          rows={3}
          placeholder="Ceritakan proses yang masih manual, selisih stok, perhitungan HPP, atau hambatan koordinasi antar tim..."
          value={formData.businessProblem}
          onChange={(e) => setFormData({ ...formData, businessProblem: e.target.value })}
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
        />
      </div>

      <div className="flex items-start gap-3 pt-1">
        <input
          type="checkbox"
          id="consent"
          checked={formData.consent}
          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
        />
        <label htmlFor="consent" className="text-xs text-slate-500 leading-normal">
          Saya menyetujui NewSystem menyimpan informasi bisnis ini untuk keperluan komunikasi konsultasi teknis dan penjadwalan pemetaan proses. Kami menghormati kerahasiaan data industri Anda.
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memproses Data...</span>
          </span>
        ) : variant === "DESIGN_PARTNER" ? (
          "Daftar Program Validasi Design Partner"
        ) : (
          "Jadwalkan Diskusi Pemetaan Proses Pabrik"
        )}
      </Button>
    </form>
  );
}
