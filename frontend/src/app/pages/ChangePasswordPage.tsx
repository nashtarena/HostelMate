import React, { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { Field } from "../components/Common";
import { apiService } from "../services/api";

type Props = {
  forced?: boolean; // true = must change before accessing app
  onSuccess?: () => void;
};

export default function ChangePasswordPage({ forced = false, onSuccess }: Props) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) { setError("New passwords do not match"); return; }
    if (next.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await apiService.changePassword(current, next);
      if (res.success) {
        // Update stored user so mustChangePassword is cleared
        const stored = localStorage.getItem("user");
        if (stored) {
          const u = JSON.parse(stored);
          u.mustChangePassword = false;
          localStorage.setItem("user", JSON.stringify(u));
        }
        setDone(true);
        setTimeout(() => onSuccess?.(), 1200);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={forced ? "flex min-h-screen items-center justify-center p-6" : "flex flex-col gap-6"}
      style={forced ? { background: "#0A0F1E" } : {}}>

      <div
        className="rounded-2xl p-8 w-full max-w-md mx-auto"
        style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,212,170,0.12)" }}>
            <KeyRound size={18} style={{ color: "#00D4AA" }} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">
              {forced ? "Set Your Password" : "Change Password"}
            </h2>
            {forced && (
              <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                Your account was assigned a temporary password. Please set a new one to continue.
              </p>
            )}
          </div>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <ShieldCheck size={40} style={{ color: "#00D4AA" }} />
            <p className="text-white font-semibold">Password updated successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="text-xs py-2 px-3 rounded-lg" style={{ color: "#EF4444", background: "rgba(239,68,68,0.08)" }}>
                {error}
              </div>
            )}
            <Field
              label="Current (temporary) Password"
              type="password"
              placeholder="••••••••"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
            <Field
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
            <Field
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm mt-2 transition-all duration-200 hover:opacity-90"
              style={{ background: "#00D4AA", color: "#0A0F1E", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
