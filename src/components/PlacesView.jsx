import React, { useState, useMemo } from "react";
import {
  Hotel,
  Utensils,
  Wine,
  PartyPopper,
  Landmark,
  Compass,
  ShoppingBag,
  Filter,
  Plus,
  Sparkles,
  Layers,
  MapPin,
  Link,
  DollarSign
} from "lucide-react";
import { PlaceCard } from "./PlaceCard";

export function PlacesView({
  places,
  itinerary = [],
  totalDays = 7,
  currencySymbol = "€",
  searchQuery = "",
  lang = "he",
  onStatusChange,
  onQuickScheduleToDay,
  onAddToItinerary,
  onSavePlace,
  onOpenAddModal,
  onEditPlace,
  onDeletePlace
}) {
  const isHe = lang === "he";
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Inline Quick-Add form state
  const [quickName, setQuickName] = useState("");
  const [quickCategory, setQuickCategory] = useState("dining");
  const [quickLocation, setQuickLocation] = useState("");
  const [quickNotes, setQuickNotes] = useState("");
  const [quickCost, setQuickCost] = useState("");

  const categories = [
    { id: "all", label: isHe ? "כל המקומות" : "All Places", icon: Layers },
    { id: "dining", label: isHe ? "🍽️ מסעדות ואוכל" : "🍽️ Dining", icon: Utensils },
    { id: "hotels", label: isHe ? "🏨 מלונות ולינה" : "🏨 Hotels", icon: Hotel },
    { id: "attractions", label: isHe ? "🏛️ אטרקציות" : "🏛️ Attractions", icon: Landmark },
    { id: "nightlife", label: isHe ? "🍸 ברים ובילוי" : "🍸 Nightlife", icon: Wine },
    { id: "events", label: isHe ? "⛵ פעילויות וסיורים" : "⛵ Tours", icon: PartyPopper },
    { id: "shopping", label: isHe ? "🛍️ קניות" : "🛍️ Shopping", icon: ShoppingBag }
  ];

  // Map each place to its scheduled day numbers in the itinerary
  const placeScheduledDays = useMemo(() => {
    const map = {};
    itinerary.forEach((item) => {
      if (item.linkedPlaceId) {
        if (!map[item.linkedPlaceId]) map[item.linkedPlaceId] = [];
        if (!map[item.linkedPlaceId].includes(item.dayNumber)) {
          map[item.linkedPlaceId].push(item.dayNumber);
        }
      } else {
        // match by name
        const match = places.find(
          (p) => p.name.trim().toLowerCase() === item.activity.trim().toLowerCase()
        );
        if (match) {
          if (!map[match.id]) map[match.id] = [];
          if (!map[match.id].includes(item.dayNumber)) {
            map[match.id].push(item.dayNumber);
          }
        }
      }
    });
    return map;
  }, [itinerary, places]);

  // Handle Quick Add Submit
  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    const newPlace = {
      id: "place-" + Date.now(),
      name: quickName.trim(),
      category: quickCategory,
      location: quickLocation.trim(),
      notes: quickNotes.trim(),
      cost: parseFloat(quickCost) || 0,
      status: "Must Visit",
      priceRange: "$$",
      rating: 4.8
    };

    onSavePlace(newPlace);
    setQuickName("");
    setQuickLocation("");
    setQuickNotes("");
    setQuickCost("");
  };

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      if (selectedCategory !== "all" && place.category !== selectedCategory) {
        return false;
      }
      if (statusFilter !== "all" && place.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = place.name.toLowerCase().includes(query);
        const matchDesc = place.description?.toLowerCase().includes(query);
        const matchLoc = place.location?.toLowerCase().includes(query);
        const matchNotes = place.notes?.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchLoc && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [places, selectedCategory, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ⚡ Dedicated Quick-Add Place Bar */}
      <div className="bg-white rounded-2xl border-2 border-sky-300/80 shadow-md p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-500 text-white rounded-lg shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-base text-slate-800">
              {isHe ? "הוספה מהירה של מקום שאהבת" : "Quick Add a Place to Your List"}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {isHe
              ? "שמור מקומות מאינסטגרם, גוגל מפות או בלוגים ושבץ אותם בקלות בלו״ז"
              : "Save spots from maps or blogs, then assign them to days"}
          </span>
        </div>

        <form onSubmit={handleQuickAddSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            {/* Place Name */}
            <div className="sm:col-span-4">
              <input
                type="text"
                required
                dir="auto"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                placeholder={
                  isHe
                    ? "שם המקום (למשל: מסעדת שף, תצפית, פיצרייה, מוזיאון...)"
                    : "Place name (e.g. Seafood tavern, Viewpoint, Museum...)"
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div className="sm:col-span-3">
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
              >
                <option value="dining">{isHe ? "🍽️ מסעדה ואוכל" : "🍽️ Food & Dining"}</option>
                <option value="hotels">{isHe ? "🏨 מלון ולינה" : "🏨 Hotel / Stay"}</option>
                <option value="attractions">{isHe ? "🏛️ אטרקציה ותצפית" : "🏛️ Attraction"}</option>
                <option value="nightlife">{isHe ? "🍸 בר וחיי לילה" : "🍸 Bar & Nightlife"}</option>
                <option value="events">{isHe ? "⛵ שייט / סיור / אירוע" : "⛵ Event / Tour"}</option>
                <option value="shopping">{isHe ? "🛍️ קניות ושווקים" : "🛍️ Shopping"}</option>
                <option value="tips">{isHe ? "📌 כללי ותחבורה" : "📌 Transit / Other"}</option>
              </select>
            </div>

            {/* Location / Link */}
            <div className="sm:col-span-3">
              <input
                type="text"
                dir="auto"
                value={quickLocation}
                onChange={(e) => setQuickLocation(e.target.value)}
                placeholder={isHe ? "קישור לגוגל מפות או כתובת" : "Address or Google Maps link"}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full h-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isHe ? "הוסף מקום" : "Add Place"}</span>
              </button>
            </div>
          </div>

          {/* Optional Notes & Cost Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
            <div className="sm:col-span-9">
              <input
                type="text"
                dir="auto"
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                placeholder={
                  isHe
                    ? "הערות/טיפים אישיים (למשל: להזמין מקום מראש, שקיעה מומלצת...)"
                    : "Notes & personal tips (e.g. sunset table, reservation needed...)"
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs text-slate-600 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-3">
              <input
                type="number"
                min="0"
                value={quickCost}
                onChange={(e) => setQuickCost(e.target.value)}
                placeholder={isHe ? `עלות משוערת (${currencySymbol})` : `Est. Cost (${currencySymbol})`}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs text-slate-600 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === "all"
                ? places.length
                : places.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter by status */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">
            {isHe ? "סטטוס:" : "Status:"}
          </span>
          {["all", "Must Visit", "Booked", "Optional"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-sky-100 text-sky-800 border border-sky-300 font-bold"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st === "all"
                ? isHe
                  ? "הכל"
                  : "All"
                : st === "Must Visit"
                ? isHe
                  ? "חובה"
                  : "Must Visit"
                : st === "Booked"
                ? isHe
                  ? "הוזמן"
                  : "Booked"
                : isHe
                ? "אופציונלי"
                : "Optional"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Place Cards */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              currencySymbol={currencySymbol}
              totalDays={totalDays}
              scheduledDays={placeScheduledDays[place.id] || []}
              lang={lang}
              onStatusChange={onStatusChange}
              onQuickScheduleToDay={onQuickScheduleToDay}
              onAddToItinerary={onAddToItinerary}
              onEdit={onEditPlace}
              onDelete={onDeletePlace}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">
            {places.length === 0
              ? isHe
                ? "עדיין לא הוספת מקומות לטיול שלך"
                : "No places saved in your trip yet"
              : isHe
              ? "לא נמצאו מקומות לפי הסינון שבחרת"
              : "No places match this filter"}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isHe
              ? "הכנס את המסעדות, המלונות והאטרקציות שמעניינים אותך בטופס למעלה, ולאחר מכן תוכל לשבץ אותם בלחיצה אחת בלו״ז היומי!"
              : "Type your favorite spots into the bar above to assemble your customized itinerary!"}
          </p>
        </div>
      )}
    </div>
  );
}
