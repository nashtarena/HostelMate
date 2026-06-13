import React, { useState } from "react";
import { Coffee, Sandwich, Cookie, Moon } from "lucide-react";
import { Glass } from "../components/Common";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const messMenu = {
  Breakfast: ["Idli Sambar", "Poha", "Boiled Eggs", "Toast & Butter", "Chai"],
  Lunch: ["Dal Tadka", "Aloo Gobi", "Jeera Rice", "Roti", "Salad", "Buttermilk"],
  Snacks: ["Samosa", "Chai", "Bread Pakora", "Banana"],
  Dinner: ["Paneer Butter Masala", "Chapati", "Rice", "Dal Fry", "Kheer"],
};
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const mealIcons: any = { Breakfast: Coffee, Lunch: Sandwich, Snacks: Cookie, Dinner: Moon };
const ratingData = Array.from({ length: 10 }, (_, i) => ({ day: `Jun ${i + 1}`, rating: 3.2 + Math.random() * 1.6 }));

export default function MessPage() {
  const [activeDay, setActiveDay] = useState(3);
  const [mealTab, setMealTab] = useState<keyof typeof messMenu>("Breakfast");
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const tags = ["Too Spicy 🌶", "Cold ❄", "Undercooked", "Loved it ❤", "Portion Small"];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-white">Mess Menu</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d, i) => (
          <button key={d} onClick={() => setActiveDay(i)} className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200" style={{ background: activeDay === i ? "#00D4AA" : "rgba(255,255,255,0.05)", color: activeDay === i ? "#0A0F1E" : "#6B7280" }}>{d}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.entries(messMenu) as [keyof typeof messMenu, string[]][]).map(([meal, items]) => {
          const Icon = mealIcons[meal];
          return (
            <Glass key={meal} className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,212,170,0.15)" }}>
                  <Icon size={16} style={{ color: "#00D4AA" }} />
                </div>
                <h3 className="font-bold text-white">{meal}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "#D1D5DB" }}>{item}</span>
                ))}
              </div>
            </Glass>
          );
        })}
      </div>

      <Glass className="p-5">
        <h2 className="font-bold text-white mb-4">How was today's food?</h2>
        <div className="flex gap-2 mb-4 flex-wrap">
          {(Object.keys(messMenu) as (keyof typeof messMenu)[]).map(t => (
            <button key={t} onClick={() => setMealTab(t)} className="px-3 py-1 text-sm font-medium rounded-full transition-all" style={{ background: mealTab === t ? "rgba(0,212,170,0.15)" : "transparent", color: mealTab === t ? "#00D4AA" : "#6B7280", border: "1px solid", borderColor: mealTab === t ? "rgba(0,212,170,0.3)" : "rgba(255,255,255,0.06)" }}>{t}</button>
          ))}
        </div>
        <div className="flex gap-3 mb-4">
          { ["😍", "😊", "😐", "😕", "😤"].map((e, i) => (
            <button key={i} onClick={() => setMoodRating(i)} className="text-3xl transition-all duration-150 hover:scale-125" style={{ opacity: moodRating === null || moodRating === i ? 1 : 0.3 }}>{e}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <button key={tag} onClick={() => setSelectedTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag])} className="text-xs px-3 py-1.5 rounded-full transition-all duration-150" style={{ background: selectedTags.includes(tag) ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.05)", color: selectedTags.includes(tag) ? "#00D4AA" : "#9CA3AF", border: "1px solid", borderColor: selectedTags.includes(tag) ? "rgba(0,212,170,0.3)" : "rgba(255,255,255,0.06)" }}>{tag}</button>
          ))}
        </div>
        <textarea rows={2} placeholder="Additional comments..." className="w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none mb-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
        <button className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#00D4AA", color: "#0A0F1E" }}>Submit Feedback</button>
      </Glass>

      <Glass className="p-5">
        <h2 className="font-bold text-white mb-4">Rating Trends (Last 10 Days)</h2>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={ratingData}>
            <defs>
              <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[3, 5]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} />
            <Area type="monotone" dataKey="rating" stroke="#00D4AA" fill="url(#ratingGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Glass>
    </div>
  );
}
