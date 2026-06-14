import React, { useEffect, useState } from "react";
import { Plus, RefreshCw, Trash2, Copy, Check, X } from "lucide-react";
import { Glass } from "../components/Common";
import { apiService, StudentPayload } from "../services/api";

interface Student {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  course?: string;
  year?: number;
  phone?: string;
  block?: string;
  room?: { number: string; block: string } | null;
  parent?: { name: string; email: string } | null;
  mustChangePassword?: boolean;
}

const EMPTY_FORM: StudentPayload = {
  name: "", email: "", rollNumber: "", course: "",
  year: 1, phone: "", address: "", emergencyContact: "", block: "",
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<StudentPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [credential, setCredential] = useState<{ name: string; email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiService.getStudents();
      setStudents(res.students || []);
    } catch {
      setError("Failed to load students");
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
      const res = await apiService.createStudent(form);
      setCredential({ name: res.student.name, email: res.student.email, password: res.generatedPassword });
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message || "Failed to create student");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (id: string, name: string) => {
    if (!confirm(`Reset password for ${name}?`)) return;
    try {
      const res = await apiService.resetStudentPassword(id);
      setCredential({ name, email: "", password: res.generatedPassword });
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete student ${name}? This also removes their linked parent.`)) return;
    try {
      await apiService.deleteStudent(id);
      load();
    } catch (err: any) {
      setError(err.message || "Failed to delete student");
    }
  };

  const copyCredentials = () => {
    if (!credential) return;
    const text = `HostelMate Login\nEmail: ${credential.email}\nPassword: ${credential.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const f = (key: keyof StudentPayload, val: string | number) =>
    setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Students</h1>
        <button
          onClick={() => { setShowForm(true); setError(""); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "#00D4AA", color: "#0A0F1E" }}
        >
          <Plus size={16} /> Add Student
        </button>
      </div>

      {error && (
        <div className="text-sm px-4 py-3 rounded-xl" style={{ color: "#EF4444", background: "rgba(239,68,68,0.08)" }}>
          {error}
        </div>
      )}

      {/* Generated credentials banner */}
      {credential && (
        <div className="rounded-2xl p-5" style={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.25)" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: "#00D4AA" }}>
                Account created for {credential.name}
              </p>
              <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
                Share these credentials with the user — the password won't be shown again.
              </p>
              {credential.email && (
                <p className="text-sm text-white font-mono mt-2">Email: <span style={{ color: "#00D4AA" }}>{credential.email}</span></p>
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

      {/* Add student form */}
      {showForm && (
        <Glass className="p-6">
          <h3 className="font-bold text-white mb-4">New Student</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name *", key: "name", placeholder: "Natasha Avery" },
              { label: "Email *", key: "email", placeholder: "student@hostel.edu", type: "email" },
              { label: "Roll Number *", key: "rollNumber", placeholder: "CS2021045" },
              { label: "Course", key: "course", placeholder: "B.Tech Computer Science" },
              { label: "Phone", key: "phone", placeholder: "+91 9876543210", type: "tel" },
              { label: "Block", key: "block", placeholder: "A" },
              { label: "Emergency Contact", key: "emergencyContact", placeholder: "+91 9999999999" },
              { label: "Address", key: "address", placeholder: "Home address" },
            ].map(({ label, key, placeholder, type = "text" }) => (
              <div key={key}>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  required={label.endsWith("*")}
                  value={(form as any)[key]}
                  onChange={(e) => f(key as keyof StudentPayload, e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Year</label>
              <select
                value={form.year}
                onChange={(e) => f("year", Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {[1, 2, 3, 4].map((y) => <option key={y} value={y}>{y}</option>)}
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

      {/* Students table */}
      <Glass className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center" style={{ color: "#6B7280" }}>Loading...</div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center" style={{ color: "#6B7280" }}>No students yet. Add one above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Name", "Roll No.", "Course / Year", "Room", "Parent", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#6B7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{s.name}</div>
                      <div className="text-xs" style={{ color: "#6B7280" }}>{s.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "#9CA3AF" }}>{s.rollNumber}</td>
                    <td className="px-4 py-3" style={{ color: "#9CA3AF" }}>
                      {s.course ? `${s.course}` : "—"}{s.year ? `, Yr ${s.year}` : ""}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#9CA3AF" }}>
                      {s.room ? `${s.room.number} / ${s.room.block}` : "—"}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#9CA3AF" }}>
                      {s.parent ? s.parent.name : <span style={{ color: "#EF4444", fontSize: 11 }}>None</span>}
                    </td>
                    <td className="px-4 py-3">
                      {s.mustChangePassword ? (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.12)", color: "#FBB724" }}>Temp pwd</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,212,170,0.1)", color: "#00D4AA" }}>Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReset(s._id, s.name)}
                          title="Reset password"
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: "#6B7280" }}
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id, s.name)}
                          title="Delete student"
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: "#6B7280" }}
                        >
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
