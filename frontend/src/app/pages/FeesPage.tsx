import React from "react";
import { FileText } from "lucide-react";
import { Glass, Badge } from "../components/Common";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

const feeRows = [
  { type: "Hostel Rent", month: "June 2024", amount: "₹4,200", due: "Jul 1", status: "Pending" },
  { type: "Mess Charges", month: "June 2024", amount: "₹2,800", due: "Jul 1", status: "Pending" },
  { type: "Hostel Rent", month: "May 2024", amount: "₹4,200", due: "Jun 1", status: "Paid" },
  { type: "Mess Charges", month: "May 2024", amount: "₹2,800", due: "Jun 1", status: "Paid" },
  { type: "Electricity", month: "May 2024", amount: "₹320", due: "Jun 1", status: "Overdue" },
];
const elecData = [ { month: "Jan", units: 45 }, { month: "Feb", units: 38 }, { month: "Mar", units: 52 }, { month: "Apr", units: 61 }, { month: "May", units: 49 }, { month: "Jun", units: 71 }, { month: "Jul", units: 55 } ];

export default function FeesPage() {
  const statusVariant = (s: string) => s === "Paid" ? "green" : s === "Overdue" ? "red" : "yellow";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-white">Fee & Billing</h1>

      <Glass className="p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm mb-1" style={{ color: "#6B7280" }}>Total Outstanding</div>
          <div className="text-4xl font-extrabold" style={{ color: "#00D4AA", fontFamily: "JetBrains Mono, monospace" }}>₹7,320</div>
          <div className="text-sm mt-1" style={{ color: "#6B7280" }}>Due by July 1, 2024</div>
        </div>
        <button className="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90" style={{ background: "#00D4AA", color: "#0A0F1E" }}>Pay Now</button>
      </Glass>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Glass className="overflow-hidden">
            <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <h2 className="font-bold text-white">Fee Breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    { ["Type", "Month", "Amount", "Due Date", "Status", "Action"].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-semibold" style={{ color: "#6B7280" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feeRows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td className="px-5 py-3 text-white">{r.type}</td>
                      <td className="px-5 py-3" style={{ color: "#6B7280" }}>{r.month}</td>
                      <td className="px-5 py-3 font-semibold text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>{r.amount}</td>
                      <td className="px-5 py-3" style={{ color: "#6B7280" }}>{r.due}</td>
                      <td className="px-5 py-3"><Badge label={r.status} variant={statusVariant(r.status) as any} /></td>
                      <td className="px-5 py-3">{r.status !== "Paid" && (<button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ border: "1px solid #00D4AA", color: "#00D4AA" }}>Pay</button>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Glass>
        </div>

        <Glass className="p-5">
          <h2 className="font-bold text-white mb-4">Payment History</h2>
          <div className="flex flex-col gap-3">
            {feeRows.filter(r => r.status === "Paid").map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
                  <FileText size={14} style={{ color: "#10B981" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{r.type}</div>
                  <div className="text-xs" style={{ color: "#6B7280" }}>{r.month}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold" style={{ color: "#10B981", fontFamily: "JetBrains Mono, monospace" }}>{r.amount}</div>
                  <button className="text-xs mt-0.5" style={{ color: "#00D4AA" }}>Receipt</button>
                </div>
              </div>
            ))}
          </div>
        </Glass>
      </div>

      <Glass className="p-5">
        <h2 className="font-bold text-white mb-4">Electricity Usage (Units)</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={elecData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#F9FAFB" }} />
            <Bar dataKey="units" fill="#00D4AA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Glass>
    </div>
  );
}
