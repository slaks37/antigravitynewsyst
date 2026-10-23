import {
  ArrowRight,
  Check,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { STORY_SCENES, SIMULATED_ORDER } from "@/lib/data/enterprise-story";

export function DepartmentDashboard({
  phase,
  delayed = false,
}: {
  phase: number;
  delayed?: boolean;
}) {
  const scene = STORY_SCENES[phase];
  return (
    <div
      className={`department-dashboard dashboard-${scene.id}`}
      aria-label={`Ilustrasi ${scene.label}`}
    >
      <div className="dashboard-heading">
        <span>
          {scene.id === "intelligence" ? (
            <Sparkles size={16} />
          ) : (
            <FileText size={16} />
          )}
          {scene.previewTitle}
        </span>
        <small>CONTOH</small>
      </div>
      {scene.id === "intelligence" ? (
        <div className="executive-example">
          <p className="ai-question">
            “Pesanan mana yang berisiko terlambat, dan apa penyebabnya?”
          </p>
          <div className="ai-answer">
            <Sparkles size={18} />
            <div>
              <strong>Ilustrasi jawaban Copilot</strong>
              <p>
                SO-1042 perlu ditinjau karena kiriman panel laminasi pada
                PO-0086 tertunda. Tinjau kebutuhan material dan rencana kerja
                sebelum mengubah komitmen pelanggan.
              </p>
              <div className="evidence-chips">
                <span>Sales Order</span>
                <span>PO-0086</span>
                <span>Rencana kerja</span>
              </div>
            </div>
          </div>
          <small className="approval-boundary">
            <ShieldCheck size={12} />
            Simulasi · AI prototipe · akses sesuai peran · keputusan tetap pada
            manusia
          </small>
        </div>
      ) : (
        <>
          <dl>
            {scene.rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  {scene.id === "ripple" && label === "Keterlambatan simulasi"
                    ? delayed
                      ? "2 hari · perlu review"
                      : "Tidak ada · skenario awal"
                    : value}
                </dd>
              </div>
            ))}
          </dl>
          {scene.id === "customer" && (
            <div className="transaction-flow">
              <span>QT-0064</span>
              <ArrowRight size={13} />
              <span>
                <Check size={12} />
                Review manusia
              </span>
              <ArrowRight size={13} />
              <strong>SO-1042</strong>
            </div>
          )}
          {scene.id === "execution" && (
            <div className="execution-meter">
              <div>
                <span>Output ilustratif</span>
                <strong>
                  {SIMULATED_ORDER.completed} / {SIMULATED_ORDER.quantity}
                </strong>
              </div>
              <div className="meter-track">
                <span />
              </div>
              <small>Checkpoint mutu tetap memerlukan tinjauan.</small>
            </div>
          )}
          {scene.id === "governance" && (
            <div className="cost-breakdown">
              <span>
                Material <b>28,8 jt</b>
              </span>
              <span>
                Tenaga kerja <b>7,2 jt</b>
              </span>
              <span>
                Overhead <b>4,8 jt</b>
              </span>
            </div>
          )}
          {scene.id === "people" && (
            <p className="dashboard-note">
              Rancangan HRIS & Maintenance · Dalam Pengembangan
            </p>
          )}
          {scene.id === "planning" && (
            <div className="planning-lanes" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          )}
        </>
      )}
    </div>
  );
}
