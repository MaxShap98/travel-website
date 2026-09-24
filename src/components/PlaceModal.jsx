import React, { useState, useEffect } from "react";
import { X, MapPin, DollarSign, Star, Image, Link, Clock, Sparkles } from "lucide-react";

export function PlaceModal({
  isOpen,
  onClose,
  onSavePlace,
  placeToEdit = null,
  currencySymbol = "€",
  lang = "he"
}) {
  if (!isOpen) return null;

  const isHe = lang === "he";
  const isEdit = !!placeToEdit;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("dining");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Must Visit");
  const [priceRange, setPriceRange] = useState("$$");
  const [rating, setRating] = useState("4.8");
  const [cost, setCost] = useState(50);
  const [location, setLocation] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [image, setImage] = useState("");
  const [notes, setNotes] = useState("");

  // Category specific
  const [checkIn, setCheckIn] = useState("15:00");
  const [checkOut, setCheckOut] = useState("11:00");
  const [cuisine, setCuisine] = useState("");
  const [signatureDishes, setSignatureDishes] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [vibe, setVibe] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [amenities, setAmenities] = useState("");

  useEffect(() => {
    if (placeToEdit) {
      setName(placeToEdit.name || "");
      setCategory(placeToEdit.category || "dining");
      setDescription(placeToEdit.description || "");
      setStatus(placeToEdit.status || "Must Visit");
      setPriceRange(placeToEdit.priceRange || "$$");
      setRating(placeToEdit.rating ? placeToEdit.rating.toString() : "4.8");
      setCost(placeToEdit.cost || 0);
      setLocation(placeToEdit.location || "");
      setBookingUrl(placeToEdit.bookingUrl || "");
      setMapsUrl(placeToEdit.mapsUrl || "");
      setImage(placeToEdit.image || "");
      setNotes(placeToEdit.notes || "");
      setCheckIn(placeToEdit.checkIn || "15:00");
      setCheckOut(placeToEdit.checkOut || "11:00");
      setCuisine(placeToEdit.cuisine || "");
      setSignatureDishes(placeToEdit.signatureDishes ? placeToEdit.signatureDishes.join(", ") : "");
      setOperatingHours(placeToEdit.operatingHours || "");
      setVibe(placeToEdit.vibe || "");
      setDressCode(placeToEdit.dressCode || "");
      setAmenities(placeToEdit.amenities ? placeToEdit.amenities.join(", ") : "");
    } else {
      setName("");
      setCategory("dining");
      setDescription("");
      setStatus("Must Visit");
      setPriceRange("$$");
      setRating("4.8");
      setCost(45);
      setLocation("");
      setBookingUrl("");
      setMapsUrl("");
      setImage("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80");
      setNotes("");
      setCheckIn("15:00");
      setCheckOut("11:00");
      setCuisine("");
      setSignatureDishes("");
      setOperatingHours("");
      setVibe("");
      setDressCode("");
      setAmenities("");
    }
  }, [placeToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedPlace = {
      id: placeToEdit ? placeToEdit.id : "place-" + Date.now(),
      name: name.trim(),
      category,
      description: description.trim(),
      status,
      priceRange,
      rating: parseFloat(rating) || 4.5,
      cost: parseFloat(cost) || 0,
      location: location.trim(),
      bookingUrl: bookingUrl.trim() || undefined,
      mapsUrl: mapsUrl.trim() || undefined,
      image: image.trim() || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      notes: notes.trim() || undefined,
      checkIn: category === "hotels" ? checkIn.trim() : undefined,
      checkOut: category === "hotels" ? checkOut.trim() : undefined,
      amenities: category === "hotels" && amenities.trim() ? amenities.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      cuisine: category === "dining" ? cuisine.trim() : undefined,
      signatureDishes: category === "dining" && signatureDishes.trim() ? signatureDishes.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      operatingHours: (category === "nightlife" || category === "events" || category === "attractions") ? operatingHours.trim() : undefined,
      vibe: category === "nightlife" ? vibe.trim() : undefined,
      dressCode: category === "events" ? dressCode.trim() : undefined
    };

    onSavePlace(updatedPlace);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in no-print">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col"
        dir={isHe ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-800 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold">
              {isEdit
                ? isHe
                  ? `עריכת "${placeToEdit.name}"`
                  : `Edit "${placeToEdit.name}"`
                : isHe
                ? "הוספת מקום / המלצה חדשה"
                : "Add New Recommendation / Spot"}
            </h3>
            <p className="text-sky-200 text-xs">
              {isHe
                ? "הזן את פרטי המקום, קטגוריה וקישורים ישירים"
                : "Fill in spot highlights, category, and direct links"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHe ? "שם המקום *" : "Place Name *"}
              </label>
              <input
                type="text"
                required
                placeholder={isHe ? "למשל: מסעדת החוף, זארה, תצפית השקיעה..." : "e.g. Scorpios Beach Club"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHe ? "קטגוריה *" : "Category *"}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white font-medium"
              >
                <option value="hotels">{isHe ? "🏨 מלונות ולינה" : "🏨 Hotels & Stays"}</option>
                <option value="dining">{isHe ? "🍽️ מסעדות ואוכל" : "🍽️ Restaurants & Dining"}</option>
                <option value="nightlife">{isHe ? "🍸 ברים וחיי לילה" : "🍸 Bars & Nightlife"}</option>
                <option value="events">{isHe ? "⛵ מסיבות ואירועים" : "⛵ Parties & Events"}</option>
                <option value="attractions">{isHe ? "🏛️ אטרקציות ובילוי" : "🏛️ Attractions & Leisure"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isHe ? "תיאור וחוויות" : "Description"}
            </label>
            <textarea
              rows="2"
              placeholder={
                isHe
                  ? "מה מיוחד במקום? וייב, אווירה, טיפים, המלצות ספציפיות..."
                  : "What makes this place special? Vibe, atmosphere, highlight..."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHe ? "סטטוס ביקור" : "Status"}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
              >
                <option value="Must Visit">{isHe ? "🌟 חובה לבקר" : "🌟 Must Visit"}</option>
                <option value="Booked">{isHe ? "✓ מוזמן / משוריין" : "✓ Booked"}</option>
                <option value="Optional">{isHe ? "💡 אופציונלי" : "💡 Optional"}</option>
                <option value="Visited">{isHe ? "📍 ביקרנו כבר" : "📍 Visited"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHe ? "רמת מחיר" : "Price Tier"}
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white text-emerald-700"
              >
                <option value="$">{isHe ? "$ (זול / חסכוני)" : "$ (Budget)"}</option>
                <option value="$$">{isHe ? "$$ (בינוני)" : "$$ (Moderate)"}</option>
                <option value="$$$">{isHe ? "$$$ (גבוה)" : "$$$ (Upscale)"}</option>
                <option value="$$$$">{isHe ? "$$$$ (יוקרתי)" : "$$$$ (Luxury)"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHe ? "דירוג (כוכבים)" : "Rating (Stars)"}
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHe ? `עלות משוערת (${currencySymbol})` : `Est. Cost (${currencySymbol})`}
              </label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isHe ? "כתובת / מיקום" : "Address / Location"}
            </label>
            <input
              type="text"
              placeholder={isHe ? "למשל: רחוב ראשי, מרכז העיר, ליד תחנת המטרו..." : "e.g. Paraga Beach, Mykonos 846 00"}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Category-Specific dynamic fields */}
          {category === "hotels" && (
            <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-sky-900 mb-1">
                    {isHe ? "שעת צ'ק-אין" : "Check-in Time"}
                  </label>
                  <input
                    type="text"
                    placeholder="15:00"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-sky-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-sky-900 mb-1">
                    {isHe ? "שעת צ'ק-אאוט" : "Check-out Time"}
                  </label>
                  <input
                    type="text"
                    placeholder="11:00"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-sky-200 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-sky-900 mb-1">
                  {isHe ? "שירותים ומתקנים (מופרדים בפסיק)" : "Amenities (comma-separated)"}
                </label>
                <input
                  type="text"
                  placeholder={isHe ? "בריכה, נוף לים, ארוחת בוקר, חדר כושר, ספא" : "Infinity Pool, Caldera View, Spa, Free Breakfast"}
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-sky-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {category === "dining" && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    {isHe ? "סגנון מטבח" : "Cuisine Type"}
                  </label>
                  <input
                    type="text"
                    placeholder={isHe ? "למשל: דגים, יווני מודרני, איטלקי, שף..." : "e.g. Modern Greek Seafood"}
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    {isHe ? "מנות מומלצות (מופרדות בפסיק)" : "Signature Dishes (comma-separated)"}
                  </label>
                  <input
                    type="text"
                    placeholder={isHe ? "תמנון בגריל, סלט יווני, סופלאקי, מוסקה" : "Grilled Octopus, Tomato Keftedes, Saganaki"}
                    value={signatureDishes}
                    onChange={(e) => setSignatureDishes(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {category === "nightlife" && (
            <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-xl grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-purple-900 mb-1">
                  {isHe ? "שעות פעילות" : "Operating Hours"}
                </label>
                <input
                  type="text"
                  placeholder="18:00 – 03:00"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-purple-900 mb-1">
                  {isHe ? "אווירה ווייב" : "Atmosphere / Vibe"}
                </label>
                <input
                  type="text"
                  placeholder={isHe ? "בר גג שקיעה, מוזיקת צ'יל, קוקטיילים" : "Rooftop Sunset Lounge"}
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {category === "events" && (
            <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-rose-900 mb-1">
                  {isHe ? "לוח זמנים ושעות" : "Schedule / Hours"}
                </label>
                <input
                  type="text"
                  placeholder="14:30 – 20:00"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-rose-900 mb-1">
                  {isHe ? "קוד לבוש" : "Dress Code"}
                </label>
                <input
                  type="text"
                  placeholder={isHe ? "הכל לבן / אלגנט חוף / קז'ואל" : "All White / Beach Glam"}
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {category === "attractions" && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                {isHe ? "שעות פתיחה / זמן מומלץ להגעה" : "Opening Hours / Best Time"}
              </label>
              <input
                type="text"
                placeholder={isHe ? "08:00 – 19:30 (מומלץ בשעות הבוקר המוקדמות)" : "08:00 – 19:30 (Best visit at 08:30 AM)"}
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHe ? "קישור לאתר / הזמנות (URL)" : "Website / Booking URL"}
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={bookingUrl}
                onChange={(e) => setBookingUrl(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHe ? "קישור לתמונה (URL)" : "Photo Image URL"}
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isHe ? "הערות ותזכורות אישיות" : "Traveler Notes & Reminders"}
            </label>
            <input
              type="text"
              placeholder={
                isHe
                  ? "למשל: לבקש שולחן ליד החלון, הזמנה על שם מקס, להגיע 10 דקות מראש..."
                  : "e.g. Ask for table on cliff edge, reservation under Alex, no heels allowed"
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 font-medium text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isHe ? "ביטול" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              {isEdit ? (isHe ? "שמור שינויים" : "Save Changes") : isHe ? "הוסף מקום" : "Add Place"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
