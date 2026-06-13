import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Glass, Badge, Modal, Field } from "../components/Common";

const notices = [
  { pinned: true, title: "Hostel Fee Payment Deadline Extended", content: "Due to the upcoming exams, the hostel fee payment deadline has been extended to July 5th, 2024. Students are advised to pay before the deadline to avoid late fees.", by: "Warden Office", date: "Jun 10" },
  { pinned: false, title: "Inter-Hostel Sports Meet", content: "The annual inter-hostel sports meet will be held on June 20–22. Students interested in participating should register at the Sports Office.", cat: "Event", border: "#6366F1", date: "Jun 9" },
  { pinned: false, title: "Water Supply Disruption", content: "Water supply will be interrupted on June 15th from 9 AM to 1 PM due to maintenance work. Please plan accordingly.", cat: "Maintenance", border: "#F97316", date: "Jun 8" },
  { pinned: false, title: "New Library Timings", content: "The hostel library will now remain open until 11 PM on weekdays. Weekend timings remain unchanged (8 AM – 6 PM).", cat: "General", border: "#00D4AA", date: "Jun 6" },
];

export default function NoticesPage() {
  const [showModal, setShowModal] = useState(false);
  const pinned = notices.filter(n => n.pinned);
  const rest = notices.filter(n => !n.pinned);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Notices</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#00D4AA", color: "#0A0F1E" }}>
          <Plus size={16} />Post Notice
        </button>
      </div>

      {pinned.map((n, i) => (
        <div key={i} className="rounded-2xl p-5" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderLeft: "4px solid #F59E0B" }}>
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: 16 }}>📌</span>
            <span className="text-xs font-bold" style={{ color: "#F59E0B" }}>PINNED</span>
          </div>
          <h3 className="font-bold text-white mb-2">{n.title}</h3>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>{n.content}</p>
          <div className="flex items-center justify-between mt-3 text-xs" style={{ color: "#6B7280" }}>
            <span>{n.by}</span><span>{n.date}</span>
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-3">
        {rest.map((n, i) => (
          <Glass key={i} className="p-5" style={{ borderLeft: `4px solid ${n.border}` }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">{n.title}</h3>
                <p className="text-sm line-clamp-2" style={{ color: "#9CA3AF" }}>{n.content}</p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-2">
                {n.cat && <Badge label={n.cat} variant={n.border === "#6366F1" ? "indigo" : n.border === "#F97316" ? "orange" : "teal"} />}
                <span className="text-xs" style={{ color: "#6B7280" }}>{n.date}</span>
              </div>
            </div>
          </Glass>
        ))}
      </div>

      {showModal && (
        <Modal title="Post Notice" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <Field label="Title" placeholder="Notice title" />
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Content</label>
              <textarea rows={4} placeholder="Write your notice here..." className="w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Category</label>
              <select className="w-full px-3 py-2.5 rounded-xl text-sm text-white" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <option>General</option><option>Urgent</option><option>Event</option><option>Maintenance</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="accent-teal-400" />
              <span className="text-sm text-white">Pin this notice</span>
            </label>
            <Field label="Expiry Date" type="date" />
            <button onClick={() => setShowModal(false)} className="w-full py-3 rounded-xl font-bold text-sm" style={{ background: "#00D4AA", color: "#0A0F1E" }}>Post Notice</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
