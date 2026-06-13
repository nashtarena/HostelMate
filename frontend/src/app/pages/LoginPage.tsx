import React, { useState } from "react";
import { Home } from "lucide-react";
import { Glass, Field } from "../components/Common";
import { Role, Tab } from "../types";

type LoginPageProps = {
  onLogin: (role: Role) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [tab, setTab] = useState<Tab>("login");
  const [role, setRole] = useState<Role>("student");

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0A0F1E 0%,#0d1a2e 50%,#0A0F1E 100%)" }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute rounded-2xl opacity-10"
            style={{
              width: 80 + i * 30, height: 80 + i * 30,
              left: `${10 + (i * 13) % 70}%`, top: `${5 + (i * 17) % 80}%`,
              background: i % 2 === 0
                ? "linear-gradient(135deg,#00D4AA,transparent)"
                : "linear-gradient(135deg,#6366F1,transparent)",
              transform: `rotate(${i * 15}deg)`,
              animation: `float ${4 + i * 0.7}s ease-in-out infinite alternate`,
            }} />
        ))}
        <style>{`@keyframes float { from { transform: translateY(0) rotate(0deg); } to { transform: translateY(-20px) rotate(10deg); } }`}</style>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#00D4AA" }}>
              <Home size={28} style={{ color: "#0A0F1E" }} />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-3">HostelMate</h1>
          <p className="text-lg" style={{ color: "#6B7280" }}>Your hostel. Fully managed.</p>
        </div>
      </div>

      <div className="flex-1 lg:max-w-md flex items-center justify-center p-8" style={{ background: "#0A0F1E" }}>
        <div className="w-full max-w-sm">
          <div className="rounded-2xl p-8" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex mb-6 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {(["login", "register"] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="flex-1 py-2.5 text-sm font-semibold capitalize transition-all duration-200 relative"
                  style={{ color: tab === t ? "#00D4AA" : "#6B7280" }}>
                  {t === "login" ? "Login" : "Register"}
                  {tab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#00D4AA" }} />}
                </button>
              ))}
            </div>

            {tab === "login" ? (
              <div className="flex flex-col gap-4">
                <Field label="Email" type="email" placeholder="natasha@hostel.edu" />
                <Field label="Password" type="password" placeholder="••••••••" />
                <button className="text-sm text-right -mt-2" style={{ color: "#00D4AA" }}>Forgot password?</button>
                <div>
                  <p className="text-sm mb-2" style={{ color: "#6B7280" }}>Sign in as</p>
                  <div className="flex gap-2">
                    {(["student", "warden", "admin"] as Role[]).map(r => (
                      <button key={r} onClick={() => setRole(r)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200"
                        style={{
                          background: role === r ? "#00D4AA" : "rgba(255,255,255,0.05)",
                          color: role === r ? "#0A0F1E" : "#9CA3AF",
                          border: role === r ? "none" : "1px solid rgba(255,255,255,0.08)",
                        }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => onLogin(role)}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 mt-2"
                  style={{ background: "#00D4AA", color: "#0A0F1E" }}>
                  Sign In
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Field label="Full Name" placeholder="Natasha Avery" />
                <Field label="Roll Number" placeholder="CS2021045" />
                <Field label="Email" type="email" placeholder="natasha@hostel.edu" />
                <Field label="Password" type="password" placeholder="••••••••" />
                <Field label="Course" placeholder="B.Tech Computer Science" />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Year</label>
                    <select className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}st Year</option>)}
                    </select>
                  </div>
                  <div className="flex-1"><Field label="Phone" type="tel" placeholder="+91 9876543210" /></div>
                </div>
                <button onClick={() => { setTab("login"); }}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 mt-1"
                  style={{ background: "#00D4AA", color: "#0A0F1E" }}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
