import React, { useState } from "react";
import { Plus, Clock, X } from "lucide-react";
import { Glass, Badge, Field } from "../components/Common";

const visitors = [
  { name: "Rahul Avery", rel: "Brother", date: "Jun 14, 2:00 PM", status: "Checked In", initials: "RA", color: "#00D4AA" },
  { name: "Meena Sharma", rel: "Mother", date: "Jun 16, 11:00 AM", status: "Expected", initials: "MS", color: "#6366F1" },
  { name: "Aditya Kumar", rel: "Friend", date: "Jun 18, 4:00 PM", status: "Expected", initials: "AK", color: "#F59E0B" },
];

export default function VisitorsPage() {
  const [showPanel, setShowPanel] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Visitors</h1>
        <button onClick={() => setShowPanel(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#00D4AA", color: "#0A0F1E" }}>
          <Plus size={16} />Add Visitor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {visitors.map((v, i) => (
          <Glass key={i} className="p-5 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: `${v.color}25`, color: v.color }}>{v.initials}</div>
              <div>
                <div className="font-bold text-white">{v.name}</div>
                <Badge label={v.rel} variant="indigo" />
              </div>
            </div>
            <div className="text-sm mb-4" style={{ color: "#6B7280" }}>
              <div className="flex items-center gap-1.5"><Clock size={12} />{v.date}</div>
            </div>
            <div className="flex items-center justify-between">
              <Badge label={v.status} variant={v.status === "Checked In" ? "green" : "yellow"} />
              <div className="flex gap-2">
                {v.status === "Expected" && (<button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>Check In</button>)}
                {v.status === "Checked In" && (<button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>Check Out</button>)}
              </div>
            </div>
          </Glass>
        ))}
      </div>

      {showPanel && (
        <div className="fixed inset-0 z-40 flex justify-end" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-md h-full overflow-y-auto flex flex-col p-6" style={{ background: "#111827", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Add Visitor</h2>
              <button onClick={() => setShowPanel(false)}><X size={20} style={{ color: "#6B7280" }} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <Field label="Visitor Name" placeholder="Full name" />
              <Field label="Phone Number" type="tel" placeholder="+91 9876543210" />
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Relation</label>
                <select className="w-full px-3 py-2.5 rounded-xl text-sm text-white" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <option>Parent</option><option>Sibling</option><option>Friend</option><option>Guardian</option>
                </select>
              </div>
              <Field label="Purpose of Visit" placeholder="Reason for visiting" />
              <Field label="Scheduled Date & Time" type="datetime-local" />
              <button onClick={() => setShowPanel(false)} className="w-full py-3 rounded-xl font-bold text-sm mt-4" style={{ background: "#00D4AA", color: "#0A0F1E" }}>Add Visitor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
