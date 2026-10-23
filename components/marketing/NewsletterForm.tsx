"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: new FormData(form).get("email"), sourcePage: "/blog", consent: true }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Pendaftaran belum berhasil. Silakan coba lagi.");
      setSucceeded(true);
      setMessage("Terima kasih. Email Anda sudah terdaftar untuk pembaruan NewSystem.");
      form.reset();
    } catch {
      setMessage("Pendaftaran belum berhasil. Silakan coba lagi nanti.");
    } finally { setPending(false); }
  }
  return <form onSubmit={subscribe} className="max-w-md mx-auto pt-2">
    <label htmlFor="newsletter-email" className="sr-only">Email untuk pembaruan NewSystem</label>
    <div className="flex flex-col sm:flex-row gap-3"><input id="newsletter-email" name="email" type="email" required autoComplete="email" placeholder="Email kantor Anda" disabled={pending || succeeded} className="min-w-0 flex-1 px-4 py-3 rounded-lg border border-slate-300 text-sm bg-white" /><button type="submit" disabled={pending || succeeded} className="px-6 py-3 rounded-lg bg-brand-blue text-white text-sm font-semibold disabled:opacity-60">{pending ? "Mendaftarkan…" : succeeded ? "Terdaftar" : "Langganan"}</button></div>
    <p role="status" aria-live="polite" className="text-sm text-slate-700 mt-3">{message}</p>
  </form>;
}
