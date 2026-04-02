import React from "react";
import { cn } from "../../utils/cn";

export function Button({
  children,
  variant = "primary",
  isLoading = false,
  className,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium px-4 py-2.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    primary: {
      style: {
        background: "var(--color-accent)",
        boxShadow: "0 0 12px var(--color-accent-muted)",
        color: "#ffffff",
        border: "1px solid transparent",
      },
      hoverStyle: { background: "var(--color-accent-hover)" },
      leaveStyle: { background: "var(--color-accent)" },
    },
    secondary: {
      style: {
        background: "var(--color-elevated)",
        border: "1px solid var(--color-border-base)",
        color: "var(--color-text-primary)",
      },
      hoverStyle: { background: "var(--color-hover)" },
      leaveStyle: { background: "var(--color-elevated)" },
    },
    ghost: {
      style: {
        background: "transparent",
        border: "1px solid transparent",
        color: "var(--color-text-muted)",
      },
      hoverStyle: { background: "var(--color-hover)", color: "var(--color-text-primary)" },
      leaveStyle: { background: "transparent", color: "var(--color-text-muted)" },
    },
    danger: {
      style: {
        background: "var(--color-status-rejected)",
        border: "1px solid transparent",
        color: "#ffffff",
      },
      hoverStyle: { background: "#dc2626", boxShadow: "0 0 12px rgba(220,38,38,0.3)" },
      leaveStyle: { background: "var(--color-status-rejected)", boxShadow: "none" },
    },
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <button
      className={cn(baseStyles, className)}
      style={currentVariant.style}
      disabled={isLoading}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, currentVariant.hoverStyle);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, currentVariant.leaveStyle);
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}
