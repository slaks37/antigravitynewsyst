import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Check } from "lucide-react";
import { SERVICE_PHASES } from "@/lib/data/enterprise-story";

export function ServiceJourney({ detailed = false }: { detailed?: boolean }) {
  return (
    <div
      className={`service-journey ${detailed ? "service-journey-detailed" : ""}`}
    >
      <div className="service-introduction">
        <p className="enterprise-kicker">
          {detailed ? "OUR PROPOSED APPROACH" : "11 / SERVICES"}
        </p>
        {detailed ? (
          <h1>
            Teknologi yang tepat dimulai dari memahami cara perusahaan Anda
            bekerja.
          </h1>
        ) : (
          <h2>
            Teknologi yang tepat dimulai dari
            <br />
            <em>memahami cara perusahaan Anda bekerja.</em>
          </h2>
        )}
        <p>
          Mulai dari satu tantangan nyata. Petakan hubungan antarproses, lalu
          bahas langkah yang paling relevan untuk perusahaan Anda.
        </p>
        <div className="proposed-service-label">
          <span />
          Kerangka layanan yang diusulkan
        </div>
        <p className="services-qualification">
          Ruang lingkup, kapasitas pelaksanaan, biaya, dan hasil kerja perlu
          disepakati setelah discovery. Paket ini belum dinyatakan sebagai
          layanan komersial yang sudah tersedia.
        </p>
      </div>
      <div className="service-phases">
        {SERVICE_PHASES.map((phase, i) => (
          <details
            key={phase.id}
            id={`service-${phase.id}`}
            open={detailed || i === 0}
          >
            <summary>
              <span className="service-number">{phase.number}</span>
              <div>
                <span>{phase.name}</span>
                <h3>{phase.subtitle}</h3>
              </div>
              <ArrowDownRight size={19} />
            </summary>
            <div className="service-phase-detail">
              <h4>{phase.title}</h4>
              <p>{phase.description}</p>
              <ul>
                {phase.deliverables.map((item) => (
                  <li key={item}>
                    <Check size={13} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={`/contact?service=${phase.id}`}>
                Diskusikan kebutuhan fase ini
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </details>
        ))}
      </div>
      {!detailed && (
        <Link
          href="/services"
          className="enterprise-secondary service-page-link"
        >
          Jelajahi pendekatan layanan
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
