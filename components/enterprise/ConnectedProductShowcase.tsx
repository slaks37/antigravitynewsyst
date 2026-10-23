"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";
import {
  PLATFORM_GROUPS,
  STORY_SCENES,
  moduleHref,
  moduleStatus,
} from "@/lib/data/enterprise-story";
import { MaturityBadge } from "@/components/ui/MaturityBadge";
import { DepartmentDashboard } from "./DepartmentDashboard";

export function ConnectedProductShowcase() {
  const [active, setActive] = useState(0);
  function move(index: number) {
    setActive(index);
    document.getElementById(`platform-group-${index}`)?.focus();
  }
  return (
    <section className="enterprise-platform" id="enterprise-platform">
      <div className="enterprise-shell">
        <div className="enterprise-section-heading">
          <div>
            <p className="enterprise-kicker">10 / THE NEWSYSTEM PLATFORM</p>
            <h2>
              Satu platform. Berbagai kebutuhan.
              <br />
              <em>Tetap terhubung.</em>
            </h2>
          </div>
          <p>
            Jelajahi hubungan di balik setiap kelompok modul. Ruang lingkup dan
            kesiapan produk tetap menjadi bagian dari percakapan.
          </p>
        </div>
        <div className="platform-composition">
          <div
            className="platform-tabs"
            role="tablist"
            aria-label="Kelompok platform NewSystem"
            aria-orientation="vertical"
          >
            {PLATFORM_GROUPS.map((group, index) => (
              <button
                type="button"
                role="tab"
                id={`platform-group-${index}`}
                aria-selected={active === index}
                aria-controls={`platform-panel-${index}`}
                tabIndex={active === index ? 0 : -1}
                key={group.id}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  if (
                    [
                      "ArrowDown",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowLeft",
                      "Home",
                      "End",
                    ].includes(event.key)
                  ) {
                    event.preventDefault();
                    move(
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? PLATFORM_GROUPS.length - 1
                          : (active +
                              (["ArrowDown", "ArrowRight"].includes(event.key)
                                ? 1
                                : -1) +
                              PLATFORM_GROUPS.length) %
                            PLATFORM_GROUPS.length,
                    );
                  }
                }}
              >
                <span>0{index + 1}</span>
                <strong>{group.title}</strong>
                <ArrowUpRight size={17} />
              </button>
            ))}
          </div>
          <div className="platform-panels">
            {PLATFORM_GROUPS.map((group, index) => (
              <div
                id={`platform-panel-${index}`}
                role="tabpanel"
                aria-labelledby={`platform-group-${index}`}
                tabIndex={0}
                hidden={active !== index}
                key={group.id}
              >
                <div className="platform-panel-header">
                  <Layers3 size={20} />
                  <span>ILUSTRASI PENGALAMAN PRODUK</span>
                </div>
                <h3>{group.headline}</h3>
                <p className="platform-description">{group.description}</p>
                <DepartmentDashboard
                  phase={Math.max(
                    0,
                    STORY_SCENES.findIndex((s) => s.id === group.visual),
                  )}
                  delayed={false}
                />
                <p className="platform-use-case">
                  <strong>Dalam konteks perusahaan</strong>
                  {group.useCase}
                </p>
                <ul className="platform-module-links">
                  {group.modules.map((id) => (
                    <li key={id}>
                      <Link href={moduleHref(id)}>
                        <span>
                          {moduleStatus(id).name}
                          <ArrowUpRight size={14} />
                        </span>
                        <MaturityBadge status={moduleStatus(id).status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <noscript>
          <p>Kelompok modul dan kesiapan produk:</p>
          <ul>
            {PLATFORM_GROUPS.map((group) => (
              <li key={group.id}>
                {group.title}:{" "}
                {group.modules.map((id) => (
                  <Link href={moduleHref(id)} key={id}>
                    {moduleStatus(id).name} — {moduleStatus(id).status};{" "}
                  </Link>
                ))}
              </li>
            ))}
          </ul>
        </noscript>
        <p className="platform-truth-note">
          Seluruh pratinjau menggunakan data contoh. Label kesiapan berasal dari
          katalog modul NewSystem, bukan dari animasi atau tampilan ilustrasi.
        </p>
      </div>
    </section>
  );
}
