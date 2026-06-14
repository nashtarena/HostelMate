import React from "react";
import { Glass, Badge, Field } from "../components/Common";
import { Edit2, Mail, Phone, Shield } from "lucide-react";
import ChangePasswordPage from "./ChangePasswordPage";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-white">My Profile</h1>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="h-32" style={{ background: "linear-gradient(135deg,#00D4AA 0%,#6366F1 100%)" }} />
        <div className="px-6 pb-6" style={{ background: "#111827" }}>
          <div className="-mt-10 flex items-end justify-between">
            <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl border-4"
              style={{ background: "linear-gradient(135deg,#00D4AA,#6366F1)", color: "#fff", borderColor: "#111827" }}>
              NA
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold mb-1"
              style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Edit2 size={14} />Edit Profile
            </button>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-extrabold text-white">Natasha Avery</h2>
            <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>CS2021045 · B.Tech Computer Science · 3rd Year</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Glass className="p-5">
          <h3 className="font-bold text-white mb-4">Contact Info</h3>
          <div className="flex flex-col gap-4">
            {[
              { icon: Mail, label: "Email", value: "natasha@hostel.edu" },
              { icon: Phone, label: "Phone", value: "+91 9876543210" },
              { icon: Shield, label: "Parent Phone", value: "+91 9123456789" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,212,170,0.1)" }}>
                  <Icon size={14} style={{ color: "#00D4AA" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs" style={{ color: "#6B7280" }}>{label}</div>
                  <div className="text-sm font-medium text-white truncate">{value}</div>
                </div>
                <button><Edit2 size={13} style={{ color: "#6B7280" }} /></button>
              </div>
            ))}
          </div>
        </Glass>

        <Glass className="p-5">
          <h3 className="font-bold text-white mb-4">Room Info</h3>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-xs mb-1" style={{ color: "#6B7280" }}>Room Number</div>
              <div className="text-2xl font-bold" style={{ color: "#00D4AA", fontFamily: "JetBrains Mono, monospace" }}>204</div>
            </div>
            <div className="flex gap-4">
              <div>
                <div className="text-xs mb-1" style={{ color: "#6B7280" }}>Floor</div>
                <div className="text-sm font-semibold text-white">2nd</div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: "#6B7280" }}>Block</div>
                <div className="text-sm font-semibold text-white">Block B</div>
              </div>
            </div>
            <div>
              <div className="text-xs mb-2" style={{ color: "#6B7280" }}>Roommates</div>
              <div className="flex flex-col gap-1">
                {['Priya Sharma', 'Divya Nair'].map(n => (
                  <button key={n} className="text-sm text-left font-medium" style={{ color: "#00D4AA" }}>{n}</button>
                ))}
              </div>
            </div>
          </div>
        </Glass>

        <Glass className="p-5">
          <h3 className="font-bold text-white mb-4">Hostel Stats</h3>
          <div className="flex flex-col gap-4">
            {[
              { label: "Complaints Filed", value: "5" },
              { label: "Leave Days (Semester)", value: "12 / 30" },
              { label: "Fees Paid", value: "₹32,400" },
              { label: "Fees Outstanding", value: "₹7,320" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: "#6B7280" }}>{label}</span>
                  <span className="font-semibold text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>{value}</span>
                </div>
              </div>
            ))}
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: "#6B7280" }}>
                <span>Fees Paid</span><span>82%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-2 rounded-full" style={{ width: "82%", background: "linear-gradient(90deg,#00D4AA,#6366F1)" }} />
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
