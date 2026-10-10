import React from "react";
import { MaturityState, MATURITY_STATE_CONFIG } from "@/lib/capabilities/status";

interface MaturityBadgeProps {
  status: MaturityState;
  showDescription?: boolean;
  className?: string;
}

export function MaturityBadge({ status, showDescription = false, className = "" }: MaturityBadgeProps) {
  const config = MATURITY_STATE_CONFIG[status] || MATURITY_STATE_CONFIG.PLANNED;

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.badgeClass}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70 animate-pulse" />
        {config.label}
      </span>
      {showDescription && (
        <span className="text-[11px] text-slate-500 mt-1 leading-tight">
          {config.description}
        </span>
      )}
    </div>
  );
}
