import React from "react";
import {
  MapPin,
  CheckCircle2,
  Circle,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Sun,
  Sunset,
  Moon,
  Clock,
  ExternalLink,
  Tag
} from "lucide-react";

export function ItineraryTable({
  items,
  currencySymbol = "€",
  lang = "he",
  onToggleComplete,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete
}) {
  const isHe = lang === "he";

  const periodStyles = {
    Morning: {
      bg: "bg-amber-100/90 text-amber-800 border-amber-300",
      icon: Sun,
      iconColor: "text-amber-600",
      label: isHe ? "בוקר" : "Morning"
    },
    Afternoon: {
      bg: "bg-sky-100/90 text-sky-800 border-sky-300",
      icon: Sun,
      iconColor: "text-sky-600",
      label: isHe ? "צהריים" : "Afternoon"
    },
    Evening: {
      bg: "bg-indigo-100/90 text-indigo-800 border-indigo-300",
      icon: Sunset,
      iconColor: "text-indigo-600",
      label: isHe ? "ערב" : "Evening"
    },
    Night: {
      bg: "bg-purple-100/90 text-purple-800 border-purple-300",
      icon: Moon,
      iconColor: "text-purple-600",
      label: isHe ? "לילה" : "Night"
    }
  };

  const bookingStyles = {
    Confirmed: {
      class: "bg-emerald-100 text-emerald-800 border-emerald-300",
      label: isHe ? "מאושר" : "Confirmed"
    },
    Reserved: {
      class: "bg-sky-100 text-sky-800 border-sky-300",
      label: isHe ? "שמור" : "Reserved"
    },
    "Need to Book": {
      class: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
      label: isHe ? "להזמין" : "Need to Book"
    },
    Planned: {
      class: "bg-blue-100 text-blue-800 border-blue-300",
      label: isHe ? "מתוכנן" : "Planned"
    },
    "Walk-in": {
      class: "bg-slate-100 text-slate-700 border-slate-300",
      label: isHe ? "חופשי" : "Walk-in"
    },
    Free: {
      class: "bg-teal-100 text-teal-800 border-teal-300 font-bold",
      label: isHe ? "חינם" : "Free"
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-400 text-xs">
        {isHe ? "אין פעילויות לתצוגה בסינון הנוכחי" : "No activities match the current filter"}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden" dir={isHe ? "rtl" : "ltr"}>
      {/* 📱 MOBILE VIEW: Compact Interactive Cards (< md screens) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {items.map((item, index) => {
          const periodStyle = periodStyles[item.period] || periodStyles.Morning;
          const PeriodIcon = periodStyle.icon;
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${item.activity} ${item.location || ""}`
          )}`;
          const bStatus = bookingStyles[item.bookingStatus] || {
            class: "bg-slate-100 text-slate-700",
            label: item.bookingStatus
          };

          return (
            <div
              key={item.id}
              className={`p-3.5 space-y-2.5 transition-colors ${
                item.completed ? "bg-slate-50/60 opacity-60" : "bg-white"
              }`}
            >
              {/* Header: Done + Day/Period + Title */}
              <div className="flex items-start gap-2.5">
                <button
                  onClick={() => onToggleComplete(item.id)}
                  className="mt-0.5 text-slate-300 hover:text-sky-600 transition-colors p-1 cursor-pointer shrink-0"
                  title={item.completed ? "Mark uncompleted" : "Mark completed"}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 hover:stroke-sky-600" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-sky-900 bg-sky-50 px-2 py-0.5 rounded text-[10px] border border-sky-100 font-extrabold">
                      {isHe ? `יום ${item.dayNumber}` : item.dayLabel || `Day ${item.dayNumber}`}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${periodStyle.bg}`}
                    >
                      <PeriodIcon className={`w-3 h-3 ${periodStyle.iconColor}`} />
                      <span>{periodStyle.label}</span>
                    </span>
                    {item.time && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        {item.time}
                      </span>
                    )}
                  </div>

                  <h4
                    dir="auto"
                    className={`font-bold text-slate-900 text-sm break-words ${
                      item.completed ? "line-through text-slate-400" : ""
                    }`}
                  >
                    {item.activity}
                  </h4>

                  {item.location && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 p-0.5"
                        title="Google Maps"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 mt-1" dir="auto">
                      💡 {item.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer: Cost/Status + Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800 text-xs">
                    {item.cost > 0 ? `${currencySymbol}${item.cost}` : isHe ? "חינם" : "Free"}
                  </span>
                  {item.bookingStatus && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold border ${bStatus.class}`}
                    >
                      {bStatus.label}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => onMoveUp(index)}
                    className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                      index === 0 ? "opacity-20 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100 cursor-pointer"
                    }`}
                    title={isHe ? "העלה למעלה" : "Move Up"}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === items.length - 1}
                    onClick={() => onMoveDown(index)}
                    className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                      index === items.length - 1 ? "opacity-20 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100 cursor-pointer"
                    }`}
                    title={isHe ? "הורד למטה" : "Move Down"}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
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
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

      {/* 💻 DESKTOP TABLE VIEW (>= md screens) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse" dir={isHe ? "rtl" : "ltr"}>
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-3 w-12 text-center">{isHe ? "בוצע" : "Done"}</th>
              <th className="py-2.5 px-3 w-28">{isHe ? "יום" : "Day"}</th>
              <th className="py-2.5 px-3 w-28">{isHe ? "זמן" : "Period"}</th>
              <th className="py-2.5 px-4">{isHe ? "פעילות / מקום" : "Activity / Place"}</th>
              <th className="py-2.5 px-4">{isHe ? "כתובת / קישור" : "Location"}</th>
              <th className="py-2.5 px-3 w-28">{isHe ? "עלות / סטטוס" : "Cost"}</th>
              <th className="py-2.5 px-4 min-w-[180px]">{isHe ? "הערות" : "Notes"}</th>
              <th className="py-2.5 px-3 w-24 text-center no-print">{isHe ? "פעולות" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {items.map((item, index) => {
              const periodStyle = periodStyles[item.period] || periodStyles.Morning;
              const PeriodIcon = periodStyle.icon;
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${item.activity} ${item.location || ""}`
              )}`;

              const bStatus = bookingStyles[item.bookingStatus] || {
                class: "bg-slate-100 text-slate-700",
                label: item.bookingStatus
              };

              return (
                <tr
                  key={item.id}
                  className={`transition-colors group hover:bg-slate-50/80 ${
                    item.completed ? "bg-slate-50/60 opacity-60" : ""
                  }`}
                >
                  {/* Done Checkbox */}
                  <td className="py-2.5 px-3 text-center align-middle">
                    <button
                      onClick={() => onToggleComplete(item.id)}
                      className="cursor-pointer text-slate-300 hover:text-sky-600 transition-colors p-1"
                      title={item.completed ? "Mark uncompleted" : "Mark completed"}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 hover:stroke-sky-600" />
                      )}
                    </button>
                  </td>

                  {/* Day / Date */}
                  <td className="py-2.5 px-3 font-bold text-slate-800 whitespace-nowrap align-middle">
                    <span className="text-sky-900 bg-sky-50 px-2 py-0.5 rounded text-[11px] border border-sky-100 font-extrabold">
                      {isHe ? `יום ${item.dayNumber}` : item.dayLabel || `Day ${item.dayNumber}`}
                    </span>
                  </td>

                  {/* Time / Period */}
                  <td className="py-2.5 px-3 whitespace-nowrap align-middle">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${periodStyle.bg}`}
                      >
                        <PeriodIcon className={`w-3 h-3 ${periodStyle.iconColor}`} />
                        <span>{periodStyle.label}</span>
                      </span>
                      {item.time && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.time}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Activity / Place */}
                  <td className="py-2.5 px-4 align-middle">
                    <div className="flex flex-col">
                      <span
                        dir="auto"
                        className={`font-bold text-slate-900 text-xs sm:text-sm ${
                          item.completed ? "line-through text-slate-400" : ""
                        }`}
                      >
                        {item.activity}
                      </span>
                      {item.linkedPlaceId && (
                        <span className="text-[9px] text-sky-600 font-medium mt-0.5">
                          ✓ {isHe ? "מקושר לבנק המקומות" : "Linked from Places"}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Location / Address */}
                  <td className="py-2.5 px-4 text-slate-600 align-middle">
                    {item.location ? (
                      <div className="flex items-center gap-1 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]" dir="auto">{item.location}</span>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:text-sky-800 p-0.5"
                          title="Open Google Maps"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">--</span>
                    )}
                  </td>

                  {/* Cost & Booking Status */}
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <div className="flex flex-col gap-0.5 items-start">
                      <span className="font-bold text-slate-800 text-xs">
                        {item.cost > 0 ? `${currencySymbol}${item.cost}` : isHe ? "חינם" : "Free"}
                      </span>
                      {item.bookingStatus && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${bStatus.class}`}
                        >
                          {bStatus.label}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Notes / Reminders */}
                  <td className="py-2.5 px-4 text-slate-600 align-middle">
                    {item.notes ? (
                      <div className="line-clamp-2 text-xs text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100" dir="auto">
                        {item.notes}
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">--</span>
                    )}
                  </td>

                  {/* Actions (Reorder, Edit, Delete) */}
                  <td className="py-2.5 px-3 text-center align-middle whitespace-nowrap no-print">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => onMoveUp(index)}
                        className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                          index === 0 ? "opacity-20 cursor-not-allowed" : "text-slate-400 hover:text-slate-800 cursor-pointer"
                        }`}
                        title={isHe ? "העלה למעלה" : "Move Up"}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        disabled={index === items.length - 1}
                        onClick={() => onMoveDown(index)}
                        className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                          index === items.length - 1
                            ? "opacity-20 cursor-not-allowed"
                            : "text-slate-400 hover:text-slate-800 cursor-pointer"
                        }`}
                        title={isHe ? "הורד למטה" : "Move Down"}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors cursor-pointer"
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
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title={isHe ? "מחק" : "Delete"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
