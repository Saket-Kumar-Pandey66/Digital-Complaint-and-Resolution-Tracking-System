import React from "react";
import { cn } from "../../utils/cn";

const variantStyles = {
  High: {
    classes: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  Medium: {
    classes: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  Low: {
    classes: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  Pending: {
    classes: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    dot: "#f59e0b",
  },
  "In Progress": {
    classes: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    dot: "#3b82f6",
  },
  Resolved: {
    classes: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    dot: "#10b981",
  },
  Reopened: {
    classes: "bg-red-500/10 text-red-500 border-red-500/20",
    dot: "#ef4444",
  },
  default: {
    classes: "bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border-base)]",
  },
};

export function Badge({ variant, children, className }) {
  const style = variantStyles[variant] || variantStyles.default;
  const showDot = ["Pending", "In Progress", "Resolved", "Reopened"].includes(variant);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wide font-semibold border",
        style.classes,
        className
      )}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: style.dot }}
        />
      )}
      {children}
    </span>
  );
}
