import React from "react";
import { X, Sun, CloudSun, Wind, Droplets, Compass, Thermometer } from "lucide-react";

export function WeatherModal({ trip, isOpen, onClose, lang = "he" }) {
  if (!isOpen || !trip) return null;

  const isHe = lang === "he";
  const weather = trip.weather || {
    temp: "23°C",
    tempF: "73°F",
    condition: isHe ? "שמשי ובריזה נעימה" : "Sunny & Breezy",
    humidity: "52%",
    wind: "14 km/h",
    uvIndex: 6,
    forecast: [
      { day: isHe ? "יום 1" : "Day 1", temp: "23°C", condition: isHe ? "שמשי" : "Sunny" },
      { day: isHe ? "יום 2" : "Day 2", temp: "24°C", condition: isHe ? "בהיר" : "Clear" },
      { day: isHe ? "יום 3" : "Day 3", temp: "22°C", condition: isHe ? "בריזה" : "Breezy" },
      { day: isHe ? "יום 4" : "Day 4", temp: "23°C", condition: isHe ? "שמשי" : "Sunny" },
      { day: isHe ? "יום 5" : "Day 5", temp: "25°C", condition: isHe ? "חמים" : "Warm" }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in no-print">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden"
        dir={isHe ? "rtl" : "ltr"}
      >
        {/* Header with Coastal Gradient */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" /> {isHe ? "מזג אוויר חי ביעד" : "Live Destination Weather"}
          </div>
          <h3 className="text-2xl font-bold">{trip.destination}</h3>
          <p className="text-sky-100 text-sm">{trip.subtitle}</p>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Sun className="w-10 h-10 text-amber-300 animate-spin-slow" />
              </div>
              <div>
                <div className="text-4xl font-extrabold tracking-tight">{weather.temp}</div>
                <div className="text-sky-200 text-sm font-medium">{weather.condition}</div>
              </div>
            </div>
            <div className={`text-xs space-y-1 text-sky-100 ${isHe ? "text-left" : "text-right"}`}>
              <div className="flex items-center gap-1.5 justify-end">
                <Wind className="w-3.5 h-3.5 text-sky-300" /> {isHe ? "רוח:" : "Wind:"} {weather.wind}
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Droplets className="w-3.5 h-3.5 text-sky-300" /> {isHe ? "לחות:" : "Humidity:"} {weather.humidity}
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Thermometer className="w-3.5 h-3.5 text-amber-300" /> {isHe ? "מדד קרינה:" : "UV Index:"} {weather.uvIndex}
              </div>
            </div>
          </div>
        </div>

        {/* 5-Day Outlook */}
        <div className="p-6 bg-slate-50/50">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            {isHe ? "תחזית לימי הטיול" : "Trip Dates Outlook"}
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {(weather.forecast || []).map((item, idx) => (
              <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center shadow-xs flex flex-col items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">{item.day}</span>
                <Sun className="w-5 h-5 text-amber-500 my-2" />
                <span className="text-sm font-bold text-slate-800">{item.temp}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 truncate w-full">{item.condition}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3.5 bg-sky-50 rounded-xl border border-sky-100 flex items-start gap-3">
            <Sun className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs text-sky-900 leading-relaxed">
              <strong>{isHe ? "טיפ למטיילים:" : "Travel Tip:"}</strong>{" "}
              {isHe
                ? "בשעות הערב בקרבת החוף או בנקודות תצפית שקיעה מנשבת בריזה נעימה. מומלץ לקחת עליונית קלילה או ז'קט לארוחות ערב בחוץ."
                : "Evenings can get breezy. Pack a light jacket or cardigan for sunset dinners."}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-colors cursor-pointer"
          >
            {isHe ? "סגור" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
