import React, { useMemo } from "react";
import {
  PieChart,
  DollarSign,
  CreditCard,
  Users,
  TrendingUp,
  Hotel,
  Utensils,
  Wine,
  PartyPopper,
  Landmark,
  Compass,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export function BudgetView({ trip, places = [], itinerary = [] }) {
  const currencySymbol = trip.currencySymbol || "€";
  const travelerCount = trip.companions?.length || 1;

  // Aggregate costs across both places and scheduled itinerary items
  const stats = useMemo(() => {
    // Unique cost items from itinerary and places
    let totalEstimated = 0;
    let totalConfirmed = 0;
    let totalPending = 0;

    const categoryBreakdown = {
      hotels: { name: "Hotels & Stays", total: 0, icon: Hotel, color: "bg-blue-500" },
      dining: { name: "Restaurants & Dining", total: 0, icon: Utensils, color: "bg-amber-500" },
      nightlife: { name: "Bars & Nightlife", total: 0, icon: Wine, color: "bg-purple-500" },
      events: { name: "Parties & Events", total: 0, icon: PartyPopper, color: "bg-rose-500" },
      attractions: { name: "Attractions & Tours", total: 0, icon: Landmark, color: "bg-emerald-500" },
      tips: { name: "Transit & Logistics", total: 0, icon: Compass, color: "bg-slate-500" }
    };

    // Calculate from itinerary activities (to avoid double counting, itinerary is the source of truth for the scheduled trip)
    itinerary.forEach((item) => {
      const cost = Number(item.cost) || 0;
      totalEstimated += cost;
      if (item.bookingStatus === "Confirmed" || item.bookingStatus === "Reserved") {
        totalConfirmed += cost;
      } else {
        totalPending += cost;
      }

      const cat = categoryBreakdown[item.category] ? item.category : "tips";
      categoryBreakdown[cat].total += cost;
    });

    // If itinerary has no items, fallback to curated places
    if (itinerary.length === 0) {
      places.forEach((p) => {
        const cost = Number(p.cost) || 0;
        totalEstimated += cost;
        if (p.status === "Booked") {
          totalConfirmed += cost;
        } else {
          totalPending += cost;
        }
        const cat = categoryBreakdown[p.category] ? p.category : "tips";
        categoryBreakdown[cat].total += cost;
      });
    }

    return {
      totalEstimated,
      totalConfirmed,
      totalPending,
      perPerson: Math.round(totalEstimated / travelerCount),
      perPersonConfirmed: Math.round(totalConfirmed / travelerCount),
      categoryBreakdown
    };
  }, [itinerary, places, travelerCount]);

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Estimated Cost */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Estimated
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {currencySymbol}{stats.totalEstimated.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">All scheduled activities</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg">
            {currencySymbol}
          </div>
        </div>

        {/* Confirmed / Booked */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Confirmed / Booked
            </div>
            <div className="text-2xl font-extrabold text-emerald-800 mt-1">
              {currencySymbol}{stats.totalConfirmed.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Paid or reserved</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending / Unbooked */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Pending / Walk-in
            </div>
            <div className="text-2xl font-extrabold text-amber-800 mt-1">
              {currencySymbol}{stats.totalPending.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-600 mt-0.5">Estimated on-site spend</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Per Traveler */}
        <div className="bg-white p-5 rounded-2xl border border-indigo-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Per Traveler ({travelerCount})
            </div>
            <div className="text-2xl font-extrabold text-indigo-900 mt-1">
              {currencySymbol}{stats.perPerson.toLocaleString()}
            </div>
            <div className="text-[11px] text-indigo-500 mt-0.5">
              Confirmed: {currencySymbol}{stats.perPersonConfirmed}
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Category Breakdown & Spending Progress */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Category Cost Allocation</h3>
            <p className="text-xs text-slate-500">Distribution of budget across stays, meals, and adventures</p>
          </div>
          <div className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100">
            {travelerCount} Travelers Sharing
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(stats.categoryBreakdown).map(([catKey, cat]) => {
            const Icon = cat.icon;
            const pct =
              stats.totalEstimated > 0
                ? Math.round((cat.total / stats.totalEstimated) * 100)
                : 0;
            return (
              <div
                key={catKey}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900">
                      {currencySymbol}{cat.total.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5 font-semibold">({pct}%)</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${cat.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Itemized Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            All Costed Activities & Stays ({itinerary.filter((i) => i.cost > 0).length})
          </h4>
          <span className="text-xs text-slate-500">Sorted by cost</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {itinerary
            .filter((i) => i.cost > 0)
            .sort((a, b) => b.cost - a.cost)
            .map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-bold text-[10px]">
                    {item.dayLabel || `Day ${item.dayNumber}`}
                  </span>
                  <div>
                    <div className="font-bold text-slate-800">{item.activity}</div>
                    <div className="text-[11px] text-slate-400">{item.location || item.category}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.bookingStatus === "Confirmed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.bookingStatus || "Planned"}
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 w-16 text-right">
                    {currencySymbol}{item.cost}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
