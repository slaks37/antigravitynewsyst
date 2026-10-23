"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Circle,
  Layers3,
  Package,
  Factory,
  ChartNoAxesCombined,
} from "lucide-react";

const views = [
  {
    name: "Produksi",
    icon: Factory,
    title: "Semua pekerjaan. Satu pandangan.",
    columns: ["Antrean", "Dikerjakan", "Selesai"],
    jobs: [
      ["WO-0248", "Rangka meja", "Potong & persiapan", "120 unit"],
      ["WO-0246", "Panel kabinet", "Perakitan", "80 unit"],
      ["WO-0241", "Kursi kayu", "Quality check", "60 unit"],
    ],
  },
  {
    name: "Inventori",
    icon: Package,
    title: "Material siap. Produksi jalan.",
    columns: ["Dipesan", "Tersedia", "Dialokasikan"],
    jobs: [
      ["MAT-001", "Plat baja", "Pembelian bahan", "240 kg"],
      ["MAT-012", "Papan kayu", "Gudang bahan baku", "180 lembar"],
      ["MAT-008", "Baut M8", "Reservasi WO-0246", "640 pcs"],
    ],
  },
  {
    name: "Biaya",
    icon: ChartNoAxesCombined,
    title: "Telusuri biaya di setiap proses.",
    columns: ["Material", "Tenaga kerja", "Overhead"],
    jobs: [
      ["WO-0248", "Bahan baku", "Pemakaian per order", "Rp 4,8 jt"],
      ["WO-0248", "Jam operator", "Waktu kerja tercatat", "Rp 1,2 jt"],
      ["WO-0248", "Operasi mesin", "Alokasi biaya mesin", "Rp 800 rb"],
    ],
  },
];

export function ProductionPreview() {
  const [active, setActive] = useState(0);
  const view = views[active];
  return (
    <div className="production-preview">
      <div className="preview-chrome">
        <span className="flex gap-1.5" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>NewSystem Workspace</span>
        <span className="preview-label">ILUSTRASI PRODUK</span>
      </div>
      <div className="preview-inner">
        <div className="preview-sidebar" aria-hidden="true">
          <Layers3 size={22} />
          <Factory size={18} />
          <Package size={18} />
          <ChartNoAxesCombined size={18} />
        </div>
        <div className="preview-main">
          <div className="preview-heading">
            <span>WORKSPACE / GENERAL MANUFACTURING</span>
            <ArrowUpRight size={16} />
          </div>
          <h2>{view.title}</h2>
          <div
            className="preview-tabs"
            role="tablist"
            aria-label="Pratinjau modul"
          >
            {views.map((v, i) => (
              <button
                key={v.name}
                id={`preview-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={active === i}
                aria-controls="preview-panel"
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(event) => {
                  if (
                    ["ArrowRight", "ArrowLeft", "Home", "End"].includes(
                      event.key,
                    )
                  ) {
                    event.preventDefault();
                    const next =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? views.length - 1
                          : (active +
                              (event.key === "ArrowRight" ? 1 : -1) +
                              views.length) %
                            views.length;
                    setActive(next);
                    document.getElementById(`preview-tab-${next}`)?.focus();
                  }
                }}
              >
                <v.icon size={14} />
                {v.name}
              </button>
            ))}
          </div>
          <div
            className="preview-board"
            id="preview-panel"
            role="tabpanel"
            aria-labelledby={`preview-tab-${active}`}
          >
            {view.jobs.map((job, i) => (
              <div className="preview-column" key={`${active}-${job[0]}-${i}`}>
                <div className="column-label">
                  <span className={`status-dot status-${i}`} />
                  {view.columns[i]}
                  <span>01</span>
                </div>
                <div className="job-card">
                  <span className="job-id">{job[0]}</span>
                  <div className={`job-visual visual-${i}`} aria-hidden="true">
                    <Layers3 size={35} strokeWidth={1} />
                  </div>
                  <h3>{job[1]}</h3>
                  <p>{job[2]}</p>
                  <div className="job-bottom">
                    <span>{job[3]}</span>
                    {i === 2 ? <Check size={14} /> : <Circle size={13} />}
                  </div>
                </div>
                <div className="board-placeholder" aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="preview-bottom">
            <span>
              <span className="status-dot status-2" />
              Alur data lintas modul
            </span>
            <span>Data contoh · bukan data pelanggan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
