import React, { useState } from "react";
import { Home } from "lucide-react";
import { Glass, Field } from "../components/Common";
import { Role, Tab } from "../types";
import { apiService } from "../services/api";

type LoginPageProps = {
  onLogin: (role: Role) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [tab, setTab] = useState<Tab>("login");
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regFullName, setRegFullName] = useState("");
  const [regRollNumber, setRegRollNumber] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regCourse, setRegCourse] = useState("");
  const [regYear, setRegYear] = useState(1);
  const [regPhone, setRegPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiService.login({
        email: loginEmail,
        password: loginPassword,
        role,
      });

      if (response.success && response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        onLogin(role);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiService.register({
        fullName: regFullName,
        rollNumber: regRollNumber,
        email: regEmail,
        password: regPassword,
        course: regCourse,
        year: regYear,
        phone: regPhone,
      });

      if (response.success) {
        setTab("login");
        setError("");
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

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

            {error && (
              <div className="text-xs text-center py-2" style={{ color: "#EF4444" }}>
                {error}
              </div>
            )}

            {tab === "login" ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <Field label="Email" type="email" placeholder="natasha@hostel.edu" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                <Field label="Password" type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                <button type="button" className="text-sm text-right -mt-2" style={{ color: "#00D4AA" }}>Forgot password?</button>
                <div>
                  <p className="text-sm mb-2" style={{ color: "#6B7280" }}>Sign in as</p>
                  <div className="flex gap-2">
                    {(["student", "warden", "admin"] as Role[]).map(r => (
                      <button key={r} type="button" onClick={() => setRole(r)}
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
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 mt-2"
                  style={{ background: "#00D4AA", color: "#0A0F1E", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-3">
                <Field label="Full Name" placeholder="Natasha Avery" value={regFullName} onChange={(e) => setRegFullName(e.target.value)} />
                <Field label="Roll Number" placeholder="CS2021045" value={regRollNumber} onChange={(e) => setRegRollNumber(e.target.value)} />
                <Field label="Email" type="email" placeholder="natasha@hostel.edu" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                <Field label="Password" type="password" placeholder="••••••••" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                <Field label="Course" placeholder="B.Tech Computer Science" value={regCourse} onChange={(e) => setRegCourse(e.target.value)} />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Year</label>
                    <select className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                      value={regYear}
                      onChange={(e) => setRegYear(Number(e.target.value))}>
                      {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}st Year</option>)}
                    </select>
                  </div>
                  <div className="flex-1"><Field label="Phone" type="tel" placeholder="+91 9876543210" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} /></div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 mt-1"
                  style={{ background: "#00D4AA", color: "#0A0F1E", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
