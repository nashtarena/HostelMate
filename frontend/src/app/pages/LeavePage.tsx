import React, { useEffect, useState } from "react";
import { Plus, QrCode, X, MapPin, Home } from "lucide-react";
import { Glass, Pill, Badge, Field } from "../components/Common";
import { apiService } from "../services/api";

const statusVariant = (s: string): any => s === "Approved" ? "green" : s === "Pending" ? "yellow" : "red";

export default function LeavePage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [showQR, setShowQR] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [reason, setReason] = useState("");
  const [destination, setDestination] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [parentContact, setParentContact] = useState("");

  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const isWarden = storedUser.role === "warden" || storedUser.role === "admin";

  const load = () => {
    setLoading(true);
    apiService.getLeaves()
      .then((data: any) => setLeaves(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!reason || !from || !to) return;
    setSubmitting(true);
    try {
      await apiService.applyLeave({ reason, destination, from, to, parentContact });
      setShowPanel(false);
      setReason(""); setDestination(""); setFrom(""); setTo(""); setParentContact("");
      load();
    } catch {} finally { setSubmitting(false); }
  };

  const handleApprove = async (id: string) => {
    try { await apiService.approveLeave(id); load(); } catch {}
  };

  const handleReject = async (id: string) => {
    try { await apiService.rejectLeave(id); load(); } catch {}
  };

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Leave Requests</h1>
        {!isWarden && (
          <button onClick={() => setShowPanel(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#00D4AA", color: "#0A0F1E" }}>
            <Plus size={16} />Apply for Leave
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: "#6B7280" }}>Loading...</p>
      ) : leaves.length === 0 ? (
        <p className="text-sm" style={{ color: "#6B7280" }}>No leave requests yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {leaves.map((l) => (
            <Glass key={l._id} className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  {isWarden && l.student && (
                    <p className="text-xs font-semibold mb-1" style={{ color: "#00D4AA" }}>{l.student.name} — {l.student.rollNumber}</p>
                  )}
                  <div className="text-lg font-bold text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    {fmt(l.from)} <span style={{ color: "#6B7280" }}>→</span> {fmt(l.to)}
                  </div>
                  {l.destination && (
                    <div className="flex items-center gap-1 mt-1 text-sm" style={{ color: "#6B7280" }}>
                      <MapPin size={12} />{l.destination}
                    </div>
                  )}
                  <p className="text-sm mt-2" style={{ color: "#9CA3AF" }}>{l.reason}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge label={l.status} variant={statusVariant(l.status)} />
                  {l.status === "Approved" && l.qrCode && (
                    <button onClick={() => setShowQR(l)}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium"
                      style={{ border: "1px solid rgba(0,212,170,0.3)", color: "#00D4AA" }}>
                      <QrCode size={12} />View Gate Pass
                    </button>
                  )}
                  {isWarden && l.status === "Pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(l._id)} className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>Approve</button>
                      <button onClick={() => handleReject(l._id)} className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>Reject</button>
                    </div>
                  )}
                </div>
              </div>
            </Glass>
          ))}
        </div>
      )}

      {/* Gate Pass QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}>
          <div className="w-80 rounded-2xl p-8 flex flex-col items-center gap-4 text-center" style={{ background: "#F9FAFB", color: "#111827" }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#00D4AA" }}>
                <Home size={14} style={{ color: "#0A0F1E" }} />
              </div>
              <span className="font-bold">HostelMate</span>
            </div>
            <div className="text-xs font-bold tracking-widest" style={{ color: "#6B7280" }}>DIGITAL GATE PASS</div>
            <div>
              <div className="font-bold text-lg">{showQR.student?.name || storedUser.name}</div>
              <div className="text-sm mt-1" style={{ color: "#6B7280" }}>
                {showQR.student?.rollNumber || storedUser.rollNumber}
              </div>
            </div>
            <div className="text-sm" style={{ color: "#374151" }}>
              <div>{fmt(showQR.from)} → {fmt(showQR.to)}</div>
              {showQR.approvedBy && <div className="text-xs mt-1" style={{ color: "#9CA3AF" }}>Approved by {showQR.approvedBy.name}</div>}
            </div>
            {showQR.qrCode ? (
              <img src={showQR.qrCode} alt="Gate Pass QR" className="w-32 h-32 rounded-xl" />
            ) : (
              <div className="w-32 h-32 rounded-xl flex items-center justify-center" style={{ background: "#E5E7EB" }}>
                <QrCode size={64} style={{ color: "#111827" }} />
              </div>
            )}
            <button onClick={() => setShowQR(null)} className="w-full py-2 rounded-xl text-sm font-bold" style={{ background: "#0A0F1E", color: "#fff" }}>Close</button>
          </div>
        </div>
      )}

      {/* Apply panel */}
      {showPanel && (
        <div className="fixed inset-0 z-40 flex justify-end" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-md h-full overflow-y-auto flex flex-col p-6" style={{ background: "#111827", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Apply for Leave</h2>
              <button onClick={() => setShowPanel(false)}><X size={20} style={{ color: "#6B7280" }} /></button>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Reason</label>
                <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)}
                  placeholder="Reason for leave..." className="w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
              <Field label="Destination" placeholder="City, State" value={destination} onChange={e => setDestination(e.target.value)} />
              <Field label="Departure Date" type="date" value={from} onChange={e => setFrom(e.target.value)} />
              <Field label="Return Date" type="date" value={to} onChange={e => setTo(e.target.value)} />
              <Field label="Parent Contact" type="tel" placeholder="+91 9876543210" value={parentContact} onChange={e => setParentContact(e.target.value)} />
            </div>
            <button onClick={handleSubmit} disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-sm mt-6"
              style={{ background: "#00D4AA", color: "#0A0F1E", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
