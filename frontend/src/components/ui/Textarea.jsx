import React from "react";
import { cn } from "../../utils/cn";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full px-4 py-3 rounded-lg text-sm font-medium outline-none transition-all resize-none min-h-[120px] leading-relaxed",
        "bg-[var(--color-surface)] border border-[var(--color-border-base)]",
        "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)]",
        "focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-muted)]",
        className
      )}
      {...props}
    />
  );
}
