import React from "react";
import {
  MapPin,
  Calendar,
  Users,
  Sun,
  Coins,
  ChevronDown,
  Printer,
  Share2,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Languages,
  Plus,
  Cloud
} from "lucide-react";

export function Header({
  trip,
  lang = "he",
  isCloudSyncActive = false,
  onToggleLang,
  onOpenDestinationModal,
  onOpenWeatherModal,
  onOpenCurrencyModal,
  onOpenCompanionsModal,
  onOpenExportModal,
  onOpenSyncModal,
  onStartBlankTrip,
  onClearTrip,
  onPrint
}) {
  if (!trip) return null;

  const isHe = lang === "he";

  return (
    <header className="relative bg-gradient-to-r from-sky-950 via-sky-900 to-indigo-950 text-white overflow-hidden shadow-xl border-b border-sky-800/40">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_50%)] pointer-events-none" />

      {/* Main App Title - Centered */}
      <div className="border-b border-white/10 bg-black/25 backdrop-blur-xs py-3 px-4 text-center relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-sky-200 drop-shadow-md uppercase select-none font-sans">
              MaxVenture
            </span>
          </div>
          <div className="text-[11px] sm:text-xs text-sky-200/80 font-medium tracking-wide mt-0.5">
            {isHe ? "מתכנן הטיולים והלו״ז האישי שלי" : "Smart Travel & Itinerary Planner"}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Destination Badge & Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {/* Destination Tag / Badge */}
              <button
                onClick={onOpenDestinationModal}
                className="group inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 hover:text-white transition-all text-xs font-bold tracking-wide uppercase cursor-pointer"
                title={isHe ? "לחץ להחלפת יעד או שינוי שם" : "Click to switch destination"}
              >
                <span className="text-base">{trip.flag || "🌍"}</span>
                <span>{trip.destination}</span>
                <ChevronDown className="w-3.5 h-3.5 text-sky-300 group-hover:translate-y-0.5 transition-transform" />
              </button>

              {/* Start Fresh Blank Trip Button */}
              <button
                onClick={onStartBlankTrip}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                title={isHe ? "התחל טיול חדש ונקי ללא נתונים לדוגמה" : "Start a blank canvas trip"}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isHe ? "התחל טיול נקי מאפס" : "Start Blank Trip"}</span>
              </button>

              {/* Clear Current Trip Places & Schedule */}
              <button
                onClick={onClearTrip}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-rose-500/20 hover:border-rose-400/40 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
                title={isHe ? "נקה את כל המקומות והלו״ז של הטיול הנוכחי" : "Clear all places & schedule"}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isHe ? "נקה לוח" : "Clear Board"}</span>
              </button>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white" dir="auto">
                {trip.title || trip.destination}
              </h1>
            </div>
            <p className="text-sky-200/90 text-xs sm:text-sm mt-0.5 font-medium flex items-center gap-1.5" dir="auto">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              {trip.subtitle || (isHe ? "הרכבת לו״ז ומקומות אישיים" : "Personal itinerary & saved places")}
            </p>
          </div>

          {/* Right: Meta Info Widgets & Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Cloud Sync Button */}
            <button
              onClick={onOpenSyncModal}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                isCloudSyncActive
                  ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-400/40"
                  : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/40"
              }`}
              title={
                isHe
                  ? "הגדרות סנכרון ענן בזמן אמת (Firebase)"
                  : "Cloud Real-time Sync (Firebase)"
              }
            >
              <Cloud
                className={`w-3.5 h-3.5 ${
                  isCloudSyncActive ? "text-emerald-300" : "text-amber-300"
                }`}
              />
              <span>
                {isCloudSyncActive
                  ? isHe
                    ? "ענן פעיל ●"
                    : "Live Cloud ●"
                  : isHe
                  ? "סנכרון ענן (טלפון)"
                  : "Cloud Sync"}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-xl border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Switch language / החלף שפה"
            >
              <Languages className="w-3.5 h-3.5 text-sky-300" />
              <span>{isHe ? "עברית 🇮🇱" : "English 🇬🇧"}</span>
            </button>

            {/* Dates & Duration Widget */}
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-2 shadow-xs text-xs">
              <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <div className="leading-tight">
                <div className="font-bold text-white">{trip.dateRange}</div>
                <div className="text-[10px] text-sky-200 font-semibold">
                  {trip.durationDays} {isHe ? "ימים" : "Days"}
                </div>
              </div>
            </div>

            {/* Travel Companions Stack */}
            <button
              onClick={onOpenCompanionsModal}
              className="bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/15 transition-all flex items-center gap-2 shadow-xs cursor-pointer text-xs"
              title={isHe ? "ניהול שותפים לטיול" : "Manage travel group"}
            >
              <div className="flex -space-x-1.5">
                {trip.companions?.slice(0, 3).map((comp) => (
                  <div
                    key={comp.id}
                    title={`${comp.name} (${comp.role})`}
                    className={`w-6 h-6 rounded-full ${comp.color || "bg-blue-600"} text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-sky-950`}
                  >
                    {comp.avatar}
                  </div>
                ))}
              </div>
              <span className="font-semibold text-white">
                {trip.companions?.length || 1} {isHe ? "מטיילים" : "Travelers"}
              </span>
            </button>

            {/* Weather Widget */}
            <button
              onClick={onOpenWeatherModal}
              className="bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-xl border border-white/15 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer text-xs"
              title={isHe ? "מזג אוויר ותחזית" : "Weather"}
            >
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-bold text-white">{trip.weather?.temp || "23°C"}</span>
            </button>

            {/* Currency Converter */}
            <button
              onClick={onOpenCurrencyModal}
              className="bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-xl border border-white/15 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer text-xs"
              title={isHe ? "מחשבון המרת מטבע" : "Currency Calculator"}
            >
              <Coins className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-bold text-white">
                1 {trip.baseCurrency || "EUR"} ≈ ${(trip.exchangeRateToUSD || 1.09).toFixed(2)}
              </span>
            </button>

            {/* Print & Export Controls */}
            <div className="flex items-center gap-1 pl-1 border-l border-white/15">
              <button
                onClick={onPrint}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 transition-colors cursor-pointer"
                title={isHe ? "הדפסה / שמירה כ-PDF" : "Print Travel Itinerary / PDF"}
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenExportModal}
                className="p-1.5 px-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                title={isHe ? "ייצוא או ייבוא נתונים" : "Export / Backup"}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isHe ? "שיתוף" : "Share"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
