"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Users,
  Image as ImageIcon,
  UserCheck,
  Send,
  Sliders,
  Sparkles,
  ArrowRightLeft,
  ScrollText,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { UserRole, getRoleBadgeClass } from "@/lib/auth/rbac";

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Ikhtisar (Overview)", href: "/admin", icon: LayoutDashboard },
    { name: "Artikel & Posts", href: "/admin/posts", icon: FileText },
    { name: "Manajemen Prospek (Leads)", href: "/admin/leads", icon: UserCheck },
    { name: "AI Editorial Assistant", href: "/admin/ai-assistant", icon: Sparkles },
    { name: "Antrean Ingest Konten", href: "/admin/ingest", icon: Send },
    { name: "Kategori", href: "/admin/categories", icon: FolderTree },
    { name: "Penulis (Authors)", href: "/admin/authors", icon: Users },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    { name: "Pelanggan Buletin", href: "/admin/newsletter", icon: Send },
    { name: "SEO Redirects", href: "/admin/redirects", icon: ArrowRightLeft },
    { name: "Pengaturan & Matriks", href: "/admin/settings", icon: Sliders },
    { name: "Log Aktivitas (Audit)", href: "/admin/audit-logs", icon: ScrollText },
  ];

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 bg-navy text-slate-300 flex flex-col justify-between border-r border-slate-800 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin" className="block mb-2">
            <div className="relative h-7 w-36">
              <Image
                src="/brand/logo-horizontal-dark.svg"
                alt="NewSystem CMS"
                fill
                className="object-contain object-left"
              />
            </div>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-brand-cyan border border-slate-700">
              CMS Admin v1.0
            </span>
            <Link
              href="/"
              target="_blank"
              className="text-slate-400 hover:text-white transition-colors"
              title="Lihat Website Publik"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60">
          <p className="text-xs font-bold text-white truncate">{user.name}</p>
          <p className="text-[11px] text-slate-400 truncate mb-2">{user.email}</p>
          <span
            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRoleBadgeClass(
              user.role
            )}`}
          >
            {user.role}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-brand-blue text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/30"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
