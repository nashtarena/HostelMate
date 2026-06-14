import React, { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, Bell, UserCheck, CreditCard, Star, AlertCircle } from "lucide-react";
import { Glass, StatCard } from "../components/Common";
import { Screen } from "../types";
import { apiService } from "../services/api";

type StudentDashboardProps = {
  onNavigate: (s: Screen) => void;
};

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const [messTab, setMessTab] = useState<string>("Lunch");
  const [rating, setRating] = useState<number | null>(null);
  const [menu, setMenu] = useState<Record<string, string[]>>({});
  const [fees, setFees] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    Promise.allSettled([
      apiService.getWeekMenu(),
      apiService.getMyFeeSummary(),
      apiService.getNotices(),
    ]).then(([menuRes, feesRes, noticesRes]) => {
      if (menuRes.status === "fulfilled") {
        const today = menuRes.value as any;
        const todayMenu = (today.menus || today)[0] || today;
        if (todayMenu) {
          setMenu({
            Breakfast: todayMenu.breakfast || [],
            Lunch: todayMenu.lunch || [],
            Snacks: todayMenu.snacks || [],
            Dinner: todayMenu.dinner || [],
          });
        }
      }
      if (feesRes.status === "fulfilled") setFees(feesRes.value);
      if (noticesRes.status === "fulfilled") setNotices((noticesRes.value as any).notices || []);
      setLoading(false);
    });
  }, []);

  const mealKeys = Object.keys(menu).length > 0 ? Object.keys(menu) : ["Breakfast", "Lunch", "Snacks", "Dinner"];
  const currentItems = menu[messTab] || [];

  const pendingFee = fees?.pending ?? fees?.totalOutstanding;
  const pendingFeeDisplay = pendingFee != null ? `₹${pendingFee.toLocaleString("en-IN")}` : "—";

  const tickerText = notices.slice(0, 3).map((n: any) => n.title).join(" · ") || "No new notices";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">{greeting}, {firstName} 👋</h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          {user?.room
            ? `Room ${user.room?.number || user.room}${user.block ? ` · Block ${user.block}` : ""}`
            : user?.rollNumber || user?.email || ""}
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Pending Fees"
          value={pendingFeeDisplay}
          sub={fees?.nextDueDate ? `Due ${fees.nextDueDate}` : "Check fees page"}
          icon={CreditCard}
          trend="up"
        />
        <StatCard label="Open Complaints" value="—" sub="View complaints" color="#6366F1" icon={AlertCircle} />
        <StatCard label="Leave Status" value="—" sub="View leaves" color="#10B981" icon={CheckCircle} />
        <StatCard label="Mess Rating" value="—" sub="This week" color="#F59E0B" icon={Star} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Glass className="xl:col-span-3 p-5">
          <h2 className="text-base font-bold text-white mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "My Fees", screen: "fees" as Screen, icon: CreditCard, color: "#00D4AA" },
              { label: "Complaints", screen: "complaints" as Screen, icon: AlertTriangle, color: "#F59E0B" },
              { label: "Leave Request", screen: "leave" as Screen, icon: CheckCircle, color: "#10B981" },
              { label: "Notices", screen: "notices" as Screen, icon: Bell, color: "#6366F1" },
            ].map(({ label, screen, icon: Icon, color }) => (
              <button key={label} onClick={() => onNavigate(screen)}
                className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}20` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <span className="text-sm font-semibold text-white">{label}</span>
              </button>
            ))}
          </div>
        </Glass>

        <Glass className="xl:col-span-2 p-5">
          <h2 className="text-base font-bold text-white mb-4">Today's Mess Menu</h2>
          {loading ? (
            <p className="text-sm" style={{ color: "#6B7280" }}>Loading menu...</p>
          ) : (
            <>
              <div className="flex gap-1 mb-4 flex-wrap">
                {mealKeys.map(t => (
                  <button key={t} onClick={() => setMessTab(t)}
                    className="px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200"
                    style={{
                      color: messTab === t ? "#00D4AA" : "#6B7280",
                      borderBottom: messTab === t ? "2px solid #00D4AA" : "2px solid transparent",
                    }}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-5 min-h-12">
                {currentItems.length > 0
                  ? currentItems.map((item, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(255,255,255,0.06)", color: "#D1D5DB" }}>{item}</span>
                  ))
                  : <span className="text-xs" style={{ color: "#6B7280" }}>No menu available</span>
                }
              </div>
            </>
          )}
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
            {tickerText}
          </div>
        </div>
        <style>{`@keyframes ticker { from { transform: translateX(100%); } to { transform: translateX(-100%); } }`}</style>
      </div>
    </div>
  );
}
