import React from "react";
import { cn } from "../../utils/cn";

export function Input({ icon: Icon, className, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] pointer-events-none">
          <Icon size={15} />
        </div>
      )}
      <input
        className={cn(
          "w-full py-2.5 rounded-lg text-sm font-medium transition-all outline-none",
          "bg-[var(--color-surface)] border border-[var(--color-border-base)]",
          "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)]",
          "focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-muted)]",
          Icon ? "pl-10 pr-4" : "px-4",
          className
        )}
        {...props}
      />
    </div>
  );
}
