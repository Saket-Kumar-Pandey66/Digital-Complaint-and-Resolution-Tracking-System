import React, { useState } from "react";
import { Bell, Menu, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function TopNav({ user, title = "Dashboard" }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-10 flex h-16 items-center gap-x-4 px-4 sm:px-6 lg:px-8"
      style={{
        background: "rgba(13, 13, 13, 0.8)",
        borderBottom: "1px solid var(--color-border-base)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Mobile menu */}
      <button
        type="button"
        className="p-2 text-slate-600 hover:text-slate-400 lg:hidden transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title */}
      <div className="flex-1 flex items-center gap-3">
        <div>
          <h1
            className="text-base font-semibold text-[color:var(--color-text-primary)] hidden sm:block"
          >
            {title}
          </h1>
          {user && (
            <p className="text-xs text-[color:var(--color-text-faint)] hidden sm:block">
              {user.role === "admin" ? "Administrator" : "User"} — {user.username}
            </p>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl transition-all"
            style={{
              background: "var(--color-elevated)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <Bell className="h-4.5 w-4.5 text-[color:var(--color-text-muted)]" size={18} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-[var(--color-base)]"
              style={{ background: "var(--color-accent)" }}
            />
          </motion.button>

          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden z-50"
              style={{
                background: "var(--color-elevated)",
                border: "1px solid var(--color-border-base)",
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="px-4 py-3"
                style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
              >
                <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">Notifications</p>
              </div>
              <div className="p-4 text-center">
                <Bell size={24} className="text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-600">No notifications yet</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* User avatar */}
        <div
          className="h-8 w-8 rounded-xl flex items-center justify-center text-sm font-bold text-white"
          style={{
            background: "var(--color-accent)",
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
