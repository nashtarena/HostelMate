import React, { useEffect, useState } from "react";
import { Zap, Droplets, Wrench, ThumbsUp, Plus, Trash2 } from "lucide-react";
import { Glass, Badge, Pill, Modal, Field } from "../components/Common";
import { apiService } from "../services/api";

type ComplaintStatus = "All" | "Open" | "In Progress" | "Resolved";

const catMeta: Record<string, { color: string; icon: any }> = {
  Electrical:  { color: "#F59E0B", icon: Zap },
  Plumbing:    { color: "#6366F1", icon: Droplets },
  Maintenance: { color: "#9CA3AF", icon: Wrench },
  Cleanliness: { color: "#10B981", icon: Trash2 },
};
const statusVariant: Record<string, any> = { Open: "yellow", "In Progress": "teal", Resolved: "green" };
const priorityVariant: Record<string, any> = { Urgent: "red", High: "orange", Medium: "yellow", Low: "gray" };

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filter, setFilter] = useState<ComplaintStatus>("All");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [category, setCategory] = useState("Electrical");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const load = () => {
    setLoading(true);
    apiService.getComplaints()
      .then((data: any) => setComplaints(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await apiService.createComplaint({ category, title, description, priority });
      setShowModal(false);
      setTitle(""); setDescription(""); setCategory("Electrical"); setPriority("Medium");
      load();
    } catch {} finally { setSubmitting(false); }
  };

  const handleVote = async (id: string) => {
    try {
      await apiService.toggleComplaintVote(id);
      load();
    } catch {}
  };

  const filtered = filter === "All" ? complaints : complaints.filter(c => c.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Complaints</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#00D4AA", color: "#0A0F1E" }}>
          <Plus size={16} />New Complaint
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["All", "Open", "In Progress", "Resolved"] as ComplaintStatus[]).map(f => (
          <Pill key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: "#6B7280" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm" style={{ color: "#6B7280" }}>No complaints found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((c) => {
            const meta = catMeta[c.category] || { color: "#9CA3AF", icon: Wrench };
            const Icon = meta.icon;
            const voteCount = Array.isArray(c.votes) ? c.votes.length : (c.votes ?? 0);
            return (
              <Glass key={c._id} className="p-5 transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${meta.color}20` }}>
                    <Icon size={18} style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-white">{c.title}</h3>
                      <div className="flex gap-2 flex-shrink-0">
                        {c.priority && <Badge label={c.priority} variant={priorityVariant[c.priority]} />}
                        <Badge label={c.status} variant={statusVariant[c.status]} />
                      </div>
                    </div>
                    <p className="text-sm mt-1 line-clamp-2" style={{ color: "#6B7280" }}>{c.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <button onClick={() => handleVote(c._id)}
                        className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl transition-all duration-200"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#6B7280" }}>
                        <ThumbsUp size={13} />{voteCount}
                      </button>
                      <span className="text-xs" style={{ color: "#6B7280" }}>
                        {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                </div>
              </Glass>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal title="New Complaint" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {Object.keys(catMeta).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Field label="Title" placeholder="Brief title" value={title} onChange={e => setTitle(e.target.value)} />
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Description</label>
              <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue..." className="w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#9CA3AF" }}>Priority</p>
              <div className="flex gap-2">
                {[["Urgent", "#EF4444"], ["High", "#F97316"], ["Medium", "#F59E0B"], ["Low", "#9CA3AF"]].map(([p, c]) => (
                  <button key={p} onClick={() => setPriority(p)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold"
                    style={{ background: priority === p ? `${c}30` : `${c}10`, color: c, border: `1px solid ${c}${priority === p ? "80" : "30"}` }}>{p}</button>
                ))}
              </div>
            </div>
            <button onClick={handleSubmit} disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-sm" style={{ background: "#00D4AA", color: "#0A0F1E", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
