"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { href: "/platform", name: "Platform" },
  { href: "/modules", name: "Modul" },
  { href: "/solutions", name: "Solusi industri" },
  { href: "/services", name: "Services" },
  { href: "/copilot", name: "AI Copilot" },
  { href: "/blog", name: "Blog" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);
  return (
    <header className="site-header">
      <div className="site-nav">
        <Link href="/" aria-label="NewSystem — Beranda" className="shrink-0">
          <Image
            src="/brand/logo-horizontal-light.svg"
            alt="NewSystem"
            width={158}
            height={36}
            priority
          />
        </Link>
        <nav aria-label="Navigasi utama" className="desktop-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="nav-cta">
          Diskusikan perusahaan Anda
          <ArrowUpRight size={16} />
        </Link>
        <button
          type="button"
          className="mobile-toggle"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Navigasi seluler"
          className="mobile-navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
            >
              {link.name}
              <ArrowUpRight size={16} />
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}>
            Diskusikan perusahaan Anda
            <ArrowUpRight size={16} />
          </Link>
        </nav>
      )}
    </header>
  );
}
