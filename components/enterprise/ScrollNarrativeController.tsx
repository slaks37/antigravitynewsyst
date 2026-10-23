"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Loaded only as the desktop story approaches the viewport. It enhances SSR content.
export default function ScrollNarrativeController({
  container,
}: {
  container: RefObject<HTMLDivElement | null>;
}) {
  useGSAP(
    () => {
      if (!container.current) return;
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: container.current,
              start: "top 70%",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .fromTo(
              ".process-connector",
              { strokeDashoffset: 1 },
              { strokeDashoffset: 0, stagger: 0.08, duration: 1, ease: "none" },
              0,
            )
            .fromTo(
              ".canvas-progress-fill",
              { scaleX: 0 },
              { scaleX: 1, duration: 2, ease: "none" },
              0,
            )
            .fromTo(
              ".enterprise-map",
              { rotateX: 5, y: 12 },
              { rotateX: 0, y: 0, duration: 1, ease: "none" },
              0,
            );
          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        },
      );
      return () => media.revert();
    },
    { scope: container },
  );
  return null;
}
