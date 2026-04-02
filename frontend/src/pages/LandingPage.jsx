import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck, ArrowRight, Zap, BarChart3, Bell, Users,
  CheckCircle, Clock, AlertTriangle, Star, ChevronRight
} from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    color: "var(--color-accent)",
    glow: "var(--color-accent-muted)",
    title: "Instant Ticket Creation",
    desc: "Submit complaints with category, priority, and description in under 60 seconds.",
  },
  {
    icon: BarChart3,
    color: "var(--color-accent)",
    glow: "var(--color-accent-muted)",
    title: "Real-Time Tracking",
    desc: "Animated timeline shows exactly where your complaint is in the resolution pipeline.",
  },
  {
    icon: Bell,
    color: "var(--color-accent)",
    glow: "var(--color-accent-muted)",
    title: "Live Status Updates",
    desc: "Toast notifications keep you in the loop the moment your ticket status changes.",
  },
  {
    icon: Users,
    color: "var(--color-accent)",
    glow: "var(--color-accent-muted)",
    title: "Role-Based Access",
    desc: "Secure role separation between students, staff, and administrators.",
  },
];

const STATS = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<2h", label: "Avg Response" },
  { value: "4.9★", label: "User Rating" },
  { value: "500+", label: "Issues Resolved" },
];

const STEPS = [
  { step: "01", title: "Submit", desc: "Fill the complaint form with your issue details and priority level." },
  { step: "02", title: "Triage", desc: "Admin reviews and categorizes your complaint immediately." },
  { step: "03", title: "Resolution", desc: "Track real-time progress via an animated timeline until closure." },
];

