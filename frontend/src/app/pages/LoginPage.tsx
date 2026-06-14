import React, { useState } from "react";
import { Home } from "lucide-react";
import { Field } from "../components/Common";
import { Role } from "../types";
import { apiService } from "../services/api";

type LoginPageProps = {
  onLogin: (role: Role, mustChangePassword: boolean) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await apiService.login({ email, password });
      if ((response.success || response.token) && response.token && response.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        onLogin(response.user.role as Role, response.user.mustChangePassword ?? false);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-center items-center flex-1 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0A0F1E 0%,#0d1a2e 50%,#0A0F1E 100%)" }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-2xl opacity-10"
            style={{
              width: 80 + i * 30, height: 80 + i * 30,
              left: `${10 + (i * 13) % 70}%`, top: `${5 + (i * 17) % 80}%`,
              background: i % 2 === 0
                ? "linear-gradient(135deg,#00D4AA,transparent)"
                : "linear-gradient(135deg,#6366F1,transparent)",
              transform: `rotate(${i * 15}deg)`,
              animation: `float ${4 + i * 0.7}s ease-in-out infinite alternate`,
            }}
          />
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

      {/* Right panel */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center p-8" style={{ background: "#0A0F1E" }}>
        <div className="w-full max-w-sm">
          <div className="rounded-2xl p-8" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-white">Sign In</h2>
              <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                Use the credentials provided by your warden.
              </p>
            </div>

            {error && (
              <div className="text-xs text-center py-2 mb-3 rounded-lg" style={{ color: "#EF4444", background: "rgba(239,68,68,0.08)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Field
                label="Email"
                type="email"
                placeholder="you@hostel.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Field
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 mt-2"
                style={{ background: "#00D4AA", color: "#0A0F1E", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
