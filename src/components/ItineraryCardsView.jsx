import React from "react";
import {
  MapPin,
  CheckCircle2,
  Circle,
  Clock,
  Sun,
  Sunset,
  Moon,
  Edit2,
  Trash2,
  ExternalLink
} from "lucide-react";

export function ItineraryCardsView({
  items,
  currencySymbol = "€",
  lang = "he",
  onToggleComplete,
  onEdit,
  onDelete
}) {
  const isHe = lang === "he";

  // Group items by dayNumber
  const groupedByDay = items.reduce((acc, item) => {
    const day = item.dayNumber || 1;
    if (!acc[day]) {
      acc[day] = {
        dayNumber: day,
        dayLabel: item.dayLabel || (isHe ? `יום ${day}` : `Day ${day}`),
        activities: []
      };
    }
    acc[day].activities.push(item);
    return acc;
  }, {});

  const sortedDays = Object.values(groupedByDay).sort((a, b) => a.dayNumber - b.dayNumber);

  const periodStyles = {
    Morning: { bg: "bg-amber-50 text-amber-800 border-amber-200", icon: Sun, label: isHe ? "בוקר" : "Morning" },
    Afternoon: { bg: "bg-sky-50 text-sky-800 border-sky-200", icon: Sun, label: isHe ? "צהריים" : "Afternoon" },
    Evening: { bg: "bg-indigo-50 text-indigo-800 border-indigo-200", icon: Sunset, label: isHe ? "ערב" : "Evening" },
    Night: { bg: "bg-purple-50 text-purple-800 border-purple-200", icon: Moon, label: isHe ? "לילה" : "Night" }
  };

  const bookingLabels = {
    Confirmed: isHe ? "מאושר" : "Confirmed",
    Reserved: isHe ? "שמור" : "Reserved",
    "Need to Book": isHe ? "להזמין" : "Need to Book",
    Planned: isHe ? "מתוכנן" : "Planned",
    "Walk-in": isHe ? "חופשי" : "Walk-in",
    Free: isHe ? "חינם" : "Free"
  };

  if (sortedDays.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400 text-sm">
        {isHe ? "עדיין אין פעילויות בלו״ז. הוסף פעילות חדשה למעלה או שבץ מקום מבנק המקומות!" : "No activities scheduled yet."}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6" dir={isHe ? "rtl" : "ltr"}>
      {sortedDays.map((group) => (
        <div
          key={group.dayNumber}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
        >
          {/* Day Section Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-500 text-white font-extrabold flex items-center justify-center text-xs sm:text-sm shadow-xs shrink-0">
                {group.dayNumber}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold">{group.dayLabel}</h3>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  {group.activities.length} {isHe ? "פעילויות מתוכננות" : "planned activities"}
                </p>
              </div>
            </div>

            <div className="text-[11px] sm:text-xs text-sky-300 font-semibold">
              {isHe ? "סה״כ משוער:" : "Total Day Est:"} {currencySymbol}
              {group.activities.reduce((s, it) => s + (it.cost || 0), 0)}
            </div>
          </div>

          {/* Day Activities List */}
          <div className="p-3 sm:p-4 divide-y divide-slate-100">
            {group.activities.map((item) => {
              const pStyle = periodStyles[item.period] || periodStyles.Morning;
              const PeriodIcon = pStyle.icon;
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${item.activity} ${item.location || ""}`
              )}`;

              return (
                <div
                  key={item.id}
                  className={`py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 group ${
                    item.completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleComplete(item.id)}
                      className="mt-0.5 text-slate-300 hover:text-sky-600 transition-colors cursor-pointer shrink-0"
                      title={isHe ? "סמן כבוצע" : "Toggle Done"}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 hover:stroke-sky-600" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${pStyle.bg}`}
                        >
                          <PeriodIcon className="w-3 h-3" />
                          <span>{pStyle.label}</span>
                        </span>

                        {item.time && (
                          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.time}
                          </span>
                        )}

                        <span
                          className={`text-xs sm:text-sm font-bold text-slate-800 break-words ${
                            item.completed ? "line-through text-slate-400" : ""
                          }`}
                        >
                          {item.activity}
                        </span>

                        {item.bookingStatus && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {bookingLabels[item.bookingStatus] || item.bookingStatus}
                          </span>
                        )}
                      </div>

                      {item.location && (
                        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:text-sky-800 ml-1 inline-flex items-center"
                            title="Google Maps"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {item.notes && (
                        <p className="text-[11px] sm:text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-xl">
                          💡 {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {item.cost > 0 && (
                      <span className="text-xs font-extrabold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                        {currencySymbol}{item.cost}
                      </span>
                    )}

                    <div className="flex items-center gap-1 no-print">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title={isHe ? "ערוך" : "Edit"}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(isHe ? `למחוק את "${item.activity}"?` : `Delete "${item.activity}"?`)) {
                            onDelete(item.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title={isHe ? "מחק" : "Delete"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