const FloatingBadge = ({ text, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-slate-300 cursor-pointer hover:border-violet-500/50 transition-all ${className}`}
    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(124,58,237,0.2)" }}
  >
    {text}
    <ChevronRight size={14} className="text-violet-400" />
  </motion.div>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 40;
      const y = (clientY / window.innerHeight - 0.5) * 40;
      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--color-base)" }}>

      {/* ─── Navbar ─── */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-16 py-5">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl"
            style={{ background: "var(--color-accent-muted)", border: "1px solid var(--color-border-base)" }}
          >
            <ShieldCheck size={22} className="text-[color:var(--color-accent)]" />
          </div>
          <span className="text-xl font-bold text-[color:var(--color-text-primary)] tracking-tight">DCRTS</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)] transition-colors"
          >
            Sign In
          </button>
          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="text-sm font-medium text-white px-5 py-2.5 rounded-lg transition-all"
            style={{
              background: "var(--color-accent)",
              border: "1px solid transparent",
            }}
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md mb-8 text-sm font-medium"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-base)",
            color: "var(--color-text-muted)",
          }}
        >
          <span className="w-2 h-2 rounded-full inline-block" style={{background: "var(--color-accent)"}} />
          Now live — Academic Grievance Portal
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6 max-w-5xl text-[color:var(--color-text-primary)]"
        >
          Manage Complaints
          <br />
          <span className="text-[color:var(--color-accent)]">Effortlessly.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          A modern digital portal for academic institutions to submit, track, and resolve 
          complaints — with real-time status updates, role-based dashboards, and priority management.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-14"
        >
          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 text-white font-medium px-8 py-3.5 rounded-lg text-base transition-all"
            style={{ background: "var(--color-accent)" }}
          >
            Start Free <ArrowRight size={18} />
          </motion.button>
          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 text-[color:var(--color-text-primary)] font-medium px-8 py-3.5 rounded-lg text-base transition-all"
            style={{
              background: "var(--color-elevated)",
              border: "1px solid var(--color-border-base)",
            }}
          >
            View Demo
          </motion.button>
        </motion.div>

        {/* Floating Suggestion Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <FloatingBadge text="🏠 Hostel Issues" delay={0.55} />
          <FloatingBadge text="📚 Academic Concerns" delay={0.65} />
          <FloatingBadge text="🔧 Infrastructure" delay={0.75} />
          <FloatingBadge text="💻 Technical Problems" delay={0.85} />
          <FloatingBadge text="⚡ High Priority" delay={0.95} />
        </motion.div>

        {/* Hero Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 w-full max-w-4xl mx-auto relative"
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(15, 22, 41, 0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Window chrome */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div className="ml-4 text-xs text-slate-500 font-mono">dcrts-portal.edu / dashboard</div>
            </div>
            {/* Mock dashboard */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Total Tickets", value: "24", border: "var(--color-border-base)", bg: "var(--color-surface)" },
                  { label: "Pending Review", value: "8", border: "var(--color-border-base)", bg: "var(--color-surface)" },
                  { label: "Resolved", value: "16", border: "var(--color-border-base)", bg: "var(--color-surface)" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="p-4 rounded-xl"
                    style={{ background: card.bg, border: `1px solid ${card.border}` }}
                  >
                    <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
                    <div className="text-xs text-slate-400">{card.label}</div>
                  </div>
                ))}
              </div>
              {/* Mock complaint rows */}
              {[
                { id: "CMP-0024", title: "Wi-Fi down in Block B", status: "Pending", priority: "High", color: "#7c3aed" },
                { id: "CMP-0023", title: "Library AC not working", status: "In Progress", priority: "Medium", color: "#3b82f6" },
                { id: "CMP-0022", title: "Mess food quality issue", status: "Resolved", priority: "Low", color: "#10b981" },
              ].map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between py-3 px-4 mb-2 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-500">{row.id}</span>
                    <span className="text-sm text-slate-300 font-medium">{row.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `${row.color}20`, color: row.color, border: `1px solid ${row.color}40` }}
                    >
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Bottom glow */}
          <div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 blur-3xl"
            style={{ background: "rgba(124,58,237,0.25)" }}
          />
        </motion.div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="relative z-10 px-6 md:px-16 mb-28">
        <div
          className="max-w-4xl mx-auto rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{
            background: "rgba(15, 22, 41, 0.7)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-extrabold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="relative z-10 px-6 md:px-16 mb-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-4">Features</div>
            <h2
              className="text-4xl md:text-5xl font-extrabold text-white mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Everything you need to
              <span className="gradient-text"> resolve faster</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              From submission to closure — a complete workflow built for academic institutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: `0 20px 60px ${f.glow}` }}
                className="p-6 rounded-2xl transition-all duration-300"
                style={{
                  background: "rgba(15, 22, 41, 0.7)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "var(--color-accent-muted)", border: "1px solid var(--color-border-base)", color: "var(--color-accent)" }}
                >
                  <f.icon size={22} className="text-[color:var(--color-accent)]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 px-6 md:px-16 mb-28">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-4">How it works</div>
            <h2
              className="text-4xl md:text-5xl font-extrabold text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Three steps to
              <span className="gradient-text"> resolution</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(59,130,246,0.4), transparent)" }}
            />

            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold text-white mx-auto mb-5"
                  style={{
                    background: "var(--color-accent-muted)",
                    border: "1px solid var(--color-border-base)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative z-10 px-6 md:px-16 mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(59,130,246,0.15) 50%, rgba(6,182,212,0.1) 100%)",
            border: "1px solid rgba(124,58,237,0.3)",
            boxShadow: "0 0 80px rgba(124,58,237,0.1)",
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl"
            style={{ background: "rgba(124,58,237,0.2)" }}
          />
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div
                className="p-4 rounded-2xl"
                style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)" }}
              >
                <ShieldCheck size={32} className="text-violet-400" />
              </div>
            </div>
            <h2
              className="text-4xl md:text-5xl font-extrabold text-white mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Ready to get started?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join hundreds of students and staff who manage their complaints more efficiently with DCRTS.
            </p>
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05, boxShadow: "0 12px 50px rgba(124,58,237,0.6)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 text-white font-bold px-10 py-4 rounded-2xl text-base"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                boxShadow: "0 6px 30px rgba(124,58,237,0.4)",
              }}
            >
              Get Access Now <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer
        className="relative z-10 text-center py-8 text-sm text-slate-600"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck size={16} className="text-violet-500" />
          <span className="font-semibold text-slate-400">DCRTS</span>
        </div>
        <p>Digital Complaint and Resolution Tracking System — Academic Project</p>
      </footer>
    </div>
  );
}
