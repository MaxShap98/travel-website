import React, { useState } from "react";
import { X, CalendarPlus, Clock, MapPin, Check } from "lucide-react";

export function AddToItineraryModal({
  place,
  trip,
  isOpen,
  onClose,
  onSchedule,
  lang = "he"
}) {
  if (!isOpen || !place || !trip) return null;

  const isHe = lang === "he";
  const [dayNumber, setDayNumber] = useState(1);
  const [period, setPeriod] = useState("Evening");
  const [time, setTime] = useState("18:30");
  const [notes, setNotes] = useState(place.notes || "");

  const totalDays = trip.durationDays || 7;
  const daysList = Array.from({ length: totalDays }, (_, i) => i + 1);

  const handleConfirm = (e) => {
    e.preventDefault();

    const newActivity = {
      id: "itin-" + Date.now(),
      dayNumber: parseInt(dayNumber),
      dayLabel: isHe ? `יום ${dayNumber}` : `Day ${dayNumber}`,
      period,
      time: time.trim() || "18:30",
      activity: place.name,
      category: place.category,
      linkedPlaceId: place.id,
      location: place.location || "",
      cost: place.cost || 0,
      bookingStatus: place.status === "Booked" ? "Confirmed" : "Planned",
      notes: notes.trim(),
      completed: false
    };

    onSchedule(newActivity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in no-print">
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden"
        dir={isHe ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-700 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-sky-200" />
            <h3 className="text-base font-bold">
              {isHe ? "שיבוץ מקום ללו״ז היומי" : "Schedule into Itinerary"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Place Preview Card */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center gap-3">
          <img
            src={place.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"}
            alt={place.name}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-800 truncate">{place.name}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{place.location || (isHe ? "יוון" : "Destination")}</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">
              {isHe ? "סטטוס:" : "Status:"} {place.status} {place.cost > 0 && `· ~${trip.currencySymbol || "€"}${place.cost}`}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleConfirm} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHe ? "בחר יום בטיול" : "Select Day"}
              </label>
              <select
                value={dayNumber}
                onChange={(e) => setDayNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {daysList.map((d) => (
                  <option key={d} value={d}>
                    {isHe ? `יום ${d}` : `Day ${d}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHe ? "חלק ביום" : "Time Period"}
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Morning">{isHe ? "🌅 בוקר" : "🌅 Morning"}</option>
                <option value="Afternoon">{isHe ? "☀️ צהריים" : "☀️ Afternoon"}</option>
                <option value="Evening">{isHe ? "🌇 ערב" : "🌇 Evening"}</option>
                <option value="Night">{isHe ? "🌙 לילה" : "🌙 Night"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isHe ? "שעה מתוכננת (משוערת)" : "Scheduled Time"}
            </label>
            <input
              type="text"
              placeholder={isHe ? "18:30" : "18:30 PM"}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isHe ? "הערות ללו״ז (אופציונלי)" : "Itinerary Notes"}
            </label>
            <textarea
              rows="2"
              placeholder={
                isHe
                  ? "למשל: לבקש שולחן מול השקיעה, להגיע קצת לפני..."
                  : "e.g. Sunset reservation, ask for outdoor seating"
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium text-xs cursor-pointer"
            >
              {isHe ? "ביטול" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isHe ? "שבץ בלו״ז היומי" : "Confirm Schedule"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
