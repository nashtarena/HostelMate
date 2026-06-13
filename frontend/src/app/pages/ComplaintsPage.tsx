import React, { useState } from "react";
import { Zap, Droplets, Wrench, ThumbsUp, Upload, Plus } from "lucide-react";
import { Glass, Badge, Pill, Modal, Field } from "../components/Common";

type ComplaintStatus = "All" | "Open" | "In Progress" | "Resolved";

const complaints = [
  { cat: "Electrical", catColor: "#F59E0B", catIcon: Zap, title: "Fan not working", desc: "The ceiling fan in room 204 stopped working since last night.", date: "Jun 10", priority: "Urgent", status: "In Progress", votes: 5 },
  { cat: "Plumbing", catColor: "#6366F1", catIcon: Droplets, title: "Leaking tap in bathroom", desc: "The washroom tap has been leaking for 2 days causing water waste.", date: "Jun 8", priority: "High", status: "Open", votes: 3 },
  { cat: "Maintenance", catColor: "#9CA3AF", catIcon: Wrench, title: "Door lock broken", desc: "Room door lock is loose and doesn't lock properly from inside.", date: "Jun 5", priority: "Medium", status: "Resolved", votes: 7 },
];

export default function ComplaintsPage() {
  const [filter, setFilter] = useState<ComplaintStatus>("All");
  const [showModal, setShowModal] = useState(false);
  const [voted, setVoted] = useState<number[]>([]);

  const statusVariant: Record<string, "teal" | "yellow" | "green"> = {
    "Open": "yellow", "In Progress": "teal", "Resolved": "green",
  };
  const priorityVariant: Record<string, "red" | "orange" | "yellow" | "gray"> = {
    "Urgent": "red", "High": "orange", "Medium": "yellow", "Low": "gray",
  };

  const filtered = filter === "All" ? complaints : complaints.filter(c => c.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Complaints</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#00D4AA", color: "#0A0F1E" }}>
          <Plus size={16} />New Complaint
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {( ["All", "Open", "In Progress", "Resolved"] as ComplaintStatus[]).map(f => (
          <Pill key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((c, i) => (
          <Glass key={i} className="p-5 transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.catColor}20` }}>
                <c.catIcon size={18} style={{ color: c.catColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="font-bold text-white">{c.title}</h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <Badge label={c.priority} variant={priorityVariant[c.priority]} />
                    <Badge label={c.status} variant={statusVariant[c.status]} />
                  </div>
                </div>
                <p className="text-sm mt-1 line-clamp-2" style={{ color: "#6B7280" }}>{c.desc}</p>
                <div className="flex items-center justify-between mt-3">
                  <button onClick={() => setVoted(v => v.includes(i) ? v.filter(x => x !== i) : [...v, i])}
                    className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl transition-all duration-200"
                    style={{ background: voted.includes(i) ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.05)", color: voted.includes(i) ? "#00D4AA" : "#6B7280" }}>
                    <ThumbsUp size={13} />{c.votes + (voted.includes(i) ? 1 : 0)}
                  </button>
                  <span className="text-xs" style={{ color: "#6B7280" }}>{c.date}</span>
                </div>
              </div>
            </div>
          </Glass>
        ))}
      </div>

      {showModal && (
        <Modal title="New Complaint" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Category</label>
              <select className="w-full px-3 py-2.5 rounded-xl text-sm text-white" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <option>⚡ Electrical</option>
                <option>💧 Plumbing</option>
                <option>🔧 Maintenance</option>
                <option>🧹 Cleanliness</option>
              </select>
            </div>
            <Field label="Title" placeholder="Brief title of your complaint" />
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Description</label>
              <textarea rows={3} placeholder="Describe the issue in detail..." className="w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#9CA3AF" }}>Priority</p>
              <div className="flex gap-2">
                {[ ["Urgent", "#EF4444"], ["High", "#F97316"], ["Medium", "#F59E0B"], ["Low", "#9CA3AF"] ].map(([p, c]) => (
                  <button key={p as string} className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background: `${c}20`, color: c, border: `1px solid ${c}40` }}>{p as string}</button>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-6 flex flex-col items-center gap-2" style={{ background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(255,255,255,0.08)" }}>
              <Upload size={20} style={{ color: "#6B7280" }} />
              <span className="text-sm" style={{ color: "#6B7280" }}>Upload photos (optional)</span>
            </div>
            <button onClick={() => setShowModal(false)} className="w-full py-3 rounded-xl font-bold text-sm" style={{ background: "#00D4AA", color: "#0A0F1E" }}>Submit Complaint</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
