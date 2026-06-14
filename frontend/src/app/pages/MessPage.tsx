import React, { useEffect, useState } from "react";
import { Coffee, Sandwich, Cookie, Moon } from "lucide-react";
import { Glass } from "../components/Common";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { apiService } from "../services/api";

const mealIcons: Record<string, React.ElementType> = {
  Breakfast: Coffee,
  Lunch: Sandwich,
  Snacks: Cookie,
  Dinner: Moon,
};

const MEAL_KEYS = ["Breakfast", "Lunch", "Snacks", "Dinner"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface DayMenu {
  dayLabel: string;
  breakfast: string[];
  lunch: string[];
  snacks: string[];
  dinner: string[];
}

export default function MessPage() {
  const [activeDay, setActiveDay] = useState(0);
  const [mealTab, setMealTab] = useState("Breakfast");
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [weekMenus, setWeekMenus] = useState<DayMenu[]>([]);
  const [ratingData, setRatingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [comment, setComment] = useState("");

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();
  const isWarden = user?.role === "warden" || user?.role === "admin";

  const tags = ["Too Spicy 🌶", "Cold ❄", "Undercooked", "Loved it ❤", "Portion Small"];

  useEffect(() => {
    Promise.allSettled([
      apiService.getWeekMenu(),
      apiService.getRatingTrends(),
    ]).then(([menuRes, ratingsRes]) => {
      if (menuRes.status === "fulfilled") {
        const data: any = menuRes.value;
        const menus: DayMenu[] = (data.menus || data || []).map((m: any) => ({
          dayLabel: m.dayLabel || m.date?.slice(0, 3) || "Day",
          breakfast: m.breakfast || [],
          lunch: m.lunch || [],
          snacks: m.snacks || [],
          dinner: m.dinner || [],
        }));
        setWeekMenus(menus);
        // Set active day to today
        const todayIdx = new Date().getDay();
        const mapped = todayIdx === 0 ? 6 : todayIdx - 1;
        setActiveDay(Math.min(mapped, menus.length - 1));
      }
      if (ratingsRes.status === "fulfilled") {
        const data: any = ratingsRes.value;
        setRatingData(data.ratings || data || []);
      }
      setLoading(false);
    });
  }, []);

  const currentMenu = weekMenus[activeDay];
  const currentItems: string[] = currentMenu
    ? (currentMenu as any)[mealTab.toLowerCase()] || []
    : [];

  const dayLabels = weekMenus.length > 0
    ? weekMenus.map((m) => m.dayLabel)
    : DAY_LABELS;

  const handleFeedback = async () => {
    if (moodRating === null) return;
    setSubmitting(true);
    try {
      await apiService.submitFeedback({
        rating: 5 - moodRating, // 😍=5, 😊=4, 😐=3, 😕=2, 😤=1
        tags: selectedTags,
        comment,
        meal: mealTab.toLowerCase(),
      });
      setSubmitted(true);
      setMoodRating(null);
      setSelectedTags([]);
      setComment("");
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-white">Mess Menu</h1>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {dayLabels.map((d, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: activeDay === i ? "#00D4AA" : "rgba(255,255,255,0.05)",
              color: activeDay === i ? "#0A0F1E" : "#6B7280",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Meal cards */}
      {loading ? (
        <div className="text-sm" style={{ color: "#6B7280" }}>Loading menu...</div>
      ) : weekMenus.length === 0 ? (
        <Glass className="p-8 text-center">
          <p className="text-white font-semibold">No menu available</p>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {isWarden ? "Use the button below to add this week's menu." : "Check back later."}
          </p>
        </Glass>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MEAL_KEYS.map((meal) => {
            const Icon = mealIcons[meal] || Coffee;
            const items: string[] = currentMenu
              ? (currentMenu as any)[meal.toLowerCase()] || []
              : [];
            return (
              <Glass key={meal} className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(0,212,170,0.15)" }}>
                    <Icon size={16} style={{ color: "#00D4AA" }} />
                  </div>
                  <h3 className="font-bold text-white">{meal}</h3>
                </div>
                {items.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(255,255,255,0.06)", color: "#D1D5DB" }}>
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: "#6B7280" }}>Not available</p>
                )}
              </Glass>
            );
          })}
        </div>
      )}

      {/* Feedback — students only */}
      {!isWarden && (
        <Glass className="p-5">
          <h2 className="font-bold text-white mb-4">How was today's food?</h2>
          <div className="flex gap-2 mb-4 flex-wrap">
            {MEAL_KEYS.map((t) => (
              <button
                key={t}
                onClick={() => setMealTab(t)}
                className="px-3 py-1 text-sm font-medium rounded-full transition-all"
                style={{
                  background: mealTab === t ? "rgba(0,212,170,0.15)" : "transparent",
                  color: mealTab === t ? "#00D4AA" : "#6B7280",
                  border: "1px solid",
                  borderColor: mealTab === t ? "rgba(0,212,170,0.3)" : "rgba(255,255,255,0.06)",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          {submitted ? (
            <p className="text-sm font-semibold" style={{ color: "#00D4AA" }}>Thanks for your feedback!</p>
          ) : (
            <>
              <div className="flex gap-3 mb-4">
                {["😍", "😊", "😐", "😕", "😤"].map((e, i) => (
                  <button key={i} onClick={() => setMoodRating(i)}
                    className="text-3xl transition-all duration-150 hover:scale-125"
                    style={{ opacity: moodRating === null || moodRating === i ? 1 : 0.3 }}>
                    {e}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTags((t) => t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag])}
                    className="text-xs px-3 py-1.5 rounded-full transition-all duration-150"
                    style={{
                      background: selectedTags.includes(tag) ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.05)",
                      color: selectedTags.includes(tag) ? "#00D4AA" : "#9CA3AF",
                      border: "1px solid",
                      borderColor: selectedTags.includes(tag) ? "rgba(0,212,170,0.3)" : "rgba(255,255,255,0.06)",
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Additional comments..."
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none mb-3"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <button
                onClick={handleFeedback}
                disabled={moodRating === null || submitting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: "#00D4AA", color: "#0A0F1E",
                  opacity: moodRating === null || submitting ? 0.5 : 1,
                }}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </>
          )}
        </Glass>
      )}

      {/* Rating trends */}
      {ratingData.length > 0 && (
        <Glass className="p-5">
          <h2 className="font-bold text-white mb-4">Rating Trends</h2>
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
              <YAxis domain={[1, 5]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} />
              <Area type="monotone" dataKey="rating" stroke="#00D4AA" fill="url(#ratingGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Glass>
      )}
    </div>
  );
}
