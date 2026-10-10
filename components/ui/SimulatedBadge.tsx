import React from "react";

interface SimulatedBadgeProps {
  label?: string;
  className?: string;
}

export function SimulatedBadge({
  label = "Simulasi Konsep / Prototipe Desain",
  className = "",
}: SimulatedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-700 border border-amber-500/20 uppercase tracking-wider ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
      {label}
    </span>
  );
}
