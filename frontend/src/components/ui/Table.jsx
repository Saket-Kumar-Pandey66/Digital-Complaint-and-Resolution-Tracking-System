import React from "react";
import { cn } from "../../utils/cn";

export function Table({ className, children, ...props }) {
  return (
    <div className="w-full overflow-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }) {
  return (
    <thead
      className={cn("", className)}
      style={{ borderBottom: "1px solid var(--color-border-base)" }}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }) {
  return <tbody className={cn("", className)} {...props}>{children}</tbody>;
}

export function TableRow({ className, children, ...props }) {
  return (
    <tr
      className={cn("transition-colors group", className)}
      style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-hover)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }) {
  return (
    <th
      className={cn(
        "h-11 px-4 text-left align-middle text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }) {
  return (
    <td className={cn("px-4 py-3.5 align-middle text-[var(--color-text-muted)]", className)} {...props}>
      {children}
    </td>
  );
}
