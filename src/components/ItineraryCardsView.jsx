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
  onToggleComplete,
  onEdit,
  onDelete
}) {
  // Group items by dayNumber
  const groupedByDay = items.reduce((acc, item) => {
    const day = item.dayNumber || 1;
    if (!acc[day]) {
      acc[day] = {
        dayNumber: day,
        dayLabel: item.dayLabel || `Day ${day}`,
        activities: []
      };
    }
    acc[day].activities.push(item);
    return acc;
  }, {});

  const sortedDays = Object.values(groupedByDay).sort((a, b) => a.dayNumber - b.dayNumber);

  const periodStyles = {
    Morning: { bg: "bg-amber-50 text-amber-800 border-amber-200", icon: Sun },
    Afternoon: { bg: "bg-sky-50 text-sky-800 border-sky-200", icon: Sun },
    Evening: { bg: "bg-indigo-50 text-indigo-800 border-indigo-200", icon: Sunset },
    Night: { bg: "bg-purple-50 text-purple-800 border-purple-200", icon: Moon }
  };

  return (
    <div className="space-y-6">
      {sortedDays.map((group) => (
        <div
          key={group.dayNumber}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
        >
          {/* Day Section Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-sky-500 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                {group.dayNumber}
              </span>
              <div>
                <h3 className="text-base font-bold">{group.dayLabel}</h3>
                <p className="text-xs text-slate-300">
                  {group.activities.length} planned {group.activities.length === 1 ? "activity" : "activities"}
                </p>
              </div>
            </div>

            <div className="text-xs text-sky-300 font-semibold">
              Total Day Est: {currencySymbol}
              {group.activities.reduce((s, it) => s + (it.cost || 0), 0)}
            </div>
          </div>

          {/* Day Activities List */}
          <div className="p-4 divide-y divide-slate-100">
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
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleComplete(item.id)}
                      className="mt-0.5 text-slate-300 hover:text-sky-600 transition-colors cursor-pointer"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 hover:stroke-sky-600" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${pStyle.bg}`}
                        >
                          <PeriodIcon className="w-3 h-3" />
                          <span>{item.period}</span>
                        </span>

                        {item.time && (
                          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.time}
                          </span>
                        )}

                        <span
                          className={`text-sm font-bold text-slate-800 ${
                            item.completed ? "line-through text-slate-400" : ""
                          }`}
                        >
                          {item.activity}
                        </span>

                        {item.bookingStatus && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {item.bookingStatus}
                          </span>
                        )}
                      </div>

                      {item.location && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{item.location}</span>
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:text-sky-800 ml-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {item.notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-xl">
                          💡 {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {item.cost > 0 && (
                      <span className="text-xs font-extrabold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                        {currencySymbol}{item.cost}
                      </span>
                    )}

                    <div className="flex items-center gap-1 no-print">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 text-slate-400 hover:text-sky-600 hover:bg-slate-100 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${item.activity}"?`)) {
                            onDelete(item.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="Delete"
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
