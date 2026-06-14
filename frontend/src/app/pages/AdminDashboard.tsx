import React, { useEffect, useState } from "react";
import { Check, X, Users, BedDouble, AlertCircle, CalendarOff, CreditCard, Star } from "lucide-react";
import { Glass, StatCard } from "../components/Common";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { apiService } from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  useEffect(() => {
    apiService.getDashboardStats()
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Build occupancy grid from real rooms
  const rooms: any[] = stats?.rooms || [];
  const occupancyGrid = rooms.length > 0
    ? rooms.map((r: any) => ({
        id: r._id,
        label: r.number,
        status: r.status === "Full" ? "occupied" : r.status === "Maintenance" ? "maintenance" : "vacant",
      }))
    : Array.from({ length: 48 }, (_, i) => ({ id: i, label: `${100 + i}`, status: "vacant" }));

  // Build trend data from real complaint trend
  const trendData: any[] = stats?.complaintTrend
    ? (() => {
        const byDay: Record<string, any> = {};
        stats.complaintTrend.forEach(({ _id, count }: any) => {
          if (!byDay[_id.day]) byDay[_id.day] = { day: _id.day };
          byDay[_id.day][_id.cat.toLowerCase()] = count;
        });
        return Object.values(byDay);
      })()
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Admin Overview</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          {user?.name || "Warden"} · {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
      </div>

      {loading ? (
        <div className="text-sm" style={{ color: "#6B7280" }}>Loading stats...</div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          <StatCard label="Total Students" value={stats?.totalStudents ?? "—"} sub="Registered" icon={Users} color="#6366F1" trend="up" />
          <StatCard label="Rooms Occupied" value={stats?.roomsOccupied ?? "—"} sub={`${stats?.occupancyPct ?? 0}% occupancy`} icon={BedDouble} trend="up" />
          <StatCard label="Open Complaints" value={stats?.openComplaints ?? "—"} sub="Open or in progress" color="#F97316" icon={AlertCircle} trend="down" />
          <StatCard label="Pending Leaves" value={stats?.pendingLeaves ?? "—"} sub="Needs approval" color="#F59E0B" icon={CalendarOff} />
          <StatCard label="Fee This Month" value={stats?.feesThisMonth != null ? `₹${(stats.feesThisMonth / 100000).toFixed(1)}L` : "—"} sub={`${stats?.collectionRate ?? 0}% collected`} color="#10B981" icon={CreditCard} trend="up" />
          <StatCard label="Avg Mess Rating" value={stats?.avgMessRating ? `${stats.avgMessRating}★` : "—"} sub="Last 7 days" color="#F59E0B" icon={Star} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Glass className="p-5">
          <h2 className="font-bold text-white mb-4">Pending Actions</h2>
          {stats?.pendingLeaves === 0 ? (
            <p className="text-sm" style={{ color: "#6B7280" }}>No pending actions.</p>
          ) : (
            <p className="text-sm" style={{ color: "#6B7280" }}>
              {stats?.pendingLeaves ?? "—"} leave request{stats?.pendingLeaves !== 1 ? "s" : ""} awaiting approval.
              Go to the Leave Approvals section to review them.
            </p>
          )}
        </Glass>

        <Glass className="p-5">
          <h2 className="font-bold text-white mb-1">Occupancy Map</h2>
          <p className="text-xs mb-4" style={{ color: "#6B7280" }}>
            <span style={{ color: "#00D4AA" }}>■</span> Occupied &nbsp;
            <span style={{ color: "#374151" }}>■</span> Vacant &nbsp;
            <span style={{ color: "#F97316" }}>■</span> Maintenance
          </p>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
            {occupancyGrid.map((r, idx) => (
              <div
                key={r.id || idx}
                title={`Room ${r.label}`}
                className="aspect-square rounded-sm cursor-pointer transition-all duration-150 hover:opacity-80"
                style={{ background: r.status === "occupied" ? "#00D4AA" : r.status === "maintenance" ? "#F97316" : "#1F2937" }}
              />
            ))}
          </div>
        </Glass>
      </div>

      {trendData.length > 0 && (
        <Glass className="p-5">
          <h2 className="font-bold text-white mb-4">Complaint Trends (Last 12 Days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} />
              <Line type="monotone" dataKey="electrical" stroke="#F59E0B" strokeWidth={2} dot={false} name="Electrical" />
              <Line type="monotone" dataKey="plumbing" stroke="#6366F1" strokeWidth={2} dot={false} name="Plumbing" />
              <Line type="monotone" dataKey="maintenance" stroke="#00D4AA" strokeWidth={2} dot={false} name="Maintenance" />
            </LineChart>
          </ResponsiveContainer>
        </Glass>
      )}
    </div>
  );
}
