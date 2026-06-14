import React, { useEffect, useState } from "react";
import { Plus, RefreshCw, Trash2, Copy, Check, X } from "lucide-react";
import { Glass } from "../components/Common";
import { apiService, ParentPayload } from "../services/api";

interface Parent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  relation?: string;
  mustChangePassword?: boolean;
  student?: { _id: string; name: string; rollNumber: string };
}

interface Student { _id: string; name: string; rollNumber: string; }

const EMPTY_FORM: ParentPayload = { name: "", email: "", phone: "", relation: "Father", studentId: "" };

export default function AdminParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ParentPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [credential, setCredential] = useState<{ name: string; email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [parentsRes, studentsRes] = await Promise.all([
        apiService.getParents(),
        apiService.getStudents(),
      ]);
      setParents(parentsRes.parents || []);
      setStudents(studentsRes.students || []);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await apiService.createParent(form);
      setCredential({ name: res.parent.name, email: res.parent.email, password: res.generatedPassword });
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message || "Failed to create parent");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (id: string, name: string) => {
    if (!confirm(`Reset password for ${name}?`)) return;
    try {
      const res = await apiService.resetParentPassword(id);
      setCredential({ name, email: "", password: res.generatedPassword });
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete parent account for ${name}?`)) return;
    try {
      await apiService.deleteParent(id);
      load();
    } catch (err: any) {
      setError(err.message || "Failed to delete parent");
    }
  };

  const copyCredentials = () => {
    if (!credential) return;
    const text = `HostelMate Login\nEmail: ${credential.email}\nPassword: ${credential.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const f = (key: keyof ParentPayload, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Parents</h1>
        <button
          onClick={() => { setShowForm(true); setError(""); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "#00D4AA", color: "#0A0F1E" }}
        >
          <Plus size={16} /> Add Parent
        </button>
      </div>

      {error && (
        <div className="text-sm px-4 py-3 rounded-xl" style={{ color: "#EF4444", background: "rgba(239,68,68,0.08)" }}>
          {error}
        </div>
      )}

      {credential && (
        <div className="rounded-2xl p-5" style={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.25)" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#00D4AA" }}>
                Account created for {credential.name}
              </p>
              <p className="text-xs mb-2" style={{ color: "#9CA3AF" }}>
                Share these credentials — the password won't be shown again.
              </p>
              {credential.email && (
                <p className="text-sm text-white font-mono">Email: <span style={{ color: "#00D4AA" }}>{credential.email}</span></p>
              )}
              <p className="text-sm text-white font-mono">
                Password: <span style={{ color: "#00D4AA" }}>{credential.password}</span>
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={copyCredentials}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: "rgba(0,212,170,0.15)", color: "#00D4AA" }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={() => setCredential(null)}>
                <X size={16} style={{ color: "#6B7280" }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <Glass className="p-6">
          <h3 className="font-bold text-white mb-4">New Parent Account</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name *", key: "name", placeholder: "Robert Avery" },
              { label: "Email *", key: "email", placeholder: "parent@hostel.edu", type: "email" },
              { label: "Phone", key: "phone", placeholder: "+91 9876543210", type: "tel" },
            ].map(({ label, key, placeholder, type = "text" }) => (
              <div key={key}>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  required={label.endsWith("*")}
                  value={(form as any)[key]}
                  onChange={(e) => f(key as keyof ParentPayload, e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Relation</label>
              <select
                value={form.relation}
                onChange={(e) => f("relation", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {["Father", "Mother", "Guardian"].map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Linked Student *</label>
              <select
                required
                value={form.studentId}
                onChange={(e) => f("studentId", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <option value="">— Select student —</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex gap-3 justify-end mt-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF" }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="px-5 py-2 rounded-xl text-sm font-bold"
                style={{ background: "#00D4AA", color: "#0A0F1E", opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Creating..." : "Create & Generate Password"}
              </button>
            </div>
          </form>
        </Glass>
      )}

      <Glass className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center" style={{ color: "#6B7280" }}>Loading...</div>
        ) : parents.length === 0 ? (
          <div className="p-8 text-center" style={{ color: "#6B7280" }}>No parent accounts yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Name", "Relation", "Student", "Phone", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#6B7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parents.map((p) => (
                  <tr key={p._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-xs" style={{ color: "#6B7280" }}>{p.email}</div>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#9CA3AF" }}>{p.relation || "—"}</td>
                    <td className="px-4 py-3">
                      {p.student ? (
                        <div>
                          <div className="text-white">{p.student.name}</div>
                          <div className="text-xs font-mono" style={{ color: "#6B7280" }}>{p.student.rollNumber}</div>
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#9CA3AF" }}>{p.phone || "—"}</td>
                    <td className="px-4 py-3">
                      {p.mustChangePassword ? (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.12)", color: "#FBB724" }}>Temp pwd</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,212,170,0.1)", color: "#00D4AA" }}>Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleReset(p._id, p.name)} title="Reset password"
                          className="p-1.5 rounded-lg" style={{ color: "#6B7280" }}>
                          <RefreshCw size={14} />
                        </button>
                        <button onClick={() => handleDelete(p._id, p.name)} title="Delete"
                          className="p-1.5 rounded-lg" style={{ color: "#6B7280" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Glass>
    </div>
  );
}
