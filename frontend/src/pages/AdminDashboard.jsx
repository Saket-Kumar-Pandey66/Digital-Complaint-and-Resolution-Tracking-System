import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import {
  Activity, Search, Filter, ShieldAlert, CheckCircle, Users,
  TrendingUp, Clock, FileText, Layers
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

/* ─── Skeleton ─── */
const SkeletonStat = () => (
  <div
    className="rounded-2xl p-5"
    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-base)" }}
  >
    <div className="skeleton h-3 w-20 mb-3 rounded-full" />
    <div className="skeleton h-7 w-12 rounded-lg" />
  </div>
);

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-xl text-sm font-medium"
        style={{
          background: "var(--color-elevated)",
          border: "1px solid var(--color-border-base)",
          color: "var(--color-text-primary)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ color: payload[0].payload.color || payload[0].color }}>●</span>{" "}
        {payload[0].name}: <strong>{payload[0].value}</strong>
      </div>
    );
  }
  return null;
};

const CATEGORY_COLORS = {
  Hostel: "#7c3aed",
  Academics: "#3b82f6",
  Infrastructure: "#f59e0b",
  Technical: "#10b981",
  General: "#ec4899",
};

const STATUS_COLORS = {
  Pending: "#f59e0b",
  "In Progress": "#3b82f6",
  Resolved: "#10b981",
};

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [initialLoading, setInitialLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints");
      setComplaints(res.data);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setInitialLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.put(`/complaints/${id}/status`, { status: newStatus });
      toast.success("Status updated!");
      setComplaints((prev) =>
        prev.map((c) => (c.db_id === id ? { ...c, status: newStatus } : c))
      );
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const reopened = complaints.filter((c) => c.status === "Reopened").length;

  // Chart data
  const statusChartData = [
    { name: "Pending", value: pending, color: "#f59e0b" },
    { name: "In Progress", value: inProgress, color: "#3b82f6" },
    { name: "Resolved", value: resolved, color: "#10b981" },
    { name: "Reopened", value: reopened, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const categoryMap = {};
  complaints.forEach((c) => {
    categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
  });
  const categoryChartData = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
    color: CATEGORY_COLORS[name] || "#8b5cf6",
  }));

  // Filtered
  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchCategory = categoryFilter === "All" || c.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const statCards = [
    { label: "Total Tickets", value: total, icon: FileText, color: "var(--color-text-primary)" },
    { label: "Pending", value: pending, icon: ShieldAlert, color: "var(--color-status-pending)" },
    { label: "In Progress", value: inProgress, icon: Users, color: "var(--color-status-progress)" },
    { label: "Resolved", value: resolved, icon: CheckCircle, color: "var(--color-status-resolved)" },
    { label: "Reopened", value: reopened, icon: ShieldAlert, color: "var(--color-status-rejected)" },
  ];

  return (
    <DashboardLayout user={user} title="Admin Overview">

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {initialLoading
          ? Array(4).fill(0).map((_, i) => <SkeletonStat key={i} />)
          : statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }}
              className="rounded-xl p-5 transition-all duration-300"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-base)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  {card.label}
                </p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
                >
                  <card.icon size={14} style={{ color: card.color }} />
                </div>
              </div>
              <div className="text-3xl font-extrabold" style={{ color: card.color }}>
                {card.value}
              </div>
            </motion.div>
          ))}
      </div>

      {/* ─── Charts Row ─── */}
      {complaints.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Pie: Status distribution */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-violet-400" />
                <CardTitle className="text-base">Status Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {statusChartData.map((d) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-sm text-slate-400">{d.name}</span>
                      <span className="text-sm font-bold ml-auto" style={{ color: d.color }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bar: Category breakdown */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-blue-400" />
                <CardTitle className="text-base">Complaints by Category</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={categoryChartData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#475569", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#475569" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Tickets" radius={[4, 4, 0, 0]}>
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Main Table ─── */}
      <Card>
        {/* Toolbar */}
        <div
          className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-full md:w-1/3">
            <Input
              icon={Search}
              placeholder="Search ticket, title, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-600" />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-[140px] !px-3 !py-2 text-xs"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Reopened">Reopened</option>
              </Select>
            </div>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-[150px] !px-3 !py-2 text-xs"
            >
              <option value="All">All Categories</option>
              <option value="Hostel">Hostel</option>
              <option value="Academics">Academics</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Technical">Technical</option>
              <option value="General">General</option>
            </Select>
            <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[110px]">Ticket ID</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Issue Details</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right w-[200px]">Status & Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  {Array(6).fill(0).map((_, j) => (
                    <TableCell key={j}>
                      <div className="skeleton h-4 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-600">
                    <Search size={24} />
                    <span className="text-sm font-medium">No tickets match your filters</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <span
                      className="font-mono text-xs font-semibold px-2 py-1 rounded-lg"
                      style={{
                        background: "rgba(124,58,237,0.1)",
                        border: "1px solid rgba(124,58,237,0.2)",
                        color: "#a78bfa",
                      }}
                    >
                      {c.id}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.2))",
                          color: "#a78bfa",
                        }}
                      >
                        {c.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-200">{c.name}</div>
                        <div className="text-xs text-slate-600">{c.email}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-[260px]">
                    <div className="text-sm font-semibold text-slate-200 line-clamp-1 mb-1">
                      {c.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          background: `${CATEGORY_COLORS[c.category] || "#8b5cf6"}18`,
                          color: CATEGORY_COLORS[c.category] || "#8b5cf6",
                        }}
                      >
                        {c.category}
                      </span>
                      <span className="text-xs text-slate-600 line-clamp-1">{c.description}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={c.priority}>{c.priority}</Badge>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-slate-600 font-medium whitespace-nowrap">{c.date}</span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={c.status}>{c.status}</Badge>
                      <Select
                        value={c.status}
                        disabled={updatingId === c.db_id}
                        onChange={(e) => updateStatus(c.db_id, e.target.value)}
                        className="w-[160px] !px-2.5 !py-1.5 text-xs text-slate-400"
                      >
                        <option value="Pending">→ Mark Pending</option>
                        <option value="In Progress">→ Mark In Progress</option>
                        <option value="Resolved">→ Mark Resolved</option>
                        {c.status === "Reopened" && <option value="Reopened" hidden>Reopened</option>}
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </DashboardLayout>
  );
};

export default AdminDashboard;
