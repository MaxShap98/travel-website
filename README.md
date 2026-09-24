# ✈️ Travel Planner Dashboard – Modern Browser App

A clean, modern, and intuitive web application designed specifically for independent travelers, vacation planners, and travel groups. It replaces scattered spreadsheets, notes, and browser tabs with a unified, interactive travel planning dashboard.

---

## 🌟 Key Features

### 1. Destination Header & Overview
- **Destination Tag / Badge**: Prominent badge with active destination (e.g. `Destination: Greece 🇬🇷 - Athens, Santorini & Mykonos`).
- **Destination Switcher**: Switch between pre-loaded destinations (**Greece 🇬🇷**, **Japan 🇯🇵**, **Italy 🇮🇹**) or create custom trips with flags, dates, and local currency.
- **Trip Meta Info**:
  - Trip dates & duration (e.g. `Oct 12 – Oct 20, 2026 · 9 Days · 8 Nights`).
  - **Travel Companions**: Avatar stack with roles (Trip Lead, Foodie, Photographer) and a group member manager.
  - **Live Weather Widget**: Current temperature, wind, humidity, UV index, and 5-day forecast outlook modal.
  - **Interactive Currency Widget**: Real-time calculator between trip currency (EUR, JPY, etc.) and USD/GBP, quick amount presets, and a restaurant tip calculator.
  - **Auto-Save Indicator**: Real-time confirmation that all edits are saved in `localStorage`.

### 2. Curated Recommendations & Categories
Dedicated category filters and cards for:
- 🏨 **Hotels & Accommodations**: Check-in/out times, booking links, address, and amenities.
- 🍽️ **Restaurants & Dining**: Cuisine type, reservation status, price tiers, and signature dishes.
- 🍸 **Bars & Nightlife**: Operating hours, vibe, rooftop/beach club highlights.
- ⛵ **Parties & Events**: Catamaran cruises, festivals, DJ sets, dress codes.
- 🏛️ **Attractions & Leisure**: Landmark tours, hiking trails, beaches, duration.
- 📋 **Miscellaneous & Tips**: Emergency contacts, transit advice, money/ATM rules.

**Card Capabilities**:
- **Interactive Status Toggle**: Switch between *Must Visit*, *Booked*, *Optional*, or *Visited* with 1 click.
- **Ratings & Price Tiers**: Star rating and $, $$, $$$, $$$$ indicators.
- **One-Click "Add to Itinerary"**: Instantly schedule any place onto a specific Day and Time Period.
- **Direct Maps & Booking**: Quick links to Google Maps and official booking URLs.
- **Full CRUD**: Add, edit, or delete recommendations.

### 3. Day-by-Day Interactive Itinerary
- **Structured Schedule Table**:
  - `Done` (Checkbox toggle to strike-through and mark activities completed).
  - `Day / Date` (Day 1, Day 2, etc.).
  - `Time / Period` (Color-coded pills for Morning 🌅, Afternoon ☀️, Evening 🌇, Night 🌙).
  - `Activity / Place` (Linked to curated recommendations with category pills).
  - `Location / Address` (Clickable Google Maps link).
  - `Cost / Booking Status` (Confirmed, Reserved, Need to Book, Walk-in, Free).
  - `Notes & Reminders` (Confirmation codes, tickets, dress requirements).
  - `Actions` (Reorder ▲/▼, Edit, Delete).
- **Dual View Modes**: Switch between dense **Table View** and visual **Timeline Cards View**.
- **Interactive Filters**: Filter by Day (All Days, Day 1, Day 2...), Period, and Category.
- **Completion Tracker**: Visual progress bar showing percentage of planned activities finished.

### 4. Travel Tips & Interactive Packing Checklist
- **Packing Checklist**: Organized by *Documents*, *Clothing*, *Beach Gear*, *Tech & Gadgets*, and *Health & Toiletries* with completion meter and ability to add/delete custom items.
- **Emergency Contacts**: One-click phone call links for Tourist Police, 112 Emergency, hospitals, and consulates.
- **Transit & Logistics Guide**: High-speed ferries vs catamarans, airport metro, local island buses, and scooter cautions.
- **Money & Tipping Etiquette**: ATM fee avoidance (Euronet warnings) and card payment best practices.

### 5. Budget & Cost Overview
- Summary cards: **Total Estimated Spend**, **Confirmed / Booked**, **Pending / On-Site**, and **Per-Traveler Share**.
- Visual **Category Spending Allocation** bars (Hotels, Dining, Nightlife, Events, Attractions, Transit).
- Itemized expense ranking sorted by cost.

### 6. Export, Sharing & Print / PDF
- **Download JSON**: Export your complete trip data to a backup file.
- **Import JSON**: Restore saved trip files into the app.
- **Print / PDF Voucher**: Paper-formatted layout (`@media print`) rendering a clean travel voucher packet.
- **Reset to Defaults**: Quick restore to sample destinations anytime.

---

## 🚀 Getting Started

The project is built with **React 19**, **Vite 8**, **Tailwind CSS 4**, and **Lucide Icons**.

```bash
# Navigate to project directory
cd travel-planner

# Install dependencies (already installed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The live development server is running at:
👉 **`http://localhost:5173/`**
