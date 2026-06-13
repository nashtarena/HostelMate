import React, { useState } from "react";
import { UtensilsCrossed, Trash2, Wifi, Plus, Upload } from "lucide-react";
import { Glass, Field, Modal } from "../components/Common";

const expenses = [
  { desc: "Grocery run", cat: "Food", catIcon: UtensilsCrossed, amount: 840, split: 3, paidBy: "Priya", date: "Jun 12" },
  { desc: "Room cleaning supplies", cat: "Cleaning", catIcon: Trash2, amount: 260, split: 3, paidBy: "You", date: "Jun 10" },
  { desc: "WiFi recharge", cat: "Utilities", catIcon: Wifi, amount: 600, split: 3, paidBy: "Divya", date: "Jun 8" },
  { desc: "Late night pizza", cat: "Food", catIcon: UtensilsCrossed, amount: 720, split: 2, paidBy: "You", date: "Jun 5" },
];

export default function ExpensesPage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Expense Splitter</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#00D4AA", color: "#0A0F1E" }}>
          <Plus size={16} />Add Expense
        </button>
      </div>

      <Glass className="p-5">
        <div className="text-sm mb-1" style={{ color: "#6B7280" }}>Net Balance</div>
        <div className="text-3xl font-extrabold" style={{ color: "#10B981", fontFamily: "JetBrains Mono, monospace" }}>You are owed ₹340</div>
      </Glass>

      <div className="flex gap-4 flex-wrap">
        {[{ name: "Priya", initials: "PS", amount: "+₹280", color: "#10B981" }, { name: "Divya", initials: "DN", amount: "-₹60", color: "#EF4444" }].map((r, i) => (
          <Glass key={i} className="flex items-center gap-4 p-4 flex-1 min-w-48">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "rgba(99,102,241,0.2)", color: "#818CF8" }}>{r.initials}</div>
            <div className="flex-1">
              <div className="font-semibold text-white">{r.name}</div>
              <div className="font-bold text-sm" style={{ color: r.color, fontFamily: "JetBrains Mono, monospace" }}>{r.amount}</div>
            </div>
            <button className="text-xs px-3 py-1.5 rounded-xl font-semibold" style={{ background: "rgba(0,212,170,0.1)", color: "#00D4AA", border: "1px solid rgba(0,212,170,0.2)" }}>Settle</button>
          </Glass>
        ))}
      </div>

      <Glass className="overflow-hidden">
        <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h2 className="font-bold text-white">All Expenses</h2>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {expenses.map((e, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(99,102,241,0.15)" }}>
                <e.catIcon size={15} style={{ color: "#818CF8" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm">{e.desc}</div>
                <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Split among {e.split} · Paid by {e.paidBy}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>₹{e.amount}</div>
                <div className="text-xs" style={{ color: "#6B7280" }}>{e.date}</div>
              </div>
            </div>
          ))}
        </div>
      </Glass>

      {showModal && (
        <Modal title="Add Expense" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <Field label="Description" placeholder="What was this expense for?" />
            <Field label="Amount (₹)" type="number" placeholder="0" />
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: "#9CA3AF" }}>Category</label>
              <div className="flex gap-2">
                {[ ["Food", UtensilsCrossed], ["Cleaning", Trash2], ["Utilities", Wifi] ].map(([c, Icon]: any) => (
                  <button key={c as string} className="flex-1 py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Icon size={14} />{c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#9CA3AF" }}>Split Among</p>
              {["Priya Sharma", "Divya Nair"].map(n => (
                <label key={n} className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="checkbox" className="accent-teal-400" defaultChecked />
                  <span className="text-sm text-white">{n}</span>
                </label>
              ))}
            </div>
            <button onClick={() => setShowModal(false)} className="w-full py-3 rounded-xl font-bold text-sm mt-1" style={{ background: "#00D4AA", color: "#0A0F1E" }}>Add Expense</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
