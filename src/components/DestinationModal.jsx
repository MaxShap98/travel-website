import React, { useState } from "react";
import { X, Plus, Check, MapPin, Calendar, Users, Globe, Trash2, Edit2 } from "lucide-react";

export function DestinationModal({
  trips,
  activeTripId,
  onSelectTrip,
  onCreateTrip,
  onUpdateTrip,
  onDeleteTrip,
  isOpen,
  onClose
}) {
  if (!isOpen) return null;

  const [isCreating, setIsCreating] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);

  // New trip form state
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [flag, setFlag] = useState("✈️");
  const [dateRange, setDateRange] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [currencySymbol, setCurrencySymbol] = useState("€");
  const [durationDays, setDurationDays] = useState(7);

  const startCreate = () => {
    setTitle("");
    setDestination("");
    setSubtitle("");
    setFlag("🌴");
    setDateRange("Sep 15 – Sep 22, 2026");
    setBaseCurrency("EUR");
    setCurrencySymbol("€");
    setDurationDays(7);
    setIsCreating(true);
    setEditingTripId(null);
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    if (!destination.trim()) return;

    const newTrip = {
      id: "trip-" + Date.now(),
      title: title.trim() || `${destination} Trip`,
      destination: `${destination} ${flag}`,
      subtitle: subtitle.trim() || "Vacation & Exploration",
      country: destination.trim(),
      flag: flag || "✈️",
      dateRange: dateRange.trim() || "Upcoming Trip",
      startDate: new Date().toISOString().split("T")[0],
      durationDays: parseInt(durationDays) || 7,
      baseCurrency: baseCurrency || "USD",
      currencySymbol: currencySymbol || "$",
      exchangeRateToUSD: baseCurrency === "USD" ? 1.0 : 1.09,
      weather: {
        temp: "22°C",
        tempF: "72°F",
        condition: "Partly Cloudy",
        humidity: "55%",
        wind: "12 km/h",
        uvIndex: 5,
        forecast: [
          { day: "Day 1", temp: "22°C", condition: "Sunny" },
          { day: "Day 2", temp: "23°C", condition: "Clear" },
          { day: "Day 3", temp: "21°C", condition: "Breezy" }
        ]
      },
      companions: [
        { id: "c-1", name: "Me (Organizer)", role: "Lead Planner", avatar: "ME", color: "bg-blue-600" }
      ],
      categories: [
        { id: "hotels", name: "Hotels & Stays", icon: "Hotel", count: 0 },
        { id: "dining", name: "Restaurants & Dining", icon: "Utensils", count: 0 },
        { id: "nightlife", name: "Bars & Nightlife", icon: "Wine", count: 0 },
        { id: "events", name: "Parties & Events", icon: "PartyPopper", count: 0 },
        { id: "attractions", name: "Attractions & Leisure", icon: "Landmark", count: 0 },
        { id: "tips", name: "General Tips & Packing", icon: "Compass", count: 0 }
      ],
      places: [],
      packingChecklist: [
        { id: "pk-new-1", category: "Documents", item: "Passports and IDs", completed: false },
        { id: "pk-new-2", category: "Tech", item: "Universal travel adapter and chargers", completed: false },
        { id: "pk-new-3", category: "Clothing", item: "Weather-appropriate outfits and walking shoes", completed: false }
      ],
      tips: {
        emergencyContacts: [
          { name: "Emergency Police/Ambulance", number: "112 / 911", desc: "Local emergency helpline" }
        ],
        transitInfo: [
          { title: "Airport Transfers", desc: "Check official taxi ranks or airport express trains." }
        ],
        currencyAdvice: [
          { title: "Currency & Cards", desc: "No foreign transaction fee cards are strongly recommended." }
        ]
      },
      itinerary: [
        {
          id: "itin-new-1",
          dayNumber: 1,
          dayLabel: "Day 1",
          period: "Morning",
          time: "10:00 AM",
          activity: "Arrival & Hotel Check-in",
          category: "hotels",
          linkedPlaceId: null,
          location: "Destination Center",
          cost: 0,
          bookingStatus: "Need to Book",
          notes: "Unpack and get oriented with the city.",
          completed: false
        }
      ]
    };

    onCreateTrip(newTrip);
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-sky-900 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4" /> Multi-Destination Switcher
            </div>
            <h3 className="text-xl font-bold">Select or Create Destination</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isCreating ? (
            <>
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Available Trips & Destinations
                </div>
                {trips.map((trip) => {
                  const isActive = trip.id === activeTripId;
                  return (
                    <div
                      key={trip.id}
                      onClick={() => {
                        onSelectTrip(trip.id);
                        onClose();
                      }}
                      className={`group p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? "bg-sky-50/80 border-sky-400 ring-2 ring-sky-400/20 shadow-xs"
                          : "bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl p-2 bg-slate-100 rounded-xl group-hover:scale-105 transition-transform">
                          {trip.flag || "✈️"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 text-base">{trip.destination}</h4>
                            {isActive && (
                              <span className="px-2 py-0.5 bg-sky-600 text-white text-[11px] font-bold rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{trip.subtitle}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {trip.dateRange}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              {trip.companions?.length || 1} travelers
                            </span>
                            <span className="font-semibold text-slate-600">
                              {trip.places?.length || 0} places
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {trips.length > 1 && (
                          <button
                            title="Delete Trip"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${trip.destination}"?`)) {
                                onDeleteTrip(trip.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        {isActive && <Check className="w-5 h-5 text-sky-600 font-bold" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={startCreate}
                className="w-full py-3 border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-50 text-sky-700 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add New Destination / Trip
              </button>
            </>
          ) : (
            /* Create Trip Form */
            <form onSubmit={handleSaveNew} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm">Create New Trip Plan</h4>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Destination Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Iceland, Bali, Switzerland"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Flag / Emoji</label>
                  <input
                    type="text"
                    placeholder="🇮🇸"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-center focus:ring-2 focus:ring-sky-500 focus:outline-none text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Trip Subtitle / Route</label>
                <input
                  type="text"
                  placeholder="e.g., Reykjavik, Golden Circle & South Coast"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Dates / Date Range</label>
                  <input
                    type="text"
                    placeholder="e.g., Sep 15 – Sep 24, 2026"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Base Currency Code</label>
                  <input
                    type="text"
                    placeholder="e.g., EUR, ISK, JPY, USD"
                    value={baseCurrency}
                    onChange={(e) => setBaseCurrency(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm uppercase focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    placeholder="e.g., €, kr, ¥, $"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-medium text-sm rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors"
                >
                  Create Trip
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
