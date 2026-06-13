import React, { useState } from "react";
import { Edit2, Plus } from "lucide-react";
import { Glass, Badge, Modal, Field, Pill } from "../components/Common";

type RoomFilter = "All" | "Available" | "Full" | "Maintenance";
const adminRooms = [
  { num: "101", floor: 1, block: "A", type: "Single", cap: 1, occ: 1, occupants: ["KR"], status: "Full" },
  { num: "202", floor: 2, block: "A", type: "Double", cap: 2, occ: 1, occupants: ["MS"], status: "Available" },
  { num: "204", floor: 2, block: "B", type: "Double", cap: 2, occ: 2, occupants: ["NA", "PS"], status: "Full" },
  { num: "305", floor: 3, block: "B", type: "Triple", cap: 3, occ: 3, occupants: ["AK", "SN", "RK"], status: "Full" },
  { num: "310", floor: 3, block: "C", type: "Double", cap: 2, occ: 0, occupants: [], status: "Maintenance" },
  { num: "401", floor: 4, block: "A", type: "Single", cap: 1, occ: 0, occupants: [], status: "Available" },
];

export default function AdminRoomsPage() {
  const [filter, setFilter] = useState<RoomFilter>("All");
  const [showModal, setShowModal] = useState(false);

  const filtered = filter === "All" ? adminRooms : adminRooms.filter(r => r.status === filter);
  const statusColors: Record<string, string> = { Full: "#10B981", Available: "#00D4AA", Maintenance: "#F97316" };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Room Management</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#00D4AA", color: "#0A0F1E" }}>
          <Plus size={14} />Add Room
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {( ["All", "Available", "Full", "Maintenance"] as RoomFilter[]).map(f => (
          <Pill key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((r, i) => (
          <Glass key={i} className="p-5 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-3">
              <div className="text-4xl font-bold" style={{ fontFamily: "JetBrains Mono, monospace", color: "#00D4AA" }}>{r.num}</div>
              <Badge label={r.status} variant={r.status === "Full" ? "green" : r.status === "Available" ? "teal" : "orange"} />
            </div>
            <div className="text-sm mb-3" style={{ color: "#6B7280" }}>Floor {r.floor} · Block {r.block}</div>
            <div className="flex items-center gap-2 mb-3">
              <Badge label={r.type} variant="indigo" />
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1" style={{ color: "#6B7280" }}>
                <span>Occupancy</span><span>{r.occ}/{r.cap}</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-2 rounded-full transition-all" style={{ width: `${(r.occ / r.cap) * 100}%`, background: statusColors[r.status] }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {r.occupants.map((o, j) => (
                  <div key={j} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2" style={{ background: "rgba(99,102,241,0.3)", color: "#818CF8", borderColor: "#111827" }}>{o}</div>
                ))}
              </div>
              <button className="text-xs px-3 py-1.5 rounded-xl font-medium" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Edit2 size={12} />
              </button>
            </div>
          </Glass>
        ))}
      </div>

      {showModal && (
        <Modal title="Add Room" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Room Number" placeholder="e.g. 205" />
              <Field label="Floor" type="number" placeholder="2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Block</label>
                <select className="w-full px-3 py-2.5 rounded-xl text-sm text-white" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <option>A</option><option>B</option><option>C</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Type</label>
                <select className="w-full px-3 py-2.5 rounded-xl text-sm text-white" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <option>Single</option><option>Double</option><option>Triple</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Capacity" type="number" placeholder="2" />
              <Field label="Monthly Rent (₹)" type="number" placeholder="4200" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#9CA3AF" }}>Amenities</p>
              <div className="grid grid-cols-2 gap-2">
                {["WiFi", "AC", "Attached Bath", "Study Table", "Wardrobe", "Water Purifier"].map(a => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-teal-400" />
                    <span className="text-sm text-white">{a}</span>
                  </label>
                ))}
              </div>
            </div>
            <button onClick={() => setShowModal(false)} className="w-full py-3 rounded-xl font-bold text-sm mt-1" style={{ background: "#00D4AA", color: "#0A0F1E" }}>Add Room</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
