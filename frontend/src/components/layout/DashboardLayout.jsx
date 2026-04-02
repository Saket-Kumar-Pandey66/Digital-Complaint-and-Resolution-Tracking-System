import React from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function DashboardLayout({ children, user, title }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-base)" }}>
      <Sidebar user={user} />

      <div className="flex flex-1 flex-col lg:pl-64 relative z-10">
        <TopNav user={user} title={title} />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
