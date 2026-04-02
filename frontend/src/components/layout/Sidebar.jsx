import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { LayoutDashboard, Send, List, ShieldCheck, LogOut, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const links = isAdmin
    ? [
        { name: "Overview", href: "/admin", icon: LayoutDashboard, desc: "All tickets" },
      ]
    : [
        { name: "Track Issues", href: "/dashboard?tab=track", icon: List, desc: "View complaints" },
        { name: "Submit Ticket", href: "/dashboard?tab=submit", icon: Send, desc: "New complaint" },
      ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside
      className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col hidden lg:flex"
      style={{
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border-base)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6 py-5"
        style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
      >
        <div
          className="p-2 rounded-xl"
          style={{
            background: "var(--color-accent-muted)",
            border: "1px solid var(--color-border-base)",
          }}
        >
          <ShieldCheck size={20} className="text-[color:var(--color-accent)]" />
        </div>
        <div>
          <span className="text-base font-bold text-[color:var(--color-text-primary)] tracking-tight">DCRTS</span>
          <div
            className="text-[10px] font-semibold uppercase tracking-widest mt-0.5"
            style={{ color: "var(--color-text-faint)" }}
          >
            {isAdmin ? "Admin Panel" : "User Portal"}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-text-faint)]">
            Navigation
          </span>
        </div>

        {links.map((link) => {
          const isActive =
            location.pathname + location.search === link.href ||
            (link.href.includes("?") && location.search.includes(link.href.split("?")[1])) ||
            (link.href === "/admin" && location.pathname === "/admin");

          return (
            <Link key={link.name} to={link.href}>
              <motion.div
                whileHover={{ x: 3 }}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all cursor-pointer",
                  isActive
                    ? "text-[color:var(--color-text-primary)]"
                    : "text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)] hover:bg-[var(--color-hover)]"
                )}
                style={
                  isActive
                    ? {
                        background: "var(--color-elevated)",
                        border: "1px solid var(--color-border-base)",
                      }
                    : {
                        background: "transparent",
                        border: "1px solid transparent",
                      }
                }
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={
                    isActive
                      ? {
                          background: "var(--color-accent)",
                          border: "1px solid transparent",
                        }
                      : {
                          background: "var(--color-elevated)",
                          border: "1px solid var(--color-border-subtle)",
                        }
                  }
                >
                  <link.icon
                    size={15}
                    className={isActive ? "text-white" : "text-[color:var(--color-text-faint)] group-hover:text-[color:var(--color-text-muted)]"}
                  />
                </div>
                <div>
                  <div className={isActive ? "text-[color:var(--color-text-primary)]" : ""}>{link.name}</div>
                  <div className="text-[11px] text-[color:var(--color-text-faint)] mt-0.5">{link.desc}</div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User profile area */}
      <div
        className="px-3 py-3 mx-3 mb-3 rounded-2xl"
        style={{
          background: "var(--color-elevated)",
          border: "1px solid var(--color-border-base)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
            style={{
              background: "var(--color-accent)",
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[color:var(--color-text-primary)] truncate">{user?.name}</p>
            <p className="text-xs text-[color:var(--color-text-muted)] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-xs font-medium text-[color:var(--color-text-faint)] hover:text-red-400 transition-colors py-2 rounded-lg hover:bg-red-500/10"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
