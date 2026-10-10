"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock, Mail, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk ke sistem.");
      }

      window.location.href = "/admin";
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-200">
        <div className="text-center mb-8">
          <div className="relative h-8 w-40 mx-auto mb-4">
            <Image
              src="/brand/logo-horizontal-light.svg"
              alt="NewSystem"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Portal CMS & Editorial</h1>
          <p className="text-xs text-slate-500 mt-1">
            Masuk untuk mengelola artikel, alur review, dan prospek pabrik.
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-6 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Akun CMS
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@newsystem.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:bg-white outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" disabled={loading} className="w-full mt-2">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </span>
            ) : (
              "Masuk ke Portal Admin"
            )}
          </Button>
        </form>

        {/* Quick Testing Demo Credentials */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-2">Akun Uji Coba RBAC Terdaftar:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickAccount("admin@newsystem.id", "NewSystemAdmin2026!")}
              className="p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
            >
              <span className="font-bold text-slate-800 block">Superadmin</span>
              <span className="text-[10px] text-slate-500">admin@newsystem.id</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount("editor@newsystem.id", "NewSystemEditor2026!")}
              className="p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
            >
              <span className="font-bold text-slate-800 block">Editor</span>
              <span className="text-[10px] text-slate-500">editor@newsystem.id</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount("reviewer@newsystem.id", "NewSystemReviewer2026!")}
              className="p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
            >
              <span className="font-bold text-slate-800 block">Reviewer</span>
              <span className="text-[10px] text-slate-500">reviewer@newsystem.id</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount("marketing@newsystem.id", "NewSystemMarketing2026!")}
              className="p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
            >
              <span className="font-bold text-slate-800 block">Lead Manager</span>
              <span className="text-[10px] text-slate-500">marketing@newsystem.id</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
