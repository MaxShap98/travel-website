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
  Layers,
  ExternalLink
} from "lucide-react";
import { ItineraryTable } from "./ItineraryTable";
import { ItineraryCardsView } from "./ItineraryCardsView";
import { getDayDateInfo } from "../utils/dateUtils";

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
  onRemoveDay,
  isReadOnly = false
}) {
  const isHe = lang === "he";
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'
  const [selectedDay, setSelectedDay] = useState("all");
  const [showSavedPool, setShowSavedPool] = useState(true);
  const [poolCategory, setPoolCategory] = useState("all");

  const poolCategories = [
    { id: "all", label: isHe ? "כל המקומות" : "All Places" },
    { id: "dining", label: isHe ? "🍽️ מסעדות ואוכל" : "🍽️ Dining" },
    { id: "nightlife", label: isHe ? "🍸 ברים ובילוי" : "🍸 Nightlife" },
    { id: "attractions", label: isHe ? "🏛️ אטרקציות" : "🏛️ Attractions" },
    { id: "events", label: isHe ? "⛵ פעילויות וסיורים" : "⛵ Tours" },
    { id: "hotels", label: isHe ? "🏨 מלונות ולינה" : "🏨 Hotels" },
    { id: "shopping", label: isHe ? "🛍️ קניות" : "🛍️ Shopping" },
    { id: "tips", label: isHe ? "💡 טיפים וכללי" : "💡 General" }
  ];

  const categoryLabels = {
    dining: isHe ? "מסעדה" : "Dining",
    nightlife: isHe ? "בר ובילוי" : "Nightlife",
    attractions: isHe ? "אטרקציה" : "Attraction",
    events: isHe ? "פעילות" : "Event",
    hotels: isHe ? "מלון" : "Hotel",
    shopping: isHe ? "קניות" : "Shopping",
    tips: isHe ? "כללי" : "General"
  };

  // Quick activity inline inputs per day
  const [dayInputs, setDayInputs] = useState({});
  const [dayPeriods, setDayPeriods] = useState({});

  const totalDays = trip.durationDays || 5;
  const daysList = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Map each place to which days it is currently scheduled in
  const scheduledDaysMap = useMemo(() => {
    const map = {};
    (itinerary || []).forEach((item) => {
      const d = item.dayNumber;
      if (item.linkedPlaceId) {
        if (!map[item.linkedPlaceId]) map[item.linkedPlaceId] = new Set();
        map[item.linkedPlaceId].add(d);
      }
      if (item.activity) {
        const nameKey = item.activity.trim().toLowerCase();
        if (!map[nameKey]) map[nameKey] = new Set();
        map[nameKey].add(d);
      }
    });
    return map;
  }, [itinerary]);

  const getScheduledDaysForPlace = (p) => {
    const byId = scheduledDaysMap[p.id] ? Array.from(scheduledDaysMap[p.id]) : [];
    const byName = (p.name && scheduledDaysMap[p.name.trim().toLowerCase()])
      ? Array.from(scheduledDaysMap[p.name.trim().toLowerCase()])
      : [];
    return Array.from(new Set([...byId, ...byName]));
  };

  // Filter pool places by category
  const filteredPoolPlaces = useMemo(() => {
    if (poolCategory === "all") return places;
    return places.filter((p) => p.category === poolCategory);
  }, [places, poolCategory]);

  // Filtered and deduplicated itinerary
  const filteredItinerary = useMemo(() => {
    const seen = new Set();
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
      // Guarantee no duplicate activities per day
      const key = (item.linkedPlaceId || (item.activity || "").trim().toLowerCase()) + "_d_" + item.dayNumber;
      if (seen.has(key)) return false;
      seen.add(key);
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

  const getDayMapsUrl = (dayActivities) => {
    if (!dayActivities || dayActivities.length === 0) return null;
    const dest = trip?.destination || "";

    const getItemQuery = (item) => {
      if (item.linkedPlaceId) {
        const p = places.find((x) => x.id === item.linkedPlaceId);
        if (p?.location) return `${p.name} ${p.location}`;
        if (p?.name) return `${p.name} ${dest}`;
      }
      return `${item.activity || ""} ${item.location || ""} ${dest}`.trim();
    };

    if (dayActivities.length === 1) {
      const q = getItemQuery(dayActivities[0]);
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
    }

    const origin = getItemQuery(dayActivities[0]);
    const destination = getItemQuery(dayActivities[dayActivities.length - 1]);
    const waypoints = dayActivities
      .slice(1, -1)
      .map(getItemQuery)
      .filter(Boolean);

    let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    if (waypoints.length > 0) {
      url += `&waypoints=${waypoints.map(encodeURIComponent).join("%7C")}`;
    }
    return url;
  };

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
            <div>
              {/* Category Pills inside the Pool */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-sky-100 px-4 py-2.5 bg-sky-50/50">
                {poolCategories.map((cat) => {
                  const isSelected = poolCategory === cat.id;
                  const count =
                    cat.id === "all"
                      ? places.length
                      : places.filter((p) => p.category === cat.id).length;

                  if (count === 0 && cat.id !== "all") return null;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setPoolCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-100"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Grid of Places for Selected Category */}
              <div className="p-4 bg-slate-50/40 max-h-72 overflow-y-auto space-y-2">
                {filteredPoolPlaces.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {filteredPoolPlaces.map((place) => {
                      const scheduledDaysForPlace = getScheduledDaysForPlace(place);
                      const isScheduled = scheduledDaysForPlace.length > 0;
                      return (
                        <div
                          key={place.id}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs ${
                            isScheduled
                              ? "bg-white border-sky-300 shadow-xs ring-1 ring-sky-100"
                              : "bg-white border-slate-200 shadow-xs hover:border-sky-300"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 truncate" dir="auto">
                                {place.name}
                              </span>
                              {place.rating && (
                                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded flex items-center gap-0.5 shrink-0">
                                  ★ {place.rating}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                              <span className="text-sky-700 bg-sky-50 px-1 rounded font-semibold shrink-0">
                                {categoryLabels[place.category] || place.category}
                              </span>
                              {place.location && (
                                <span className="truncate max-w-[120px]" dir="auto">
                                  {place.location}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 1-Click Day Buttons (Admin only) with live Active indicator and Toggle */}
                          {!isReadOnly && (
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[10px] text-slate-400 font-semibold hidden xs:inline">
                                {isHe ? "שבץ ב:" : "Day:"}
                              </span>
                              {daysList.map((d) => {
                                const isScheduledHere = scheduledDaysForPlace.includes(d);
                                return (
                                  <button
                                    key={d}
                                    type="button"
                                    onClick={() => onQuickSchedulePlace(place, d)}
                                    className={`px-1.5 py-0.5 rounded font-bold text-[10px] transition-all cursor-pointer whitespace-nowrap ${
                                      isScheduledHere
                                        ? "bg-sky-600 text-white shadow-xs"
                                        : "bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-800 border border-slate-200/60"
                                    }`}
                                    title={
                                      isScheduledHere
                                        ? (isHe ? `משובץ ביום ${d} - לחץ להסרה` : `Scheduled on Day ${d} - Click to remove`)
                                        : (isHe ? `שבץ ביום ${d}` : `Assign to Day ${d}`)
                                    }
                                  >
                                    {d}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400 font-semibold">
                    {isHe ? "אין מקומות שמורים בקטגוריה זו" : "No saved places in this category"}
                  </div>
                )}
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

          {/* Adjust Days Count Buttons (Admin only) */}
          {!isReadOnly && (
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
          )}
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
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-7 h-7 rounded-xl bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center">
                  {dayNum}
                </span>
                <h4 className="font-extrabold text-base text-slate-900">
                  {isHe ? `יום ${dayNum}` : `Day ${dayNum}`}
                </h4>
                <span className="text-xs text-slate-400 font-medium">
                  ({itinerary.filter((i) => i.dayNumber === dayNum).length} {isHe ? "פעילויות" : "activities"})
                </span>

                {/* 🗺️ Open Day Route / Map in Google Maps */}
                {itinerary.filter((i) => i.dayNumber === dayNum).length > 0 && (
                  <a
                    href={getDayMapsUrl(itinerary.filter((i) => i.dayNumber === dayNum))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
                    title={isHe ? `פתח את מפת יום ${dayNum} ב-Google Maps` : `Open Day ${dayNum} map on Google Maps`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span>{isHe ? `מפת יום ${dayNum} ב-Google Maps` : `Day ${dayNum} Map`}</span>
                    <ExternalLink className="w-3 h-3 text-emerald-600 opacity-70 group-hover:opacity-100" />
                  </a>
                )}
              </div>

              {/* Inline Input to add activity to this day (Admin only) */}
              {!isReadOnly && (
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
              )}
            </div>

            {/* Activities for this Day */}
            <div className="pt-3">
              {itinerary.filter((i) => i.dayNumber === dayNum).length > 0 ? (
                viewMode === "cards" ? (
                  <ItineraryCardsView
                    items={itinerary.filter((i) => i.dayNumber === dayNum)}
                    places={places}
                    destination={trip?.destination || ""}
                    currencySymbol={currencySymbol}
                    lang={lang}
                    onToggleComplete={onToggleComplete}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onEdit={onEditActivity}
                    onDelete={onDeleteActivity}
                    isReadOnly={isReadOnly}
                  />
                ) : (
                  <ItineraryTable
                    items={itinerary.filter((i) => i.dayNumber === dayNum)}
                    places={places}
                    destination={trip?.destination || ""}
                    currencySymbol={currencySymbol}
                    lang={lang}
                    onToggleComplete={onToggleComplete}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onEdit={onEditActivity}
                    onDelete={onDeleteActivity}
                    isReadOnly={isReadOnly}
                  />
                )
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
