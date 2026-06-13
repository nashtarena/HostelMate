import React from "react";
import { Glass, Badge } from "../components/Common";
import { QrCode, Phone, Wifi, Wind, Bath, BookOpen } from "lucide-react";

export default function RoomPage() {
  const roommates = [
    { name: "Priya Sharma", course: "B.Tech ECE", year: "3rd Year", phone: "+91 9876501234", compat: 87, initials: "PS" },
    { name: "Divya Nair", course: "B.Tech CSE", year: "3rd Year", phone: "+91 9123456789", compat: 74, initials: "DN" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-white">My Room</h1>

      <Glass className="p-6 flex flex-col sm:flex-row gap-6">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-8xl font-bold" style={{ fontFamily: "JetBrains Mono, monospace", color: "#00D4AA" }}>204</div>
            <div className="text-sm mt-1" style={{ color: "#6B7280" }}>Floor 2 · Block B</div>
          </div>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge label="Double Occupancy" variant="indigo" />
            <Badge label="Occupied" variant="green" />
            <Badge label="Non-AC Block" variant="gray" />
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {[{ icon: Wifi, label: "WiFi" }, { icon: Wind, label: "Fan" }, { icon: Bath, label: "Attached Bath" }, { icon: BookOpen, label: "Study Table" }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.05)", color: "#D1D5DB" }}>
                <Icon size={14} style={{ color: "#00D4AA" }} />{label}
              </div>
            ))}
          </div>
        </div>
      </Glass>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Glass className="p-5">
          <h2 className="text-base font-bold text-white mb-4">Roommates</h2>
          <div className="flex flex-col gap-5">
            {roommates.map((r, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: i === 0 ? "rgba(99,102,241,0.3)" : "rgba(0,212,170,0.3)", color: i === 0 ? "#818CF8" : "#00D4AA" }}>
                  {r.initials}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{r.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{r.course} · {r.year}</div>
                  <div className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: "#6B7280" }}>
                    <Phone size={10} />{r.phone}
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1" style={{ color: "#6B7280" }}>
                      <span>Compatibility</span><span style={{ color: "#00D4AA" }}>{r.compat}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-2 rounded-full" style={{ width: `${r.compat}%`, background: "linear-gradient(90deg,#00D4AA,#6366F1)" }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Glass>

        <Glass className="p-5 flex flex-col items-center justify-center gap-4">
          <h2 className="text-base font-bold text-white">Room QR Code</h2>
          <div className="w-40 h-40 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <QrCode size={80} style={{ color: "#00D4AA" }} />
          </div>
          <p className="text-sm text-center" style={{ color: "#6B7280" }}>Scan to verify room occupancy</p>
          <button className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 hover:bg-red-500/10"
            style={{ borderColor: "#EF4444", color: "#EF4444" }}>
            Report Room Issue
          </button>
        </Glass>
      </div>
    </div>
  );
}
