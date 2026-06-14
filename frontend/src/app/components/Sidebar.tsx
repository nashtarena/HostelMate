import React from "react";
import {
  LayoutDashboard, BedDouble, AlertCircle, CalendarOff, CreditCard,
  UtensilsCrossed, Users, SplitSquareHorizontal, Bell, Heart,
  Building2, BarChart2, UserCheck, LogOut, Home, GraduationCap, UsersRound
} from "lucide-react";
import { Screen, Role } from "../types";

const navItemsStudent = [
  { id: "dashboard",  label: "Dashboard",        icon: LayoutDashboard },
  { id: "room",       label: "My Room",           icon: BedDouble },
  { id: "complaints", label: "Complaints",        icon: AlertCircle },
  { id: "leave",      label: "Leave Request",     icon: CalendarOff },
  { id: "fees",       label: "Fee & Billing",     icon: CreditCard },
  { id: "mess",       label: "Mess Menu",         icon: UtensilsCrossed },
  { id: "visitors",   label: "Visitors",          icon: Users },
  { id: "expenses",   label: "Expense Splitter",  icon: SplitSquareHorizontal },
  { id: "notices",    label: "Notices",           icon: Bell },
  { id: "roommate",   label: "Roommate Match",    icon: Heart },
];

// Parents can only see their child's info — read-only views
const navItemsParent = [
  { id: "dashboard",  label: "Dashboard",         icon: LayoutDashboard },
  { id: "notices",    label: "Notices",           icon: Bell },
  { id: "fees",       label: "Fee Status",        icon: CreditCard },
  { id: "leave",      label: "Leave Status",      icon: CalendarOff },
  { id: "visitors",   label: "Visitors",          icon: Users },
];

const navItemsWarden = [
  { id: "admin-dashboard", label: "Overview",        icon: LayoutDashboard },
  { id: "admin-rooms",     label: "Room Management", icon: Building2 },
  { id: "admin-students",  label: "Students",        icon: GraduationCap },
  { id: "admin-parents",   label: "Parents",         icon: UsersRound },
  { id: "complaints",      label: "Complaints",      icon: AlertCircle },
  { id: "leave",           label: "Leave Approvals", icon: CalendarOff },
  { id: "fees",            label: "Fee Management",  icon: CreditCard },
  { id: "mess",            label: "Mess Analytics",  icon: BarChart2 },
  { id: "notices",         label: "Notices",         icon: Bell },
  { id: "visitors",        label: "Visitors Log",    icon: UserCheck },
];

function navItemsForRole(role: Role) {
  if (role === "warden" || role === "admin") return navItemsWarden;
  if (role === "parent") return navItemsParent;
  return navItemsStudent;
}

export const Sidebar = ({ screen, onNavigate, role, onLogout }: {
  screen: Screen; onNavigate: (s: Screen) => void; role: Role; onLogout: () => void;
}) => {
  const items = navItemsForRole(role);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = storedUser.name ? storedUser.name.split(" ").slice(0, 2).join(" ") : role;
  const initials = storedUser.name
    ? storedUser.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : role.slice(0, 2).toUpperCase();

  const roleColor = role === "warden" || role === "admin"
    ? { bg: "rgba(0,212,170,0.2)", text: "#00D4AA" }
    : role === "parent"
    ? { bg: "rgba(245,158,11,0.2)", text: "#F59E0B" }
    : { bg: "rgba(99,102,241,0.2)", text: "#818CF8" };

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col z-30"
      style={{ width: 240, background: "#111827", borderRight: "1px solid rgba(255,255,255,0.06)" }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#00D4AA" }}>
          <Home size={16} style={{ color: "#0A0F1E" }} />
        </div>
        <span className="font-bold text-white text-lg">HostelMate</span>
        <div className="w-2 h-2 rounded-full ml-auto" style={{ background: "#00D4AA" }} />
      </div>

      {/* User */}
      <button
        onClick={() => onNavigate("profile")}
        className="flex items-center gap-3 px-5 py-4 border-b hover:bg-white/5 transition-colors"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
          style={{ background: "linear-gradient(135deg,#00D4AA,#6366F1)", color: "#fff" }}>
          {initials}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-white">{displayName}</span>
          <span className="text-xs px-2 py-0.5 rounded-full mt-0.5 capitalize"
            style={{ background: roleColor.bg, color: roleColor.text }}>
            {role}
          </span>
        </div>
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {items.map(({ id, label, icon: Icon }) => {
          const active = screen === id;
          return (
            <button key={id} onClick={() => onNavigate(id as Screen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all duration-200"
              style={{
                background: active ? "rgba(0,212,170,0.1)" : "transparent",
                color: active ? "#00D4AA" : "#6B7280",
                borderLeft: active ? "2px solid #00D4AA" : "2px solid transparent",
              }}>
              <Icon size={17} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-500/10"
          style={{ color: "#EF4444" }}>
          <LogOut size={17} />Logout
        </button>
      </div>
    </aside>
  );
};

export default {};
