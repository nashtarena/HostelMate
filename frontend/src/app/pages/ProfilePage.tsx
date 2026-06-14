import React, { useEffect, useState } from "react";
import { Glass } from "../components/Common";
import { Edit2, Mail, Phone, Shield, User } from "lucide-react";
import ChangePasswordPage from "./ChangePasswordPage";
import { apiService } from "../services/api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Start with cached user, then refresh from API
    const cached = localStorage.getItem("user");
    if (cached) setUser(JSON.parse(cached));
    apiService.getMe().then((res) => {
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      }
    }).catch(() => {});
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const isStudent = user?.role === "student";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-white">My Profile</h1>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="h-32" style={{ background: "linear-gradient(135deg,#00D4AA 0%,#6366F1 100%)" }} />
        <div className="px-6 pb-6" style={{ background: "#111827" }}>
          <div className="-mt-10 flex items-end justify-between">
            <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl border-4"
              style={{ background: "linear-gradient(135deg,#00D4AA,#6366F1)", color: "#fff", borderColor: "#111827" }}>
              {initials}
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-extrabold text-white">{user?.name || "—"}</h2>
            <p className="text-sm mt-0.5 capitalize" style={{ color: "#6B7280" }}>
              {isStudent
                ? [user?.rollNumber, user?.course, user?.year ? `Year ${user.year}` : null].filter(Boolean).join(" · ")
                : user?.role}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Glass className="p-5">
          <h3 className="font-bold text-white mb-4">Contact Info</h3>
          <div className="flex flex-col gap-4">
            {[
              { icon: Mail,   label: "Email",  value: user?.email },
              { icon: Phone,  label: "Phone",  value: user?.phone },
              { icon: Shield, label: "Role",   value: user?.role },
              ...(user?.parentPhone ? [{ icon: Shield, label: "Parent Phone", value: user.parentPhone }] : []),
            ].map(({ icon: Icon, label, value }) => value ? (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,212,170,0.1)" }}>
                  <Icon size={14} style={{ color: "#00D4AA" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs" style={{ color: "#6B7280" }}>{label}</div>
                  <div className="text-sm font-medium text-white truncate capitalize">{value}</div>
                </div>
              </div>
            ) : null)}
          </div>
        </Glass>

        {isStudent && (
          <Glass className="p-5">
            <h3 className="font-bold text-white mb-4">Room Info</h3>
            {user?.room ? (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-xs mb-1" style={{ color: "#6B7280" }}>Room Number</div>
                  <div className="text-2xl font-bold" style={{ color: "#00D4AA", fontFamily: "JetBrains Mono, monospace" }}>
                    {user.room?.number || user.room}
                  </div>
                </div>
                {user.block && (
                  <div>
                    <div className="text-xs mb-1" style={{ color: "#6B7280" }}>Block</div>
                    <div className="text-sm font-semibold text-white">Block {user.block}</div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#6B7280" }}>No room assigned yet.</p>
            )}
          </Glass>
        )}

        <Glass className="p-5">
          <h3 className="font-bold text-white mb-4">Account</h3>
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-xs mb-1" style={{ color: "#6B7280" }}>User ID</div>
              <div className="text-xs font-mono" style={{ color: "#9CA3AF" }}>{user?.id || user?._id || "—"}</div>
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: "#6B7280" }}>Member Since</div>
              <div className="text-sm text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—"}
              </div>
            </div>
          </div>
        </Glass>
      </div>

      <Glass className="p-5 max-w-md">
        <h3 className="font-bold text-white mb-4">Change Password</h3>
        <ChangePasswordPage />
      </Glass>
    </div>
  );
}
