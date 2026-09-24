import React from "react";
import {
  Compass,
  CalendarDays,
  CheckSquare,
  PieChart,
  Search,
  Plus,
  X
} from "lucide-react";

export function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  placesCount,
  itineraryCount,
  packingCount,
  lang = "he",
  onOpenAddModal
}) {
  const isHe = lang === "he";

  const tabs = [
    {
      id: "places",
      label: isHe ? "המקומות ששמרתי" : "My Saved Places",
      icon: Compass,
      badge: placesCount
    },
    {
      id: "itinerary",
      label: isHe ? "הרכבת הלו״ז היומי" : "Assemble Itinerary",
      icon: CalendarDays,
      badge: itineraryCount
    },
    {
      id: "tips",
      label: isHe ? "רשימת אריזה ומידע" : "Packing & Tips",
      icon: CheckSquare,
      badge: packingCount
    },
    {
      id: "budget",
      label: isHe ? "תקציב ועלויות" : "Budget & Costs",
      icon: PieChart
    }
  ];

  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 sm:py-2.5 gap-2 sm:gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-sky-600 text-white shadow-sm shadow-sky-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search & Action Button */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                dir="auto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHe ? "חפש מקום, פעילות או טיפ..." : "Search spots, activities, notes..."}
                className="w-full pl-9 pr-8 py-1.5 text-base sm:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Add Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-sky-400" />
              <span>
                {activeTab === "itinerary"
                  ? isHe
                    ? "הוסף פעילות ללו״ז"
                    : "Add Activity"
                  : isHe
                  ? "הוסף מקום"
                  : "Add Place"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
