import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import {
  FileText, Send, Activity, Inbox, PlusCircle, LayoutList,
  CheckCircle2, Clock, AlertCircle, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

/* ─── Skeleton Loader ─── */
const SkeletonCard = () => (
  <div
    className="rounded-2xl p-6 overflow-hidden"
    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-base)" }}
  >
    <div className="skeleton h-3 w-24 mb-4 rounded-full" />
    <div className="skeleton h-8 w-16 mb-2 rounded-lg" />
    <div className="skeleton h-2 w-32 rounded-full" />
  </div>
);

const SkeletonComplaint = () => (
  <div
    className="rounded-2xl p-5 overflow-hidden"
    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-base)" }}
  >
    <div className="flex gap-3 mb-4">
      <div className="skeleton h-5 w-14 rounded-full" />
      <div className="skeleton h-5 w-20 rounded-full" />
    </div>
    <div className="skeleton h-5 w-3/4 mb-2 rounded" />
    <div className="skeleton h-3 w-full mb-1 rounded" />
    <div className="skeleton h-3 w-2/3 rounded" />
  </div>
);

/* ─── Timeline Node ─── */
const TimelineNode = ({ label, subtext, active, final, color }) => (
  <div className="flex items-start gap-3">
    <div className="flex flex-col items-center">
      <div
        className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5 transition-all"
        style={{
          background: active ? color : "rgba(255,255,255,0.08)",
          boxShadow: active ? `0 0 8px ${color}80` : "none",
          border: `2px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
        }}
      />
      {!final && (
        <div
          className="w-px h-8 mt-1"
          style={{
            background: active
              ? `linear-gradient(to bottom, ${color}, rgba(255,255,255,0.08))`
              : "rgba(255,255,255,0.06)",
          }}
        />
      )}
    </div>
    <div className="pb-6">
      <p
        className="text-sm font-semibold leading-none"
        style={{ color: active ? "#e2e8f0" : "rgba(255,255,255,0.25)" }}
      >
        {label}
      </p>
      {subtext && (
        <p className="text-xs mt-1" style={{ color: active ? color : "rgba(255,255,255,0.2)" }}>
          {subtext}
        </p>
      )}
    </div>
  </div>
);

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") === "submit" ? "submit" : "track";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "", priority: "", description: "" });

  useEffect(() => {
    const tabFromUrl = queryParams.get("tab");
    if (tabFromUrl === "submit" || tabFromUrl === "track") setActiveTab(tabFromUrl);
  }, [location.search]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints/me");
      setComplaints(res.data);
    } catch {
      toast.error("Failed to load complaints");
    } finally {
      setInitialLoading(false);
    }
  };

  const verifyComplaint = async (id, isResolved) => {
    try {
      await api.put(`/complaints/${id}/verify`, { verified: isResolved });
      if (isResolved) {
        toast.success("Complaint archived successfully!");
        setComplaints(complaints.filter((c) => c.db_id !== id));
      } else {
        toast.success("Complaint reopened.");
        setComplaints(complaints.map((c) => c.db_id === id ? { ...c, status: "Reopened" } : c));
      }
    } catch {
      toast.error("Verification failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/complaints", formData);
      toast.success("Ticket submitted successfully!");
      setFormData({ title: "", category: "", priority: "", description: "" });
      fetchComplaints();
      navigate("/dashboard?tab=track");
    } catch {
      toast.error("Submission failed. Ensure all fields are filled.");
    } finally {
      setLoading(false);
    }
  };

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;

  const statCards = [
    {
      label: "Total Submissions",
      value: total,
      icon: FileText,
      color: "var(--color-text-primary)",
    },
    {
      label: "Pending Review",
      value: pending,
      icon: Clock,
      color: "var(--color-status-pending)",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Activity,
      color: "var(--color-status-progress)",
    },
    {
      label: "Resolved",
      value: resolved,
      icon: CheckCircle2,
      color: "var(--color-status-resolved)",
    },
  ];

  return (
    <DashboardLayout user={user} title="My Dashboard">

      {/* ─── Welcome Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h2
            className="text-2xl font-bold text-slate-100"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Good day, {user?.name?.split(" ")[0] || "User"} 👋
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Track and manage your submitted complaints below.
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard?tab=submit")}
          className="hidden sm:flex"
        >
          <PlusCircle size={15} /> New Ticket
        </Button>
      </motion.div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {initialLoading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl p-5 transition-all duration-300 cursor-default"
              style={{
                border: "1px solid var(--color-border-base)",
                background: "var(--color-surface)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </p>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
                >
                  <card.icon size={16} style={{ color: card.color }} />
                </div>
              </div>
              <div
                className="text-3xl font-extrabold"
                style={{ color: card.color }}
              >
                {card.value}
              </div>
              <div
                className="text-xs mt-2 font-medium"
                style={{ color: `${card.color}80` }}
              >
                complaints
              </div>
            </motion.div>
          ))}
      </div>

      {/* ─── Tabs ─── */}
      <div
        className="flex p-1 rounded-2xl w-fit mb-8"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {[
          { key: "track", label: "Track Issues", icon: LayoutList },
          { key: "submit", label: "Submit New", icon: PlusCircle },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => navigate(`/dashboard?tab=${tab.key}`)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={
              activeTab === tab.key
                ? {
                    background: "var(--color-elevated)",
                    border: "1px solid var(--color-border-base)",
                    color: "var(--color-text-primary)",
                  }
                : {
                    color: "var(--color-text-muted)",
                    border: "1px solid transparent",
                  }
            }
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Content ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Submit Form */}
          {activeTab === "submit" ? (
            <Card className="max-w-3xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(124,58,237,0.15)",
                      border: "1px solid rgba(124,58,237,0.3)",
                    }}
                  >
                    <Send size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <CardTitle>Lodge a Formal Complaint</CardTitle>
                    <CardDescription>
                      Fill in the details. Our team prioritizes by category and urgency.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400">Subject / Title</label>
                    <Input
                      required
                      placeholder="E.g. Wi-Fi router down in Block B"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-400">Category</label>
                      <Select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="" disabled>Select category</option>
                        <option value="Hostel">🏠 Hostel</option>
                        <option value="Academics">📚 Academics</option>
                        <option value="Infrastructure">🏗️ Infrastructure</option>
                        <option value="Technical">💻 Technical</option>
                        <option value="General">📋 General / Other</option>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-400">Priority Level</label>
                      <div className="flex gap-2">
                        {[
                          { label: "Low", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
                          { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
                          { label: "High", color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
                        ].map((p) => (
                          <label
                            key={p.label}
                            className="flex-1 flex items-center justify-center py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
                            style={
                              formData.priority === p.label
                                ? {
                                    background: p.bg,
                                    border: `1px solid ${p.border}`,
                                    color: p.color,
                                    boxShadow: `0 0 12px ${p.color}30`,
                                  }
                                : {
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    color: "#475569",
                                  }
                            }
                          >
                            <input
                              type="radio"
                              name="priority"
                              value={p.label}
                              className="hidden"
                              onClick={(e) => setFormData({ ...formData, priority: e.target.value })}
                              required
                            />
                            {p.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400">Detailed Description</label>
                    <Textarea
                      required
                      placeholder="Please describe the nature and impact of your concern in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div
                    className="flex justify-end gap-3 pt-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setFormData({ title: "", category: "", priority: "", description: "" })}
                    >
                      Clear
                    </Button>
                    <Button type="submit" isLoading={loading}>
                      Submit Ticket <Send size={14} />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            /* Track Tab */
            <div className="space-y-4">
              {initialLoading ? (
                Array(3).fill(0).map((_, i) => <SkeletonComplaint key={i} />)
              ) : complaints.length === 0 ? (
                /* Empty state */
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-24 text-center rounded-3xl flex flex-col items-center"
                  style={{
                    background: "var(--color-elevated)",
                    border: "1px dashed var(--color-border-base)",
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
                    style={{
                      background: "var(--color-accent-muted)",
                      border: "1px solid var(--color-border-base)",
                    }}
                  >
                    <Inbox size={36} className="text-[color:var(--color-accent)]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-300 mb-2">No tickets yet</h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto mb-6">
                    You haven't submitted any complaints. When you do, they'll appear here with tracking.
                  </p>
                  <Button onClick={() => navigate("/dashboard?tab=submit")}>
                    <PlusCircle size={15} /> Lodge your first complaint
                  </Button>
                </motion.div>
              ) : (
                complaints.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border-base)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border = "1px solid var(--color-border-subtle)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border = "1px solid var(--color-border-base)";
                    }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Left: Info */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge variant={c.priority}>{c.priority}</Badge>
                          <span
                            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              color: "#475569",
                            }}
                          >
                            {c.category}
                          </span>
                          <span className="text-xs font-mono ml-auto" style={{ color: "#334155" }}>
                            {c.id}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 mb-2 leading-snug">
                          {c.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                          {c.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-600 font-medium">Filed on {c.date}</span>
                          <Badge variant={c.status}>{c.status}</Badge>
                        </div>
                      </div>

                      {/* Right: Timeline */}
                      <div
                        className="md:w-56 p-6"
                        style={{
                          borderLeft: "1px solid rgba(255,255,255,0.05)",
                          background: "rgba(255,255,255,0.01)",
                        }}
                      >
                        <h4
                          className="text-[10px] font-semibold uppercase tracking-widest mb-5"
                          style={{ color: "#334155" }}
                        >
                          Resolution Tracker
                        </h4>
                        <TimelineNode
                          label="Submitted"
                          subtext="Ticket received."
                          active={true}
                          color="#10b981"
                        />
                        <TimelineNode
                          label="In Progress"
                          subtext={c.status === "In Progress" || c.status === "Reopened" ? "Team actively working." : null}
                          active={c.status === "In Progress" || c.status === "Resolved" || c.status === "Reopened"}
                          color="#3b82f6"
                        />
                        <TimelineNode
                          label="Resolved"
                          subtext={c.status === "Resolved" ? "Pending user verification" : null}
                          active={c.status === "Resolved"}
                          color="#10b981"
                          final
                        />
                      </div>
                    </div>

                    {/* Verification Prompt for Resolved Tickets */}
                    {c.status === "Resolved" && c.user_verified === false && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                        style={{
                          background: "rgba(16, 185, 129, 0.05)",
                          borderTop: "1px solid rgba(16, 185, 129, 0.2)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full" style={{ background: "rgba(16,185,129,0.15)" }}>
                            <CheckCircle2 size={18} className="text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-emerald-100">Has your issue been resolved?</p>
                            <p className="text-xs text-emerald-500/70">
                              Please verify so we can close this ticket permanently.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="primary"
                            className="bg-emerald-600 hover:bg-emerald-500 !shadow-emerald-900/50"
                            onClick={() => verifyComplaint(c.db_id, true)}
                          >
                            Yes, Archive
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => verifyComplaint(c.db_id, false)}
                          >
                            No, Reopen
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default UserDashboard;
