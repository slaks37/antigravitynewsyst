import {
  ArrowDownRight,
  FileSpreadsheet,
  FileText,
  Users,
  Boxes,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Waypoints,
} from "lucide-react";

export function DisconnectedCompany() {
  const systems = [
    {
      icon: BriefcaseBusiness,
      name: "Sales",
      file: "CRM / penawaran",
      status: "Komitmen pelanggan",
    },
    {
      icon: FileSpreadsheet,
      name: "Planning",
      file: "rencana-final-v3.xlsx",
      status: "Revisi di mana?",
    },
    {
      icon: Users,
      name: "People",
      file: "jadwal-shift.xlsx",
      status: "Tim mana yang siap?",
    },
    {
      icon: Boxes,
      name: "Inventory",
      file: "catatan-gudang.xlsx",
      status: "Material cukup?",
    },
    {
      icon: ChartNoAxesCombined,
      name: "Finance",
      file: "laporan-bulanan.xlsx",
      status: "Menunggu data operasi",
    },
    {
      icon: FileText,
      name: "Approvals",
      file: "dokumen-persetujuan.pdf",
      status: "Menunggu review",
    },
  ];
  return (
    <section
      className="disconnected-scene enterprise-shell"
      id="disconnected-company"
    >
      <div className="enterprise-section-heading">
        <div>
          <p className="enterprise-kicker">02 / THE DISCONNECTED COMPANY</p>
          <h2>
            Perusahaan Anda terus bergerak.
            <br />
            <em>Mengapa informasinya tertinggal?</em>
          </h2>
        </div>
        <div>
          <p>
            Sales memiliki datanya sendiri. Finance menunggu laporan. HR
            mengatur tim. Operations mengejar target. Procurement menjaga
            ketersediaan material.
          </p>
          <p>
            Semua bekerja keras. Tetapi informasi yang tersebar membuat
            koordinasi menjadi pekerjaan tambahan.
          </p>
        </div>
      </div>
      <div className="fragmented-systems">
        {systems.map((system, i) => (
          <div
            className="fragment-window"
            key={system.name}
            style={
              {
                "--fragment-angle": `${[-3, 2, -1, 2, -2, 3][i]}deg`,
              } as React.CSSProperties
            }
          >
            <div className="fragment-bar">
              <span />
              <span />
              <span />
            </div>
            <system.icon size={21} />
            <h3>{system.name}</h3>
            <span className="fragment-file">{system.file}</span>
            <p>{system.status}</p>
          </div>
        ))}
      </div>
      <div className="disconnected-resolution">
        <span>
          <Waypoints size={20} />
          NewSystem sebagai lapisan penghubung
        </span>
        <p>
          Informasi yang sama. Dibaca dalam konteks pekerjaan masing-masing.
        </p>
        <ArrowDownRight size={23} />
      </div>
    </section>
  );
}
