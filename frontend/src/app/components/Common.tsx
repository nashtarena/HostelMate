import React, { useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, X } from "lucide-react";

export const Glass = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl border ${className}`}
    style={{
      background: "rgba(255,255,255,0.04)",
      borderColor: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(12px)",
    }}
  >
    {children}
  </div>
);

export const StatCard = ({
  label, value, sub, color = "#00D4AA", icon: Icon, trend
}: {
  label: string; value: string; sub?: string; color?: string;
  icon?: React.ElementType; trend?: "up" | "down";
}) => (
  <Glass className="p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1 cursor-default">
    <div className="flex items-start justify-between">
      <span className="text-sm" style={{ color: "#6B7280" }}>{label}</span>
      {Icon && (
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={16} style={{ color }} />
        </div>
      )}
    </div>
    <div className="text-2xl font-bold" style={{ color, fontFamily: "JetBrains Mono, monospace" }}>{value}</div>
    {sub && (
      <div className="flex items-center gap-1 text-xs" style={{ color: "#6B7280" }}>
        {trend === "up" && <ArrowUpRight size={12} style={{ color: "#10B981" }} />}
        {trend === "down" && <ArrowDownRight size={12} style={{ color: "#EF4444" }} />}
        {sub}
      </div>
    )}
  </Glass>
);

export const Badge = ({ label, variant = "teal" }: { label: string; variant?: "teal" | "indigo" | "green" | "red" | "yellow" | "gray" | "orange" }) => {
  const colors: Record<string, string> = {
    teal: "rgba(0,212,170,0.15)", indigo: "rgba(99,102,241,0.15)",
    green: "rgba(16,185,129,0.15)", red: "rgba(239,68,68,0.15)",
    yellow: "rgba(245,158,11,0.15)", gray: "rgba(107,114,128,0.15)",
    orange: "rgba(249,115,22,0.15)",
  };
  const text: Record<string, string> = {
    teal: "#00D4AA", indigo: "#818CF8", green: "#10B981",
    red: "#EF4444", yellow: "#F59E0B", gray: "#9CA3AF", orange: "#FB923C",
  };
  return (
    <span className="text-xs font-medium px-2 py-1 rounded-full"
      style={{ background: colors[variant], color: text[variant] }}>
      {label}
    </span>
  );
};

export const Pill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
    style={{
      background: active ? "#00D4AA" : "rgba(255,255,255,0.05)",
      color: active ? "#0A0F1E" : "#9CA3AF",
      border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
    }}
  >
    {label}
  </button>
);

export const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error" | "warning"; onClose: () => void }) => {
  const colors = { success: "#00D4AA", error: "#EF4444", warning: "#F59E0B" };
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-right"
      style={{ background: "#111827", border: `1px solid ${colors[type]}40`, minWidth: 280 }}>
      <div className="w-2 h-2 rounded-full" style={{ background: colors[type] }} />
      <span className="text-sm text-white flex-1">{message}</span>
      <button onClick={onClose}><X size={14} style={{ color: "#6B7280" }} /></button>
    </div>
  );
};

export const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
    <div className="w-full max-w-lg rounded-2xl p-6" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
          <X size={16} style={{ color: "#6B7280" }} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export const Field = ({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium" style={{ color: "#9CA3AF" }}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-1 transition-all"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        fontFamily: "Inter, sans-serif",
      }}
    />
  </div>
);

export default {};
