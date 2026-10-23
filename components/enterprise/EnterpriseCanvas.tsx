import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ClipboardCheck,
  Factory,
  FileText,
  ShoppingBag,
  Users,
  Waypoints,
} from "lucide-react";
import {
  DEPARTMENTS,
  SIMULATED_ORDER,
  STORY_SCENES,
} from "@/lib/data/enterprise-story";

const icons = {
  sales: BriefcaseBusiness,
  planning: ChartNoAxesCombined,
  procurement: ShoppingBag,
  inventory: Boxes,
  people: Users,
  operations: Factory,
  quality: ClipboardCheck,
  finance: ChartNoAxesCombined,
  documents: FileText,
};
const connections = [
  ["sales", "planning"],
  ["planning", "procurement"],
  ["procurement", "inventory"],
  ["inventory", "operations"],
  ["operations", "quality"],
  ["quality", "documents"],
  ["documents", "finance"],
  ["people", "operations"],
  ["people", "planning"],
  ["finance", "sales"],
  ["finance", "planning"],
  ["documents", "procurement"],
] as const;
const hints: Record<string, string> = {
  sales: "SO-1042 · 120 meja",
  planning: "Kapasitas & kebutuhan",
  procurement: "PO-0086 · panel laminasi",
  inventory: "Material & reservasi",
  people: "Shift & kesiapan aset",
  operations: "WO-0214 · perakitan",
  quality: "Checkpoint & rework",
  finance: "Biaya & komitmen",
  documents: "Dokumen & persetujuan",
};

export function EnterpriseCanvas({
  phase = 0,
  delayed = false,
  hero = false,
}: {
  phase?: number;
  delayed?: boolean;
  hero?: boolean;
}) {
  const scene = STORY_SCENES[phase];
  const active: readonly string[] = hero
    ? DEPARTMENTS.map((d) => d.id)
    : scene.active;
  return (
    <div
      className={`enterprise-canvas ${hero ? "canvas-hero" : ""} ${delayed ? "canvas-delayed" : ""}`}
      data-canvas-phase={scene.id}
    >
      <div className="canvas-toolbar">
        <div className="canvas-brand">
          <Waypoints size={17} />
          <strong>NewSystem</strong>
          <span>Company Workspace</span>
        </div>
        <span className="simulation-label">SIMULASI</span>
      </div>
      <div className="canvas-context">
        <div>
          <span>PERUSAHAAN FIKTIF</span>
          <strong>{SIMULATED_ORDER.company}</strong>
        </div>
        <div>
          <span>ORDER CONTEXT</span>
          <strong>
            {SIMULATED_ORDER.id} <span> / {SIMULATED_ORDER.quantity} meja</span>
          </strong>
        </div>
      </div>
      <div
        className="enterprise-map"
        aria-label="Hubungan antar-departemen dalam ilustrasi perusahaan"
      >
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1000 620"
          className="canvas-paths"
          aria-hidden="true"
        >
          <defs>
            <marker
              id={hero ? "hero-arrow" : "story-arrow"}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>
          {connections.map(([from, to], i) => {
            const a = DEPARTMENTS.find((n) => n.id === from)!;
            const b = DEPARTMENTS.find((n) => n.id === to)!;
            const x1 = a.x * 10,
              y1 = a.y * 6.2,
              x2 = b.x * 10,
              y2 = b.y * 6.2;
            const path = `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;
            const isActive = active.includes(from) && active.includes(to);
            return (
              <g key={`${from}-${to}`}>
                <path d={path} className="connection-base" />
                <path
                  d={path}
                  pathLength="1"
                  strokeDasharray="1"
                  className={`process-connector ${isActive ? "connector-active" : ""} ${delayed && i < 4 ? "connector-impact" : ""}`}
                  markerEnd={`url(#${hero ? "hero-arrow" : "story-arrow"})`}
                />
              </g>
            );
          })}
        </svg>
        {DEPARTMENTS.map((node) => {
          const Icon = icons[node.id];
          const impacted =
            delayed && scene.id === "ripple" && active.includes(node.id);
          return (
            <Link
              key={node.id}
              href={node.href}
              className={`department-node ${active.includes(node.id) ? "node-active" : ""} ${impacted ? "node-review" : ""}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div>
                <Icon size={16} />
                <span className="node-indicator" />
              </div>
              <h3>{node.name}</h3>
              <p>{impacted ? "Perlu tinjauan tim" : hints[node.id]}</p>
              <ArrowUpRight size={11} className="node-link" />
            </Link>
          );
        })}
      </div>
      <div className="canvas-support">
        <span>
          <Waypoints size={12} /> Maintenance & IT mendukung lintas proses
        </span>
        <span>AI / BI sebagai lapisan pemahaman</span>
      </div>
      <div className="canvas-progress" aria-hidden="true">
        <div className="canvas-progress-fill" />
      </div>
    </div>
  );
}
