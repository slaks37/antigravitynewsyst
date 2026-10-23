import { ArrowDown, ArrowRight, RotateCcw, Truck } from "lucide-react";
import { getRippleImpacts } from "@/lib/data/enterprise-story";

export function RippleEffectScenario({
  delayed,
  onToggle,
}: {
  delayed: boolean;
  onToggle: () => void;
}) {
  const impacts = getRippleImpacts(true);
  return (
    <div className={`ripple-scenario ${delayed ? "ripple-is-delayed" : ""}`}>
      <div className="ripple-source">
        <Truck size={20} />
        <div>
          <small>SUMBER PERUBAHAN · PO-0086</small>
          <strong>
            {delayed
              ? "Kiriman panel laminasi tertunda 2 hari"
              : "Skenario awal: material sesuai rencana"}
          </strong>
        </div>
      </div>
      <button
        type="button"
        className="ripple-toggle"
        aria-pressed={delayed}
        onClick={onToggle}
      >
        {delayed ? <RotateCcw size={14} /> : <ArrowRight size={14} />}
        {delayed
          ? "Reset simulasi keterlambatan"
          : "Simulasikan kiriman terlambat"}
      </button>
      <div className="ripple-outcome" aria-live="polite">
        <p>
          {delayed
            ? "Material yang belum siap memicu kebutuhan tinjauan bersama:"
            : "Belum ada perubahan pada skenario. Jalankan simulasi untuk melihat dampak antar-departemen."}
        </p>
      </div>
      <ol className="ripple-impacts">
        {impacts.map((impact, i) => (
          <li
            key={impact.department}
            style={{ "--impact-step": i } as React.CSSProperties}
          >
            <span>
              <ArrowDown size={12} />
              {impact.label}
            </span>
            <small>{impact.cause}</small>
            <p>{impact.effect}</p>
          </li>
        ))}
      </ol>
      <p className="simulation-footnote">
        Seluruh dampak adalah ilustrasi. Tidak ada jadwal, transaksi, pesan,
        atau notifikasi nyata yang dijalankan.
      </p>
    </div>
  );
}
