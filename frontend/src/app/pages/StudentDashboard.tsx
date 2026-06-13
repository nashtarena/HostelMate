import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Bell, UserCheck, CreditCard, Star } from "lucide-react";
import { Glass, StatCard, Badge } from "../components/Common";
import { Screen } from "../types";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

type StudentDashboardProps = {
  onNavigate: (s: Screen) => void;
};

const activityData = [
  { icon: CheckCircle, color: "#10B981", text: "Complaint #12 resolved", time: "2h ago" },
  { icon: AlertTriangle, color: "#F59E0B", text: "Fee due in 3 days", time: "Today" },
  { icon: Bell, color: "#6366F1", text: "New notice pinned", time: "Yesterday" },
  { icon: UserCheck, color: "#00D4AA", text: "Visitor Rahul checked in", time: "2d ago" },
  { icon: CreditCard, color: "#10B981", text: "₹4,200 payment confirmed", time: "3d ago" },
];

const messMenu = {
  Breakfast: ["Idli Sambar", "Poha", "Boiled Eggs", "Toast & Butter", "Chai"],
  Lunch: ["Dal Tadka", "Aloo Gobi", "Jeera Rice", "Roti", "Salad", "Buttermilk"],
  Snacks: ["Samosa", "Chai", "Bread Pakora", "Banana"],
  Dinner: ["Paneer Butter Masala", "Chapati", "Rice", "Dal Fry", "Kheer"],
};

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const [messTab, setMessTab] = useState<keyof typeof messMenu>("Lunch");
  const [rating, setRating] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Good morning, Natasha 👋</h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>Room 204 · Block B · 2 roommates</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Pending Fees" value="₹4,200" sub="Due Jul 1" icon={CreditCard} trend="up" />
        <StatCard label="Open Complaints" value="2" sub="2 in progress" color="#6366F1" icon={AlertCircle} />
        <StatCard label="Leave Status" value="Approved" sub="Jun 12–15" color="#10B981" icon={CheckCircle} />
        <StatCard label="Mess Rating" value="4.2★" sub="This week" color="#F59E0B" icon={Star} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Glass className="xl:col-span-3 p-5">
          <h2 className="text-base font-bold text-white mb-4">Recent Activity</h2>
          <div className="flex flex-col gap-3">
            {activityData.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}20` }}>
                    <item.icon size={15} style={{ color: item.color }} />
                  </div>
                  {i < activityData.length - 1 && (
                    <div className="w-px h-6 mt-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-white">{item.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Glass>

        <Glass className="xl:col-span-2 p-5">
          <h2 className="text-base font-bold text-white mb-4">Today's Mess Menu</h2>
          <div className="flex gap-1 mb-4 flex-wrap">
            {(Object.keys(messMenu) as (keyof typeof messMenu)[]).map(t => (
              <button key={t} onClick={() => setMessTab(t)}
                className="px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200"
                style={{
                  background: messTab === t ? "transparent" : "transparent",
                  color: messTab === t ? "#00D4AA" : "#6B7280",
                  borderBottom: messTab === t ? "2px solid #00D4AA" : "2px solid transparent",
                }}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            {messMenu[messTab].map((item, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.06)", color: "#D1D5DB" }}>{item}</span>
            ))}
          </div>
          <div>
            <p className="text-xs mb-2" style={{ color: "#6B7280" }}>Rate Today's Meal</p>
            <div className="flex gap-2">
              {["😍", "😊", "😐", "😕", "😤"].map((e, i) => (
                <button key={i} onClick={() => setRating(i)}
                  className="text-2xl transition-transform duration-150 hover:scale-125"
                  style={{ opacity: rating === null || rating === i ? 1 : 0.4 }}>
                  {e}
                </button>
              ))}
            </div>
          </div>
        </Glass>
      </div>

      <div className="flex items-center gap-4 rounded-xl px-5 py-3 overflow-hidden"
        style={{ background: "#1F2937", border: "1px solid rgba(245,158,11,0.2)" }}>
        <span className="text-xs font-bold flex-shrink-0" style={{ color: "#F59E0B" }}>📢 NOTICE:</span>
        <div className="overflow-hidden flex-1">
          <div className="text-sm whitespace-nowrap" style={{ color: "#D1D5DB", animation: "ticker 20s linear infinite" }}>
            Hostel fee payment deadline is July 1st · Inter-hostel sports meet on June 20th · Library closed on June 15th for maintenance
          </div>
        </div>
        <style>{`@keyframes ticker { from { transform: translateX(100%); } to { transform: translateX(-100%); } }`}</style>
      </div>
    </div>
  );
}
