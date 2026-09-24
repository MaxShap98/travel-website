import React, { useState, useMemo } from "react";
import {
  Table as TableIcon,
  LayoutGrid,
  Calendar,
  Filter,
  Plus,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Sun,
  Sunset,
  Moon,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Trash2,
  Edit2,
  Layers
} from "lucide-react";
import { ItineraryTable } from "./ItineraryTable";
import { ItineraryCardsView } from "./ItineraryCardsView";

export function ItineraryView({
  trip,
  itinerary = [],
  places = [],
  currencySymbol = "€",
  searchQuery = "",
  lang = "he",
  onToggleComplete,
  onMoveUp,
  onMoveDown,
  onMoveToDay,
  onEditActivity,
  onDeleteActivity,
  onQuickAddActivity,
  onQuickSchedulePlace,
  onAddDay,
  onRemoveDay
}) {
  const isHe = lang === "he";
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'
  const [selectedDay, setSelectedDay] = useState("all");
  const [showSavedPool, setShowSavedPool] = useState(true);

  // Quick activity inline inputs per day
  const [dayInputs, setDayInputs] = useState({});
  const [dayPeriods, setDayPeriods] = useState({});

  const totalDays = trip.durationDays || 5;
  const daysList = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Filtered itinerary
  const filteredItinerary = useMemo(() => {
    return itinerary.filter((item) => {
      if (selectedDay !== "all" && item.dayNumber !== parseInt(selectedDay)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mAct = item.activity?.toLowerCase().includes(q);
        const mLoc = item.location?.toLowerCase().includes(q);
        const mNote = item.notes?.toLowerCase().includes(q);
        if (!mAct && !mLoc && !mNote) return false;
      }
      return true;
    });
  }, [itinerary, selectedDay, searchQuery]);

  // Which places are scheduled vs unscheduled
  const unscheduledPlaces = useMemo(() => {
    const scheduledPlaceIds = new Set(
      itinerary.map((i) => i.linkedPlaceId).filter(Boolean)
    );
    const scheduledNames = new Set(
      itinerary.map((i) => i.activity.trim().toLowerCase())
    );

    return places.filter(
      (p) => !scheduledPlaceIds.has(p.id) && !scheduledNames.has(p.name.trim().toLowerCase())
    );
  }, [places, itinerary]);

  const handleInlineAdd = (dayNum, e) => {
    e.preventDefault();
    const text = dayInputs[dayNum]?.trim();
    if (!text) return;

    const period = dayPeriods[dayNum] || "Morning";

    onQuickAddActivity({
      id: "itin-" + Date.now(),
      dayNumber: dayNum,
      dayLabel: isHe ? `יום ${dayNum}` : `Day ${dayNum}`,
      period,
      time: "",
      activity: text,
      category: "attractions",
      cost: 0,
      bookingStatus: "Planned",
      completed: false
    });

    setDayInputs((prev) => ({ ...prev, [dayNum]: "" }));
  };

  const completedCount = itinerary.filter((item) => item.completed).length;
  const totalCount = itinerary.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 📦 Saved Places Bank / Pool for Easy Assembling */}
      {places.length > 0 && (
        <div className="bg-white rounded-2xl border border-sky-200 shadow-xs overflow-hidden">
          <div
            onClick={() => setShowSavedPool(!showSavedPool)}
            className="p-4 bg-gradient-to-r from-sky-50 to-indigo-50/60 border-b border-sky-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-600 text-white rounded-lg">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">
                  {isHe ? "בנק המקומות ששמרת – מוכנים לשיבוץ בלו״ז" : "Your Saved Places Pool (Ready to Slot in)"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHe
                    ? `יש לך ${places.length} מקומות שמורים (${unscheduledPlaces.length} טרם שובצו). לחץ על יום כדי לשבץ מיד!`
                    : `${places.length} places saved (${unscheduledPlaces.length} unscheduled). Click any day to assign!`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
              <span>{showSavedPool ? (isHe ? "הסתר" : "Hide") : (isHe ? "הצג" : "Show")}</span>
              {showSavedPool ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>

          {showSavedPool && (
            <div className="p-4 bg-slate-50/50 max-h-56 overflow-y-auto space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {places.map((place) => {
                  const isScheduled = !unscheduledPlaces.some((u) => u.id === place.id);
                  return (
                    <div
                      key={place.id}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs ${
                        isScheduled
                          ? "bg-slate-100/80 border-slate-200 opacity-70"
                          : "bg-white border-sky-200 shadow-xs hover:border-sky-400"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 truncate" dir="auto">
                          {place.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {place.location || place.category}
                        </div>
                      </div>

                      {/* 1-Click Day Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {isHe ? "שבץ ב:" : "Day:"}
                        </span>
                        {daysList.slice(0, 5).map((d) => (
                          <button
                            key={d}
                            onClick={() => onQuickSchedulePlace(place, d)}
                            className="px-1.5 py-0.5 bg-sky-50 hover:bg-sky-600 hover:text-white border border-sky-200 rounded font-bold text-[10px] transition-colors cursor-pointer"
                            title={isHe ? `שבץ ביום ${d}` : `Assign to Day ${d}`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Controls: Day Selector, View Mode, Adjust Days */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Day Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedDay("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedDay === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {isHe ? "כל הימים" : "All Days"} ({itinerary.length})
          </button>
          {daysList.map((d) => {
            const count = itinerary.filter((i) => i.dayNumber === d).length;
            const isSel = selectedDay === d.toString();
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d.toString())}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSel
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{isHe ? `יום ${d}` : `Day ${d}`}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSel ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Adjust Days Count Buttons */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <button
              onClick={onAddDay}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition-colors cursor-pointer whitespace-nowrap"
              title={isHe ? "הוסף יום נוסף לטיול" : "Add extra day"}
            >
              + {isHe ? "יום" : "Day"}
            </button>
            {totalDays > 1 && (
              <button
                onClick={onRemoveDay}
                className="px-2 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                title={isHe ? "הסר את היום האחרון" : "Remove last day"}
              >
                -
              </button>
            )}
          </div>
        </div>

        {/* View Switcher: Table vs Cards */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>{isHe ? "טבלה" : "Table"}</span>
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "cards" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{isHe ? "כרטיסים" : "Cards"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ⚡ Inline Quick Activity Adders for Selected Day or All Days */}
      {(selectedDay !== "all" ? [parseInt(selectedDay)] : daysList).map((dayNum) => (
        <div key={dayNum} className="space-y-3">
          {/* Day Section Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center">
                  {dayNum}
                </span>
                <h4 className="font-extrabold text-base text-slate-900">
                  {isHe ? `יום ${dayNum}` : `Day ${dayNum}`}
                </h4>
                <span className="text-xs text-slate-400 font-medium">
                  ({itinerary.filter((i) => i.dayNumber === dayNum).length} {isHe ? "פעילויות" : "activities"})
                </span>
              </div>

              {/* Inline Input to add activity to this day */}
              <form
                onSubmit={(e) => handleInlineAdd(dayNum, e)}
                className="flex items-center gap-2 flex-1 max-w-xl"
              >
                <input
                  type="text"
                  dir="auto"
                  value={dayInputs[dayNum] || ""}
                  onChange={(e) =>
                    setDayInputs({ ...dayInputs, [dayNum]: e.target.value })
                  }
                  placeholder={
                    isHe
                      ? `+ הוסף פעילות ליום ${dayNum} (לחץ Enter)...`
                      : `+ Add activity to Day ${dayNum} (press Enter)...`
                  }
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />

                <select
                  value={dayPeriods[dayNum] || "Morning"}
                  onChange={(e) =>
                    setDayPeriods({ ...dayPeriods, [dayNum]: e.target.value })
                  }
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="Morning">🌅 {isHe ? "בוקר" : "Morning"}</option>
                  <option value="Afternoon">☀️ {isHe ? "צהריים" : "Afternoon"}</option>
                  <option value="Evening">🌇 {isHe ? "ערב" : "Evening"}</option>
                  <option value="Night">🌙 {isHe ? "לילה" : "Night"}</option>
                </select>

                <button
                  type="submit"
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  {isHe ? "הוסף" : "Add"}
                </button>
              </form>
            </div>

            {/* Activities for this Day */}
            <div className="pt-3">
              {itinerary.filter((i) => i.dayNumber === dayNum).length > 0 ? (
                <ItineraryTable
                  items={itinerary.filter((i) => i.dayNumber === dayNum)}
                  currencySymbol={currencySymbol}
                  lang={lang}
                  onToggleComplete={onToggleComplete}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  onEdit={onEditActivity}
                  onDelete={onDeleteActivity}
                />
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                  {isHe
                    ? `לו״ז יום ${dayNum} עדיין ריק. הקלד פעילות למעלה או שבץ מקום מהבנק!`
                    : `Day ${dayNum} is empty. Type an activity above or assign a saved place!`}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
