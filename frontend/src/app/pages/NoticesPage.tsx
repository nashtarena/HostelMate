import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Glass, Badge, Modal, Field } from "../components/Common";
import { apiService } from "../services/api";

const catBorder: Record<string, string> = {
  Urgent: "#F59E0B", Event: "#6366F1", Maintenance: "#F97316", General: "#00D4AA",
};
const catVariant: Record<string, any> = {
  Urgent: "yellow", Event: "indigo", Maintenance: "orange", General: "teal",
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [noticeTitle, setNoticeTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [pinned, setPinned] = useState(false);

  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const isWarden = storedUser.role === "warden" || storedUser.role === "admin";

  const load = () => {
    setLoading(true);
    apiService.getNotices()
      .then((data: any) => setNotices(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handlePost = async () => {
    if (!noticeTitle.trim()) return;
    setSubmitting(true);
    try {
      await apiService.createNotice({ title: noticeTitle, content, category, pinned });
      setShowModal(false);
      setNoticeTitle(""); setContent(""); setCategory("General"); setPinned(false);
      load();
    } catch {} finally { setSubmitting(false); }
  };

  const fmtDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";

  const pinnedNotices = notices.filter((n) => n.pinned);
  const rest = notices.filter((n) => !n.pinned);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Notices</h1>
        {isWarden && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#00D4AA", color: "#0A0F1E" }}>
            <Plus size={16} />Post Notice
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: "#6B7280" }}>Loading...</p>
      ) : notices.length === 0 ? (
        <p className="text-sm" style={{ color: "#6B7280" }}>No notices posted yet.</p>
      ) : (
        <>
          {pinnedNotices.map((n) => (
            <div key={n._id} className="rounded-2xl p-5" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderLeft: "4px solid #F59E0B" }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: 16 }}>📌</span>
                <span className="text-xs font-bold" style={{ color: "#F59E0B" }}>PINNED</span>
              </div>
              <h3 className="font-bold text-white mb-2">{n.title}</h3>
              <p className="text-sm" style={{ color: "#9CA3AF" }}>{n.content}</p>
              <div className="flex items-center justify-between mt-3 text-xs" style={{ color: "#6B7280" }}>
                <span>{n.postedBy?.name || "Warden"}</span>
                <span>{fmtDate(n.createdAt)}</span>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            {rest.map((n) => {
              const border = catBorder[n.category] || "#00D4AA";
              return (
                <Glass key={n._id} className="p-5" style={{ borderLeft: `4px solid ${border}` }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{n.title}</h3>
                      <p className="text-sm line-clamp-2" style={{ color: "#9CA3AF" }}>{n.content}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      {n.category && <Badge label={n.category} variant={catVariant[n.category] || "teal"} />}
                      <span className="text-xs" style={{ color: "#6B7280" }}>{fmtDate(n.createdAt)}</span>
                    </div>
                  </div>
                </Glass>
              );
            })}
          </div>
        </>
      )}

      {showModal && (
        <Modal title="Post Notice" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <Field label="Title" placeholder="Notice title" value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} />
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Content</label>
              <textarea rows={4} value={content} onChange={e => setContent(e.target.value)}
                placeholder="Write your notice here..." className="w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {Object.keys(catBorder).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="accent-teal-400" checked={pinned} onChange={e => setPinned(e.target.checked)} />
              <span className="text-sm text-white">Pin this notice</span>
            </label>
            <button onClick={handlePost} disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-sm"
              style={{ background: "#00D4AA", color: "#0A0F1E", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Posting..." : "Post Notice"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
