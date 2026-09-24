import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, MapPin, DollarSign, Tag, CheckSquare } from "lucide-react";

export function ItineraryModal({
  isOpen,
  onClose,
  onSaveActivity,
  activityToEdit = null,
  trip,
  places = [],
  lang = "he"
}) {
  if (!isOpen || !trip) return null;

  const isHe = lang === "he";
  const isEdit = !!activityToEdit;
  const totalDays = trip.durationDays || 7;
  const daysList = Array.from({ length: totalDays }, (_, i) => i + 1);

  const [dayNumber, setDayNumber] = useState(1);
  const [period, setPeriod] = useState("Morning");
  const [time, setTime] = useState("09:00 AM");
  const [activity, setActivity] = useState("");
  const [category, setCategory] = useState("attractions");
  const [linkedPlaceId, setLinkedPlaceId] = useState("");
  const [location, setLocation] = useState("");
  const [cost, setCost] = useState(0);
  const [bookingStatus, setBookingStatus] = useState("Need to Book");
  const [notes, setNotes] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (activityToEdit) {
      setDayNumber(activityToEdit.dayNumber || 1);
      setPeriod(activityToEdit.period || "Morning");
      setTime(activityToEdit.time || "09:00 AM");
      setActivity(activityToEdit.activity || "");
      setCategory(activityToEdit.category || "attractions");
      setLinkedPlaceId(activityToEdit.linkedPlaceId || "");
      setLocation(activityToEdit.location || "");
      setCost(activityToEdit.cost || 0);
      setBookingStatus(activityToEdit.bookingStatus || "Need to Book");
      setNotes(activityToEdit.notes || "");
      setCompleted(activityToEdit.completed || false);
    } else {
      setDayNumber(1);
      setPeriod("Morning");
      setTime("09:30 AM");
      setActivity("");
      setCategory("attractions");
      setLinkedPlaceId("");
      setLocation("");
      setCost(25);
      setBookingStatus("Confirmed");
      setNotes("");
      setCompleted(false);
    }
  }, [activityToEdit]);

  // Autofill when a recommendation place is chosen
  const handlePlaceSelect = (placeId) => {
    setLinkedPlaceId(placeId);
    if (!placeId) return;

    const found = places.find((p) => p.id === placeId);
    if (found) {
      setActivity(found.name);
      setCategory(found.category);
      setLocation(found.location || "");
      setCost(found.cost || 0);
      setBookingStatus(found.status === "Booked" ? "Confirmed" : "Planned");
      if (found.notes) setNotes(found.notes);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activity.trim()) return;

    const updated = {
      id: activityToEdit ? activityToEdit.id : "itin-" + Date.now(),
      dayNumber: parseInt(dayNumber),
      dayLabel: isHe ? `יום ${dayNumber}` : `Day ${dayNumber}`,
      period,
      time: time.trim() || "TBD",
      activity: activity.trim(),
      category,
      linkedPlaceId: linkedPlaceId || null,
      location: location.trim(),
      cost: parseFloat(cost) || 0,
      bookingStatus,
      notes: notes.trim(),
      completed
    };

    onSaveActivity(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in no-print">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        dir={isHe ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-800 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold">
              {isEdit
                ? isHe
                  ? "עריכת פעילות בלו״ז"
                  : "Edit Itinerary Item"
                : isHe
                ? "הוספת פעילות ללו״ז היומי"
                : "Add Itinerary Activity"}
            </h3>
            <p className="text-sky-200 text-xs">
              {isHe
                ? "תזמון ומעקב אחר לו״ז הפעילויות היומי"
                : "Schedule and track daily vacation events"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Link to Curated Recommendation Place Dropdown */}
          <div className="p-3 bg-sky-50/70 border border-sky-200/80 rounded-xl">
            <label className="block text-[11px] font-bold text-sky-900 uppercase tracking-wider mb-1">
              {isHe ? "שיוך למקום שמור מהבנק (אופציונלי)" : "Link to Curated Place (Optional)"}
            </label>
            <select
              value={linkedPlaceId}
              onChange={(e) => handlePlaceSelect(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-sky-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="">
                {isHe ? "-- או הקלד פעילות עצמאית למטה --" : "-- Or enter custom activity below --"}
              </option>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isHe ? "יום בטיול *" : "Trip Day *"}
              </label>
              <select
                value={dayNumber}
                onChange={(e) => setDayNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {daysList.map((d) => (
                  <option key={d} value={d}>
                    {isHe ? `יום ${d}` : `Day ${d}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isHe ? "חלק ביום *" : "Period *"}
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Morning">{isHe ? "🌅 בוקר" : "🌅 Morning"}</option>
                <option value="Afternoon">{isHe ? "☀️ צהריים" : "☀️ Afternoon"}</option>
                <option value="Evening">{isHe ? "🌇 ערב" : "🌇 Evening"}</option>
                <option value="Night">{isHe ? "🌙 לילה" : "🌙 Night"}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                {isHe ? "שם הפעילות / המקום *" : "Activity / Place Name *"}
              </label>
              <input
                type="text"
                required
                placeholder={isHe ? "למשל: סיור מודרך, תצפית שקיעה, ארוחת ערב בטברנה..." : "e.g. Acropolis Guided Tour"}
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isHe ? "שעה (למשל 09:30)" : "Time (e.g. 08:30)"}
              </label>
              <input
                type="text"
                placeholder={isHe ? "09:30" : "09:00 AM"}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isHe ? "קטגוריה" : "Category"}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="hotels">{isHe ? "🏨 מלון / לינה" : "🏨 Hotel / Stay"}</option>
                <option value="dining">{isHe ? "🍽️ מסעדה / אוכל" : "🍽️ Dining"}</option>
                <option value="nightlife">{isHe ? "🍸 חיי לילה / בר" : "🍸 Nightlife"}</option>
                <option value="events">{isHe ? "⛵ סיור / מסיבה / הפלגה" : "⛵ Event / Tour"}</option>
                <option value="attractions">{isHe ? "🏛️ אטרקציה / בילוי" : "🏛️ Attraction"}</option>
                <option value="tips">{isHe ? "🧳 נסיעה / תחבורה / שונות" : "🧳 Transit / Other"}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isHe ? "סטטוס הזמנה" : "Booking Status"}
              </label>
              <select
                value={bookingStatus}
                onChange={(e) => setBookingStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold bg-white text-sky-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Confirmed">{isHe ? "✓ מאושר / כרטיסים ביד" : "✓ Confirmed"}</option>
                <option value="Reserved">{isHe ? "📅 שמור מקום / הוזמן" : "📅 Reserved"}</option>
                <option value="Need to Book">{isHe ? "⚠️ נדרש להזמין מראש" : "⚠️ Need to Book"}</option>
                <option value="Walk-in">{isHe ? "🚶 הגעה חופשית (Walk-in)" : "🚶 Walk-in"}</option>
                <option value="Free">{isHe ? "🆓 חינם" : "🆓 Free"}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                {isHe ? "מיקום / כתובת" : "Location / Address"}
              </label>
              <input
                type="text"
                placeholder={isHe ? "למשל: כיכר מרכזית, ליד הנמל..." : "e.g. Syntagma Square, Athens"}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isHe ? `עלות משוערת (${trip.currencySymbol || "€"})` : `Estimated Cost (${trip.currencySymbol || "€"})`}
              </label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isHe ? "הערות ותזכורות" : "Notes & Reminders"}
            </label>
            <textarea
              rows="2"
              placeholder={
                isHe
                  ? "למשל: להביא דרכון, קוד הזמנה #12345, להגיע 15 דקות מראש..."
                  : "e.g. Bring passports for check-in, confirmation code #12345"
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {isEdit && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="modal-completed"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="modal-completed" className="font-semibold text-slate-700 cursor-pointer">
                {isHe ? "סמן פעילות זו ככזו שבוצעה" : "Mark this activity as completed"}
              </label>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-semibold cursor-pointer"
            >
              {isHe ? "ביטול" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              {isEdit ? (isHe ? "עדכן פעילות" : "Update Activity") : isHe ? "הוסף ללו״ז היומי" : "Add to Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
