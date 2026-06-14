import React, { useEffect, useState } from "react";
import { Plus, Clock, X } from "lucide-react";
import { Glass, Badge, Field } from "../components/Common";
import { apiService } from "../services/api";

const colors = ["#00D4AA", "#6366F1", "#F59E0B", "#10B981", "#F97316"];

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [visitorName, setVisitorName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("Parent");
  const [purpose, setPurpose] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const load = () => {
    setLoading(true);
    apiService.getVisitors()
      .then((data: any) => setVisitors(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!visitorName.trim()) return;
    setSubmitting(true);
    try {
      await apiService.addVisitor({ name: visitorName, phone, relation, purpose, scheduledAt });
      setShowPanel(false);
      setVisitorName(""); setPhone(""); setRelation("Parent"); setPurpose(""); setScheduledAt("");
      load();
    } catch {} finally { setSubmitting(false); }
  };

  const handleCheckIn = async (id: string) => {
    try { await apiService.checkInVisitor(id); load(); } catch {}
  };

  const handleCheckOut = async (id: string) => {
    try { await apiService.checkOutVisitor(id); load(); } catch {}
  };

  const fmtDate = (d: string) =>
    d ? new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Visitors</h1>
        <button onClick={() => setShowPanel(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#00D4AA", color: "#0A0F1E" }}>
          <Plus size={16} />Add Visitor
        </button>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: "#6B7280" }}>Loading...</p>
      ) : visitors.length === 0 ? (
        <p className="text-sm" style={{ color: "#6B7280" }}>No visitors logged yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visitors.map((v, i) => {
            const color = colors[i % colors.length];
            const initials = v.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
            return (
              <Glass key={v._id} className="p-5 transition-all duration-200 hover:-translate-y-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: `${color}25`, color }}>{initials}</div>
                  <div>
                    <div className="font-bold text-white">{v.name}</div>
                    {v.relation && <Badge label={v.relation} variant="indigo" />}
                  </div>
                </div>
                <div className="text-sm mb-4" style={{ color: "#6B7280" }}>
                  <div className="flex items-center gap-1.5"><Clock size={12} />{fmtDate(v.scheduledAt)}</div>
                  {v.purpose && <div className="mt-1">{v.purpose}</div>}
                </div>
                <div className="flex items-center justify-between">
                  <Badge
                    label={v.status}
                    variant={v.status === "Checked In" ? "green" : v.status === "Checked Out" ? "gray" : "yellow"}
                  />
                  <div className="flex gap-2">
                    {v.status === "Expected" && (
                      <button onClick={() => handleCheckIn(v._id)} className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>Check In</button>
                    )}
                    {v.status === "Checked In" && (
                      <button onClick={() => handleCheckOut(v._id)} className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>Check Out</button>
                    )}
                  </div>
                </div>
              </Glass>
            );
          })}
        </div>
      )}

      {showPanel && (
        <div className="fixed inset-0 z-40 flex justify-end" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-md h-full overflow-y-auto flex flex-col p-6" style={{ background: "#111827", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Add Visitor</h2>
              <button onClick={() => setShowPanel(false)}><X size={20} style={{ color: "#6B7280" }} /></button>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <Field label="Visitor Name" placeholder="Full name" value={visitorName} onChange={e => setVisitorName(e.target.value)} />
              <Field label="Phone Number" type="tel" placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)} />
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Relation</label>
                <select value={relation} onChange={e => setRelation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Parent", "Sibling", "Friend", "Guardian", "Other"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <Field label="Purpose of Visit" placeholder="Reason for visiting" value={purpose} onChange={e => setPurpose(e.target.value)} />
              <Field label="Scheduled Date &amp; Time" type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
            </div>
            <button onClick={handleAdd} disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-sm mt-6"
              style={{ background: "#00D4AA", color: "#0A0F1E", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Adding..." : "Add Visitor"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
