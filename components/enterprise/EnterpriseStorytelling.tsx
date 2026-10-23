"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  STORY_SCENES,
  moduleHref,
  moduleStatus,
} from "@/lib/data/enterprise-story";
import { MaturityBadge } from "@/components/ui/MaturityBadge";
import { EnterpriseCanvas } from "./EnterpriseCanvas";
import { DepartmentDashboard } from "./DepartmentDashboard";
import { RippleEffectScenario } from "./RippleEffectScenario";

const ScrollNarrativeController = dynamic(
  () => import("./ScrollNarrativeController"),
  { ssr: false },
);

export function EnterpriseStorytelling() {
  const container = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [delayOverride, setDelayOverride] = useState<boolean | null>(null);
  const [enhance, setEnhance] = useState(false);
  const delayed = delayOverride ?? phase >= 4;

  useEffect(() => {
    const root = container.current;
    if (!root) return;
    const steps = root.querySelectorAll<HTMLElement>("[data-narrative-step]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            setPhase(
              Number((entry.target as HTMLElement).dataset.narrativeStep),
            );
      },
      { rootMargin: "-25% 0px -35% 0px", threshold: 0 },
    );
    steps.forEach((step) => observer.observe(step));
    const motion = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    let near = false;
    const update = () => setEnhance(near && motion.matches);
    const proximity = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          near = true;
          update();
          proximity.disconnect();
        }
      },
      { rootMargin: "350px" },
    );
    proximity.observe(root);
    motion.addEventListener("change", update);
    return () => {
      observer.disconnect();
      proximity.disconnect();
      motion.removeEventListener("change", update);
    };
  }, []);

  return (
    <div
      ref={container}
      className="enterprise-story enterprise-shell"
      id="enterprise-story"
      data-story-root
    >
      {enhance && <ScrollNarrativeController container={container} />}
      <div className="story-narratives">
        {STORY_SCENES.map((scene, index) => (
          <section
            id={`scene-${scene.id}`}
            data-narrative-step={index}
            className={`story-scene ${phase === index ? "scene-current" : ""}`}
            key={scene.id}
            aria-labelledby={`title-${scene.id}`}
          >
            <div className="story-scene-number">
              <span>{scene.number}</span>
              <span>{scene.label}</span>
              <ArrowDownRight size={17} />
            </div>
            <h2 id={`title-${scene.id}`}>{scene.title}</h2>
            <p className="scene-description">{scene.description}</p>
            <p className="scene-detail">{scene.detail}</p>
            <ol className="scene-process">
              {scene.steps.map((step, i) => (
                <li key={step}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="scene-maturity">
              {scene.modules.map((id) => (
                <Link href={moduleHref(id)} key={id}>
                  <span>
                    {moduleStatus(id).name}
                    <ArrowUpRight size={10} />
                  </span>
                  <MaturityBadge status={moduleStatus(id).status} />
                </Link>
              ))}
            </div>
            {scene.id === "ripple" && (
              <RippleEffectScenario
                delayed={delayed}
                onToggle={() => setDelayOverride(!delayed)}
              />
            )}
            <div className="mobile-scene-dashboard">
              <DepartmentDashboard phase={index} delayed={delayed} />
            </div>
          </section>
        ))}
      </div>
      <aside
        className="enterprise-canvas-column"
        aria-label="Enterprise Canvas — ilustrasi terhubung"
      >
        <div className="enterprise-canvas-sticky">
          <div className="canvas-scene-position">
            <span>
              <i />
              ONE CONNECTED COMPANY
            </span>
            <span>{STORY_SCENES[phase].number} / 09</span>
          </div>
          <EnterpriseCanvas phase={phase} delayed={delayed} />
          <DepartmentDashboard phase={phase} delayed={delayed} />
          <nav className="story-jump-nav" aria-label="Jelajahi tahapan cerita">
            {STORY_SCENES.map((scene, index) => (
              <a
                key={scene.id}
                href={`#scene-${scene.id}`}
                aria-label={`Scene ${scene.number}: ${scene.label}`}
                aria-current={phase === index ? "step" : undefined}
              >
                {scene.number}
              </a>
            ))}
          </nav>
          <p className="canvas-simulation-note">
            Satu perusahaan fiktif · SO-1042 · seluruh data & perpindahan status
            merupakan simulasi.
          </p>
        </div>
      </aside>
    </div>
  );
}
