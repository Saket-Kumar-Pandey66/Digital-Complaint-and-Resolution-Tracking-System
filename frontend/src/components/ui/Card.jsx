import React from "react";
import { cn } from "../../utils/cn";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn("rounded-xl transition-shadow", className)}
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-base)",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn("px-6 pt-6 pb-4", className)}
      style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-lg font-semibold text-slate-100", className)}
      style={{ color: "var(--color-text-primary)" }}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p 
      className={cn("text-sm mt-1 leading-relaxed", className)} 
      style={{ color: "var(--color-text-muted)" }}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}
