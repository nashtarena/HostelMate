import React from "react";
import { Check, X, Users, BedDouble, AlertCircle, CalendarOff, CreditCard, Star } from "lucide-react";
import { Glass, StatCard } from "../components/Common";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const trendData = Array.from({ length: 12 }, (_, i) => ({ day: `Jun ${i + 1}`, electrical: Math.floor(Math.random() * 5) + 1, plumbing: Math.floor(Math.random() * 4) + 1, maintenance: Math.floor(Math.random() * 3) + 1 }));

export default function AdminDashboard() {
  const rooms = Array.from({ length: 48 }, (_, i) => ({ id: i + 1, status: i < 35 ? "occupied" : i < 42 ? "vacant" : "maintenance" }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Admin Overview</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>June 2024 · Block B Warden</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard label="Total Students" value="142" sub="+3 this month" icon={Users} color="#6366F1" trend="up" />
        <StatCard label="Rooms Occupied" value="47/56" sub="84% occupancy" icon={BedDouble} trend="up" />
        <StatCard label="Open Complaints" value="8" sub="3 urgent" color="#F97316" icon={AlertCircle} trend="down" />
        <StatCard label="Pending Leaves" value="6" sub="Needs approval" color="#F59E0B" icon={CalendarOff} />
        <StatCard label="Fee This Month" value="₹5.8L" sub="92% collected" color="#10B981" icon={CreditCard} trend="up" />
        <StatCard label="Avg Mess Rating" value="4.1★" sub="Last 7 days" color="#F59E0B" icon={Star} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Glass className="p-5">
          <h2 className="font-bold text-white mb-4">Pending Actions</h2>
          <div className="flex flex-col gap-3">
            {[{ name: "Priya Sharma", type: "Leave Request", date: "Jun 12–15", dest: "Bengaluru" }, { name: "Arun Mehta", type: "Leave Request", date: "Jun 18–20", dest: "Hyderabad" }, { name: "Complaint #18", type: "Assign Technician", date: "Electrical · Fan broken", dest: "Room 307" }].map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm">{a.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{a.type} · {a.date}</div>
                  <div className="text-xs" style={{ color: "#6B7280" }}>{a.dest}</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}><Check size={14} style={{ color: "#10B981" }} /></button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}><X size={14} style={{ color: "#EF4444" }} /></button>
                </div>
              </div>
            ))}
          </div>
        </Glass>

        <Glass className="p-5">
          <h2 className="font-bold text-white mb-1">Occupancy Map</h2>
          <p className="text-xs mb-4" style={{ color: "#6B7280" }}>
            <span style={{ color: "#00D4AA" }}>■</span> Occupied &nbsp;
            <span style={{ color: "#374151" }}>■</span> Vacant &nbsp;
            <span style={{ color: "#F97316" }}>■</span> Maintenance
          </p>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
            {rooms.map((r) => (
              <div key={r.id} title={`Room ${100 + r.id}`} className="aspect-square rounded-sm cursor-pointer transition-all duration-150 hover:opacity-80" style={{ background: r.status === "occupied" ? "#00D4AA" : r.status === "maintenance" ? "#F97316" : "#1F2937" }} />
            ))}
          </div>
        </Glass>
      </div>

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
    </div>
  );
}
