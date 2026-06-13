import React, { useState } from "react";
import { Plus, QrCode, X, MapPin, Home } from "lucide-react";
import { Glass, Pill, Badge, Field } from "../components/Common";

const leaveRequests = [
  { from: "Jun 12", to: "Jun 15", dest: "Bengaluru", reason: "Family function — sister's wedding ceremony", status: "Approved", approved: true },
  { from: "Jul 4", to: "Jul 6", dest: "Chennai", reason: "Medical appointment follow-up at Apollo Hospital", status: "Pending", approved: false },
  { from: "May 20", to: "May 22", dest: "Mysuru", reason: "College inter-zonal cultural event participation", status: "Approved", approved: true },
];

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [showPanel, setShowPanel] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const statusVariant = (s: string) => s === "Approved" ? "green" : s === "Pending" ? "yellow" : "red";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Leave Requests</h1>
        <button onClick={() => setShowPanel(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#00D4AA", color: "#0A0F1E" }}>
          <Plus size={16} />Apply for Leave
        </button>
      </div>

      <div className="flex gap-2">
        {( ["active", "past"] as const).map(t => (
          <Pill key={t} label={t === "active" ? "Active Requests" : "Past Requests"} active={activeTab === t} onClick={() => setActiveTab(t)} />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {leaveRequests.map((l, i) => (
          <Glass key={i} className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-lg font-bold text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  {l.from} <span style={{ color: "#6B7280" }}>→</span> {l.to}
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm" style={{ color: "#6B7280" }}>
                  <MapPin size={12} />{l.dest}
                </div>
                <p className="text-sm mt-2" style={{ color: "#9CA3AF" }}>{l.reason}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge label={l.status} variant={statusVariant(l.status) as any} />
                {l.approved && (
                  <button onClick={() => setShowQR(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-teal-500/10" style={{ border: "1px solid rgba(0,212,170,0.3)", color: "#00D4AA" }}>
                    <QrCode size={12} />View Gate Pass
                  </button>
                )}
              </div>
            </div>
          </Glass>
        ))}
      </div>

      {showQR && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}>
          <div className="w-80 rounded-2xl p-8 flex flex-col items-center gap-4 text-center" style={{ background: "#F9FAFB", color: "#111827" }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#00D4AA" }}>
                <Home size={14} style={{ color: "#0A0F1E" }} />
              </div>
              <span className="font-bold">HostelMate</span>
            </div>
            <div className="text-xs font-bold tracking-widest" style={{ color: "#6B7280" }}>DIGITAL GATE PASS</div>
            <div>
              <div className="font-bold text-lg">Natasha Avery</div>
              <div className="text-sm mt-1" style={{ color: "#6B7280" }}>Room 204 · Block B · CS2021045</div>
            </div>
            <div className="text-sm" style={{ color: "#374151" }}>
              <div>Jun 12 → Jun 15, 2024</div>
              <div className="text-xs mt-1" style={{ color: "#9CA3AF" }}>Approved by Dr. Ramesh Kumar</div>
            </div>
            <div className="w-32 h-32 rounded-xl flex items-center justify-center" style={{ background: "#E5E7EB" }}>
              <QrCode size={64} style={{ color: "#111827" }} />
            </div>
            <div className="text-xs" style={{ color: "#9CA3AF" }}>Valid until Jun 15, 2024</div>
            <button onClick={() => setShowQR(false)} className="w-full py-2 rounded-xl text-sm font-bold" style={{ background: "#0A0F1E", color: "#fff" }}>Close</button>
          </div>
        </div>
      )}

      {showPanel && (
        <div className="fixed inset-0 z-40 flex justify-end" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-md h-full overflow-y-auto flex flex-col p-6" style={{ background: "#111827", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Apply for Leave</h2>
              <button onClick={() => setShowPanel(false)}><X size={20} style={{ color: "#6B7280" }} /></button>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Reason</label>
                <textarea rows={3} placeholder="Reason for leave..." className="w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
              <Field label="Destination" placeholder="City, State" />
              <Field label="Departure Date" type="date" />
              <Field label="Return Date" type="date" />
              <Field label="Parent Contact Number" type="tel" placeholder="+91 9876543210" />
            </div>
            <button onClick={() => setShowPanel(false)} className="w-full py-3 rounded-xl font-bold text-sm mt-6" style={{ background: "#00D4AA", color: "#0A0F1E" }}>Submit Application</button>
          </div>
        </div>
      )}
    </div>
  );
}
