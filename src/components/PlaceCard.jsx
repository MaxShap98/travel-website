import React, { useState } from "react";
import {
  MapPin,
  Star,
  ExternalLink,
  CalendarPlus,
  Clock,
  Utensils,
  Hotel,
  Wine,
  PartyPopper,
  Landmark,
  Compass,
  Edit2,
  Trash2,
  Check,
  ShoppingBag,
  Tag
} from "lucide-react";

export function PlaceCard({
  place,
  currencySymbol = "€",
  totalDays = 7,
  scheduledDays = [], // e.g. [1, 3] if scheduled on Day 1 & Day 3
  lang = "he",
  onStatusChange,
  onQuickScheduleToDay,
  onAddToItinerary,
  onEdit,
  onDelete,
  isReadOnly = false
}) {
  const isHe = lang === "he";
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const categoryIcons = {
    hotels: Hotel,
    dining: Utensils,
    nightlife: Wine,
    events: PartyPopper,
    attractions: Landmark,
    shopping: ShoppingBag,
    tips: Compass
  };

  const categoryLabels = {
    hotels: isHe ? "מלון ולינה" : "Hotel & Stay",
    dining: isHe ? "מסעדה ואוכל" : "Dining & Food",
    nightlife: isHe ? "בר וחיי לילה" : "Nightlife & Bar",
    events: isHe ? "אירוע / פעילות" : "Event / Activity",
    attractions: isHe ? "אטרקציה ותצפית" : "Attraction & View",
    shopping: isHe ? "קניות ושווקים" : "Shopping",
    tips: isHe ? "כללי / תחבורה" : "Transit / General"
  };

  const CategoryIcon = categoryIcons[place.category] || Compass;

  const statusStyles = {
    Unset: {
      bg: "bg-slate-100 text-slate-700 border-slate-300 ring-slate-400/20 hover:bg-slate-200/80",
      dot: "bg-slate-400",
      label: "סטטוס"
    },
    "Must Visit": {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-400/30",
      dot: "bg-emerald-500",
      label: isHe ? "חובה לבקר" : "Must Visit"
    },
    Optional: {
      bg: "bg-amber-50 text-amber-700 border-amber-300 ring-amber-400/30",
      dot: "bg-amber-500",
      label: isHe ? "אופציונלי" : "Optional"
    },
    Booked: {
      bg: "bg-sky-50 text-sky-700 border-sky-300 ring-sky-400/30",
      dot: "bg-sky-500",
      label: isHe ? "הוזמן מראש" : "Booked"
    },
    Visited: {
      bg: "bg-purple-50 text-purple-700 border-purple-300 ring-purple-400/30",
      dot: "bg-purple-500",
      label: isHe ? "ביקרתי" : "Visited"
    }
  };

  const currentStatus = statusStyles[place.status] || statusStyles["Unset"];

  // Google Maps fallback URL
  const mapsSearchUrl =
    place.mapsUrl ||
    place.bookingUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${place.name} ${place.location || ""}`
    )}`;

  const daysList = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-sky-300 transition-all duration-200 flex flex-col justify-between relative ${
        showStatusMenu ? "z-30" : "z-1"
      }`}
    >
      <div>
        {/* Card Header Bar */}
        <div className="p-4 bg-gradient-to-r from-slate-50 to-sky-50/50 border-b border-slate-100 flex items-center justify-between gap-2 rounded-t-2xl">
          {/* Category Tag */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold">
            <CategoryIcon className="w-3.5 h-3.5 text-sky-600" />
            <span>{categoryLabels[place.category] || place.category}</span>
          </span>

          {/* Interactive Status Selector */}
          <div className="relative">
            <button
              disabled={isReadOnly}
              onClick={() => !isReadOnly && setShowStatusMenu(!showStatusMenu)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                isReadOnly ? "cursor-default opacity-90" : "cursor-pointer"
              } ${currentStatus.bg}`}
              title={isHe ? "לחץ לשינוי סטטוס" : "Click to change status"}
            >
              <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`} />
              <span>{currentStatus.label}</span>
            </button>

            {!isReadOnly && showStatusMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowStatusMenu(false)}
                />
                <div className="absolute top-full mt-1.5 start-0 z-50 w-36 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 animate-fade-in text-xs ring-1 ring-black/5">
                  {Object.entries(statusStyles).map(([key, st]) => (
                    <button
                      key={key}
                      onClick={() => {
                        onStatusChange(place.id, key);
                        setShowStatusMenu(false);
                      }}
                      className="w-full text-start px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                      <span>{st.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-700 transition-colors" dir="auto">
              {place.name}
            </h3>
            {place.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed" dir="auto">
                {place.description}
              </p>
            )}
          </div>

          {/* Location / Address / Link */}
          {place.location && (
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-sky-600 transition-colors group/loc"
              title={isHe ? "פתח ב-Google Maps" : "Open in Google Maps"}
            >
              <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover/loc:text-sky-600 shrink-0 transition-colors" />
              <span className="truncate underline decoration-slate-300 group-hover/loc:decoration-sky-500" dir="auto">
                {place.location}
              </span>
            </a>
          )}

          {/* Personal Notes / Tips */}
          {place.notes && (
            <div className="text-xs text-slate-700 bg-amber-50/70 p-2 rounded-xl border border-amber-200/80 leading-relaxed" dir="auto">
              💡 <span className="font-semibold">{isHe ? "הערה/טיפ:" : "Note:"}</span> {place.notes}
            </div>
          )}

          {/* Pricing & Rating if provided */}
          {(place.cost > 0 || place.priceRange || place.rating) && (
            <div className="flex items-center gap-2 pt-1 text-xs">
              {place.cost > 0 && (
                <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                  ~{currencySymbol}{place.cost}
                </span>
              )}
              {place.priceRange && (
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {place.priceRange}
                </span>
              )}
              {place.rating && (
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors px-2 py-0.5 rounded-md border border-amber-200/60"
                  title={isHe ? `דירוג Google Maps: ${place.rating} ★ (לחץ לפתיחה)` : `Google Maps Rating: ${place.rating} ★`}
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>{place.rating}</span>
                </a>
              )}
            </div>
          )}

          {/* Scheduled Status in Itinerary */}
          {scheduledDays.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200">
              <Check className="w-3.5 h-3.5 text-sky-600" />
              <span>
                {isHe ? `משובץ בלו״ז: יום ${scheduledDays.join(", יום ")}` : `Scheduled on: Day ${scheduledDays.join(", Day ")}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-2 rounded-b-2xl">
        {/* Quick Day Scheduler Buttons (Admin only) */}
        {!isReadOnly && (
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
              <span>{isHe ? "📅 שבץ ישירות ביום:" : "📅 Assign to Day:"}</span>
              <button
                onClick={() => onAddToItinerary(place)}
                className="text-sky-600 hover:text-sky-800 font-bold transition-colors cursor-pointer"
              >
                {isHe ? "+ שעה והערות" : "+ Custom Time"}
              </button>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {daysList.map((d) => {
                const isScheduledHere = scheduledDays.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => onQuickScheduleToDay(place, d)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isScheduledHere
                        ? "bg-sky-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-sky-300"
                    }`}
                    title={
                      isScheduledHere
                        ? (isHe ? `משובץ ביום ${d} - לחץ להסרה מהלו״ז` : `Scheduled on Day ${d} - Click to remove`)
                        : (isHe ? `שבץ ביום ${d}` : `Assign to Day ${d}`)
                    }
                  >
                    {isHe ? `יום ${d}` : `Day ${d}`}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Links & Edit / Delete */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
          <div className="flex items-center gap-1.5">
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-sky-600 hover:border-sky-300 transition-colors"
              title="Open Google Maps / Link"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{isHe ? "מפה / קישור" : "Maps / Link"}</span>
            </a>
          </div>

          {!isReadOnly && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(place)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                title={isHe ? "ערוך מקום" : "Edit place"}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if (window.confirm(isHe ? `למחוק את "${place.name}"?` : `Delete "${place.name}"?`)) {
                    onDelete(place.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title={isHe ? "מחק מקום" : "Delete place"}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
