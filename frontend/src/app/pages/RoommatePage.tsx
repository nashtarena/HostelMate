import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { Glass } from "../components/Common";

type PrefKey = "sleep" | "study" | "clean" | "guests";
const prefOptions: Record<PrefKey, string[]> = {
  sleep: ["Early Bird", "Night Owl", "Flexible"],
  study: ["Silence Needed", "Noise OK", "Flexible"],
  clean: ["Spotless", "Moderate", "Relaxed"],
  guests: ["No Guests", "Occasional", "Frequent"],
};
const prefLabels: Record<PrefKey, string> = { sleep: "Sleep Time", study: "Study Habits", clean: "Cleanliness", guests: "Guest Policy" };

const matches = [
  { name: "Ananya Iyer", course: "B.Tech CSE", year: "3rd Year", compat: 92, initials: "AI", matchedPrefs: [true, true, true, false] },
  { name: "Keerthi Reddy", course: "B.Tech ECE", year: "2nd Year", compat: 78, initials: "KR", matchedPrefs: [true, false, true, true] },
  { name: "Sneha Kulkarni", course: "M.Tech AI", year: "1st Year", compat: 65, initials: "SK", matchedPrefs: [false, true, false, true] },
];

export default function RoommatePage() {
  const [prefs, setPrefs] = useState<Record<PrefKey, number>>({ sleep: 0, study: 2, clean: 1, guests: 1 });
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-white">Roommate Match</h1>
      <p className="text-sm -mt-3" style={{ color: "#6B7280" }}>Based on your lifestyle preferences</p>

      <Glass className="p-5">
        <h2 className="font-bold text-white mb-4">My Preferences</h2>
        <div className="flex flex-col gap-4">
          {(Object.entries(prefOptions) as [PrefKey, string[]][]).map(([key, opts]) => (
            <div key={key} className="flex items-center justify-between gap-4 flex-wrap">
              <span className="text-sm font-medium w-32 flex-shrink-0" style={{ color: "#D1D5DB" }}>{prefLabels[key]}</span>
              <div className="flex gap-2 flex-wrap">
                {opts.map((o, i) => (
                  <button key={o} onClick={() => setPrefs(p => ({ ...p, [key]: i }))}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                    style={{
                      background: prefs[key] === i ? "#00D4AA" : "rgba(255,255,255,0.05)",
                      color: prefs[key] === i ? "#0A0F1E" : "#9CA3AF",
                      border: prefs[key] === i ? "none" : "1px solid rgba(255,255,255,0.08)",
                    }}>{o}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: "rgba(0,212,170,0.1)", color: "#00D4AA", border: "1px solid rgba(0,212,170,0.2)" }}>Update Preferences</button>
      </Glass>

      <h2 className="font-bold text-white">Top Matches</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {matches.map((m, i) => (
          <Glass key={i} className="p-5 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg" style={{ background: "linear-gradient(135deg,rgba(0,212,170,0.3),rgba(99,102,241,0.3))", color: "#fff" }}>{m.initials}</div>
            <div>
              <div className="font-bold text-white">{m.name}</div>
              <div className="text-xs mt-1" style={{ color: "#6B7280" }}>{m.course} · {m.year}</div>
            </div>
            <div className="text-3xl font-extrabold" style={{ color: "#00D4AA", fontFamily: "JetBrains Mono, monospace" }}>{m.compat}%</div>
            <div className="flex gap-2">
              {m.matchedPrefs.map((match, j) => (
                <div key={j} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: match ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.1)" }}>
                  {match ? <Check size={12} style={{ color: "#10B981" }} /> : <X size={12} style={{ color: "#EF4444" }} />}
                </div>
              ))}
            </div>
            <button className="w-full py-2 rounded-xl text-sm font-semibold" style={{ border: "1px solid rgba(0,212,170,0.4)", color: "#00D4AA" }}>Send Request</button>
          </Glass>
        ))}
      </div>
    </div>
  );
}
