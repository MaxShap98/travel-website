import React, { useState, useEffect, useRef } from "react";
import { initialTrips } from "./data/initialTrips";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import { PlacesView } from "./components/PlacesView";
import { ItineraryView } from "./components/ItineraryView";
import { TipsAndPackingView } from "./components/TipsAndPackingView";
import { BudgetView } from "./components/BudgetView";
import { PlaceModal } from "./components/PlaceModal";
import { AddToItineraryModal } from "./components/AddToItineraryModal";
import { ItineraryModal } from "./components/ItineraryModal";
import { DestinationModal } from "./components/DestinationModal";
import { WeatherModal } from "./components/WeatherModal";
import { CurrencyModal } from "./components/CurrencyModal";
import { CompanionsModal } from "./components/CompanionsModal";
import { ExportShareModal } from "./components/ExportShareModal";
import { FirebaseSyncModal } from "./components/FirebaseSyncModal";
import { PrintView } from "./components/PrintView";
import { Toast } from "./components/Toast";
import {
  isFirebaseReady,
  syncTripToCloud,
  subscribeToCloudTrip,
  fetchCloudTrip,
  syncGlobalStateToCloud,
  subscribeToGlobalState
} from "./services/firebase";

const STORAGE_KEY_TRIPS = "travel_planner_trips_v2";
const STORAGE_KEY_ACTIVE_ID = "travel_planner_active_id_v2";
const STORAGE_KEY_LANG = "travel_planner_lang_v2";

export default function App() {
  // Language state (defaulting to Hebrew since the user requested in Hebrew)
  const [lang, setLang] = useState(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (savedLang) return savedLang;
    } catch (e) {}
    return "he";
  });

  const isHe = lang === "he";

  // Load initial trips or create a clean custom trip
  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRIPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load saved trips", e);
    }

    // Default clean custom trip at top + sample trips as options
    const myCleanTrip = {
      id: "my-trip-" + Date.now(),
      title: "הטיול שלי ✈️",
      destination: "היעד שלי ✈️",
      subtitle: "הרכבת לו״ז ומקומות אישיים",
      country: "Custom",
      flag: "✈️",
      dateRange: "תאריכי נסיעה",
      startDate: new Date().toISOString().split("T")[0],
      durationDays: 5,
      baseCurrency: "EUR",
      currencySymbol: "€",
      exchangeRateToUSD: 1.09,
      companions: [
        { id: "c1", name: "אני", role: "מתכנן ראשי", avatar: "אני", color: "bg-blue-600" }
      ],
      places: [],
      itinerary: [],
      packingChecklist: [
        { id: "pk-1", category: "מסמכים", item: "דרכון בתוקף ל-6 חודשים", completed: false },
        { id: "pk-2", category: "ציוד", item: "מטען נייד ומתאם לחשמל", completed: false },
        { id: "pk-3", category: "ביגוד", item: "נעלי הליכה נוחות", completed: false }
      ],
      tips: {
        emergencyContacts: [
          { name: "מוקד חירום בינלאומי", number: "112", desc: "חירום כללי באנגלית/עברית" }
        ],
        transitInfo: [
          { title: "תחבורה מקומית", desc: "בדוק רכבות, מטרו או אוטובוסים מראש לנסיעה נוחה" }
        ],
        currencyAdvice: [
          { title: "תשלום באשראי", desc: "בחר תמיד לשלם במטבע המקומי כדי למנוע עמלות המרה יקרות" }
        ]
      }
    };

    return [myCleanTrip, ...initialTrips];
  });

  // Active trip ID
  const [activeTripId, setActiveTripId] = useState(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (savedId) return savedId;
    } catch (e) {}
    return trips[0]?.id || "my-trip";
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState("places"); // 'places' | 'itinerary' | 'tips' | 'budget'

  // Global Search
  const [searchQuery, setSearchQuery] = useState("");

  // Toast
  const [toast, setToast] = useState(null);

  // Modals state
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isCompanionsModalOpen, setIsCompanionsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isCloudReady, setIsCloudReady] = useState(() => isFirebaseReady());

  // Place Modal state
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [placeToEdit, setPlaceToEdit] = useState(null);

  // Quick Add To Itinerary Modal state
  const [placeToSchedule, setPlaceToSchedule] = useState(null);

  // Itinerary Activity Modal state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
    } catch (e) {
      console.error("Failed to save trips", e);
    }
  }, [trips]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeTripId);
    } catch (e) {}
  }, [activeTripId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (e) {}
  }, [lang]);

  // Read shared trip from URL hash #plan=... if present
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("plan=")) {
      try {
        const b64 = hash.split("plan=")[1];
        if (b64) {
          const jsonStr = decodeURIComponent(
            Array.prototype.map
              .call(atob(b64), (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const importedTrip = JSON.parse(jsonStr);
          if (importedTrip && importedTrip.destination) {
            setTrips((prev) => {
              const exists = prev.some((t) => t.id === importedTrip.id);
              if (exists) {
                return prev.map((t) => (t.id === importedTrip.id ? importedTrip : t));
              }
              return [importedTrip, ...prev];
            });
            setActiveTripId(importedTrip.id);
            showToast({
              type: "success",
              message: isHe
                ? `נטען בהצלחה הטיול ל-${importedTrip.destination} מהקישור!`
                : `Loaded trip for ${importedTrip.destination} from link!`
            });
            // Clean URL hash
            window.history.replaceState(null, null, " ");
          }
        }
      } catch (err) {
        console.error("Failed to parse shared plan from URL hash", err);
      }
    }
  }, []);

  // Check cloud readiness
  useEffect(() => {
    setIsCloudReady(isFirebaseReady());
  }, [isSyncModalOpen]);

  // Read shared room from URL query ?room=... if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");
    if (room) {
      fetchCloudTrip(room)
        .then((cloudTrip) => {
          if (cloudTrip && cloudTrip.destination) {
            setTrips((prev) => {
              const exists = prev.some((t) => t.id === cloudTrip.id);
              return exists
                ? prev.map((t) => (t.id === cloudTrip.id ? cloudTrip : t))
                : [cloudTrip, ...prev];
            });
            setActiveTripId(cloudTrip.id);
            showToast({
              type: "success",
              message: isHe
                ? `התחברת לחדר הענן: ${cloudTrip.destination}!`
                : `Connected to cloud room: ${cloudTrip.destination}!`
            });
          }
        })
        .catch((err) => console.error("Could not fetch room from cloud", err));
    }
  }, []);

  // Real-time subscription to active trip in Firestore
  useEffect(() => {
    if (!isCloudReady || !activeTripId) return;

    const unsub = subscribeToCloudTrip(
      activeTripId,
      (remoteTrip) => {
        if (remoteTrip && remoteTrip.lastUpdatedCloud) {
          setTrips((prev) =>
            prev.map((t) => {
              if (t.id === remoteTrip.id) {
                if (t.lastUpdatedCloud !== remoteTrip.lastUpdatedCloud) {
                  return remoteTrip;
                }
              }
              return t;
            })
          );
        }
      },
      (err) => {
        console.error("Cloud subscription error", err);
      }
    );

    return () => {
      if (unsub) unsub();
    };
  }, [activeTripId, isCloudReady]);

  // Current active trip
  const currentTrip = trips.find((t) => t.id === activeTripId) || trips[0];

  const showToast = (toastObj) => {
    setToast(toastObj);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Helper to update current trip with cloud sync
  const updateCurrentTrip = (updater) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id === currentTrip.id) {
          const next = typeof updater === "function" ? updater(t) : { ...t, ...updater };
          next.lastUpdatedCloud = new Date().toISOString();
          if (isFirebaseReady()) {
            syncTripToCloud(next).catch((err) =>
              console.error("Auto cloud sync error", err)
            );
          }
          return next;
        }
        return t;
      })
    );
  };

  // Language toggle
  const handleToggleLang = () => {
    const nextLang = lang === "he" ? "en" : "he";
    setLang(nextLang);
    showToast({
      type: "info",
      message: nextLang === "he" ? "השפה שונתה לעברית 🇮🇱" : "Switched to English 🇬🇧"
    });
  };

  // 1. Start Fresh Blank Trip Handler
  const handleStartBlankTrip = () => {
    const destName = window.prompt(
      isHe
        ? "לאיזה יעד אתה מתכנן לטוס? (למשל: איטליה, לונדון, ברצלונה, יפן, תאילנד...)"
        : "What destination are you planning? (e.g. Italy, London, Barcelona, Japan...)",
      isHe ? "רומא, איטליה 🇮🇹" : "Rome, Italy 🇮🇹"
    );

    if (!destName || !destName.trim()) return;

    const newTrip = {
      id: "trip-" + Date.now(),
      title: destName.trim(),
      destination: destName.trim(),
      subtitle: isHe ? "הרכבת לו״ז ומקומות אישיים" : "Personal itinerary & custom places",
      country: destName.trim(),
      flag: "✈️",
      dateRange: isHe ? "בחר תאריכים" : "Select dates",
      startDate: new Date().toISOString().split("T")[0],
      durationDays: 5,
      baseCurrency: "EUR",
      currencySymbol: "€",
      exchangeRateToUSD: 1.09,
      companions: [
        { id: "c-1", name: isHe ? "אני" : "Me", role: isHe ? "מתכנן" : "Planner", avatar: "אני", color: "bg-blue-600" }
      ],
      places: [],
      itinerary: [],
      packingChecklist: [
        { id: "pk-1", category: isHe ? "מסמכים" : "Documents", item: isHe ? "דרכון בתוקף" : "Passport", completed: false },
        { id: "pk-2", category: isHe ? "ציוד" : "Gear", item: isHe ? "מתאם חשמל ומטען" : "Universal adapter", completed: false }
      ],
      tips: {
        emergencyContacts: [
          { name: isHe ? "מוקד חירום" : "Emergency Police", number: "112", desc: "Universal Emergency" }
        ],
        transitInfo: [],
        currencyAdvice: []
      }
    };

    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripId(newTrip.id);
    setActiveTab("places");
    showToast({
      type: "success",
      message: isHe
        ? `נוצר טיול חדש ונקי ל-${destName.trim()}! כעת תוכל להכניס את המקומות שלך.`
        : `Created fresh blank trip for ${destName.trim()}! Start adding your places.`
    });
  };

  // 2. Clear Current Trip Places & Schedule
  const handleClearTrip = () => {
    if (
      window.confirm(
        isHe
          ? `האם לנקות את כל המקומות והלו״ז של "${currentTrip.destination}" ולהשאיר לוח ריק?`
          : `Clear all places and itinerary for "${currentTrip.destination}"?`
      )
    ) {
      updateCurrentTrip({ places: [], itinerary: [] });
      showToast({
        type: "info",
        message: isHe ? "הלוח נוקה בהצלחה! תוכל להכניס את המקומות שלך." : "Board cleared."
      });
    }
  };

  // 3. Quick 1-Click Schedule Place to Day X
  const handleQuickScheduleToDay = (place, dayNumber) => {
    const newActivity = {
      id: "itin-" + Date.now(),
      dayNumber: parseInt(dayNumber),
      dayLabel: isHe ? `יום ${dayNumber}` : `Day ${dayNumber}`,
      period: "Morning",
      time: "",
      activity: place.name,
      category: place.category,
      linkedPlaceId: place.id,
      location: place.location || "",
      cost: place.cost || 0,
      bookingStatus: place.status === "Booked" ? "Confirmed" : "Planned",
      notes: place.notes || "",
      completed: false
    };

    updateCurrentTrip((prev) => ({
      ...prev,
      itinerary: [...(prev.itinerary || []), newActivity]
    }));

    showToast({
      type: "success",
      message: isHe
        ? `"${place.name}" שובץ ביום ${dayNumber} בלו״ז!`
        : `Added "${place.name}" to Day ${dayNumber}!`
    });
  };

  // 4. Quick Inline Add Activity from Day Section
  const handleQuickAddActivity = (newActivity) => {
    updateCurrentTrip((prev) => ({
      ...prev,
      itinerary: [...(prev.itinerary || []), newActivity]
    }));

    showToast({
      type: "success",
      message: isHe
        ? `נוספה פעילות ליום ${newActivity.dayNumber}!`
        : `Added activity to Day ${newActivity.dayNumber}!`
    });
  };

  // 5. Adjust Days Count on the fly (+ / - day)
  const handleAddDay = () => {
    const nextDays = (currentTrip.durationDays || 5) + 1;
    updateCurrentTrip({ durationDays: nextDays });
    showToast({
      type: "success",
      message: isHe ? `נוסף יום ${nextDays} לטיול!` : `Added Day ${nextDays} to trip!`
    });
  };

  const handleRemoveDay = () => {
    if ((currentTrip.durationDays || 5) <= 1) return;
    const nextDays = (currentTrip.durationDays || 5) - 1;
    updateCurrentTrip({ durationDays: nextDays });
    showToast({
      type: "info",
      message: isHe ? `הטיול עודכן ל-${nextDays} ימים` : `Trip updated to ${nextDays} days`
    });
  };

  // 6. Places Handlers
  const handlePlaceStatusChange = (placeId, newStatus) => {
    updateCurrentTrip((prev) => ({
      ...prev,
      places: prev.places.map((p) => (p.id === placeId ? { ...p, status: newStatus } : p))
    }));
  };

  const handleSavePlace = (savedPlace) => {
    updateCurrentTrip((prev) => {
      const exists = prev.places.some((p) => p.id === savedPlace.id);
      let updatedPlaces;
      if (exists) {
        updatedPlaces = prev.places.map((p) => (p.id === savedPlace.id ? savedPlace : p));
      } else {
        updatedPlaces = [savedPlace, ...prev.places];
      }
      return { ...prev, places: updatedPlaces };
    });

    showToast({
      type: "success",
      message: isHe ? `המקום "${savedPlace.name}" נוסף בהצלחה!` : `Saved "${savedPlace.name}"!`
    });
    setPlaceToEdit(null);
  };

  const handleDeletePlace = (placeId) => {
    updateCurrentTrip((prev) => ({
      ...prev,
      places: prev.places.filter((p) => p.id !== placeId)
    }));
    showToast({
      type: "info",
      message: isHe ? "המקום הוסר." : "Place removed."
    });
  };

  // 7. Itinerary Handlers
  const handleToggleCompleteItinerary = (id) => {
    updateCurrentTrip((prev) => ({
      ...prev,
      itinerary: (prev.itinerary || []).map((it) =>
        it.id === id ? { ...it, completed: !it.completed } : it
      )
    }));
  };

  const handleMoveUpItinerary = (index) => {
    if (index <= 0) return;
    updateCurrentTrip((prev) => {
      const list = [...(prev.itinerary || [])];
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
      return { ...prev, itinerary: list };
    });
  };

  const handleMoveDownItinerary = (index) => {
    updateCurrentTrip((prev) => {
      const list = [...(prev.itinerary || [])];
      if (index >= list.length - 1) return prev;
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
      return { ...prev, itinerary: list };
    });
  };

  const handleSaveActivity = (activity) => {
    updateCurrentTrip((prev) => {
      const exists = (prev.itinerary || []).some((i) => i.id === activity.id);
      let updatedList;
      if (exists) {
        updatedList = (prev.itinerary || []).map((i) => (i.id === activity.id ? activity : i));
      } else {
        updatedList = [...(prev.itinerary || []), activity];
      }
      return { ...prev, itinerary: updatedList };
    });
    setActivityToEdit(null);
  };

  const handleDeleteActivity = (id) => {
    updateCurrentTrip((prev) => ({
      ...prev,
      itinerary: (prev.itinerary || []).filter((i) => i.id !== id)
    }));
  };

  // 8. Companions & Packing
  const handleUpdateCompanions = (newCompanions) => {
    updateCurrentTrip({ companions: newCompanions });
  };

  const handleTogglePackingItem = (id) => {
    updateCurrentTrip((prev) => ({
      ...prev,
      packingChecklist: (prev.packingChecklist || []).map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleAddPackingItem = (item) => {
    updateCurrentTrip((prev) => ({
      ...prev,
      packingChecklist: [...(prev.packingChecklist || []), item]
    }));
  };

  const handleDeletePackingItem = (id) => {
    updateCurrentTrip((prev) => ({
      ...prev,
      packingChecklist: (prev.packingChecklist || []).filter((item) => item.id !== id)
    }));
  };

  const handleResetDefaults = () => {
    setTrips(initialTrips);
    setActiveTripId(initialTrips[0].id);
    showToast({
      type: "success",
      message: isHe ? "שוחזרו טיולי הדוגמה." : "Reset to sample trips."
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNavbarQuickAdd = () => {
    if (activeTab === "itinerary") {
      setActivityToEdit(null);
      setIsActivityModalOpen(true);
    } else {
      setPlaceToEdit(null);
      setIsPlaceModalOpen(true);
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#fbf9f5] text-slate-800 flex flex-col font-sans selection:bg-sky-200 ${
        isHe ? "text-right" : "text-left"
      }`}
      dir={isHe ? "rtl" : "ltr"}
    >
      {/* Printable Voucher */}
      <PrintView trip={currentTrip} />

      {/* Main Screen App Layout */}
      <div className="flex-1 flex flex-col no-print">
        {/* Header */}
        <Header
          trip={currentTrip}
          lang={lang}
          isCloudSyncActive={isCloudReady}
          onToggleLang={handleToggleLang}
          onOpenDestinationModal={() => setIsDestinationModalOpen(true)}
          onOpenWeatherModal={() => setIsWeatherModalOpen(true)}
          onOpenCurrencyModal={() => setIsCurrencyModalOpen(true)}
          onOpenCompanionsModal={() => setIsCompanionsModalOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          onStartBlankTrip={handleStartBlankTrip}
          onClearTrip={handleClearTrip}
          onPrint={handlePrint}
        />

        {/* Sticky Tab Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placesCount={currentTrip?.places?.length || 0}
          itineraryCount={currentTrip?.itinerary?.length || 0}
          packingCount={
            currentTrip?.packingChecklist?.filter((p) => p.completed).length +
            "/" +
            (currentTrip?.packingChecklist?.length || 0)
          }
          lang={lang}
          onOpenAddModal={handleNavbarQuickAdd}
        />

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === "places" && (
            <PlacesView
              places={currentTrip?.places || []}
              itinerary={currentTrip?.itinerary || []}
              totalDays={currentTrip?.durationDays || 5}
              currencySymbol={currentTrip?.currencySymbol || "€"}
              searchQuery={searchQuery}
              lang={lang}
              onStatusChange={handlePlaceStatusChange}
              onQuickScheduleToDay={handleQuickScheduleToDay}
              onAddToItinerary={(place) => setPlaceToSchedule(place)}
              onSavePlace={handleSavePlace}
              onOpenAddModal={() => {
                setPlaceToEdit(null);
                setIsPlaceModalOpen(true);
              }}
              onEditPlace={(place) => {
                setPlaceToEdit(place);
                setIsPlaceModalOpen(true);
              }}
              onDeletePlace={handleDeletePlace}
            />
          )}

          {activeTab === "itinerary" && (
            <ItineraryView
              trip={currentTrip}
              itinerary={currentTrip?.itinerary || []}
              places={currentTrip?.places || []}
              currencySymbol={currentTrip?.currencySymbol || "€"}
              searchQuery={searchQuery}
              lang={lang}
              onToggleComplete={handleToggleCompleteItinerary}
              onMoveUp={handleMoveUpItinerary}
              onMoveDown={handleMoveDownItinerary}
              onEditActivity={(activity) => {
                setActivityToEdit(activity);
                setIsActivityModalOpen(true);
              }}
              onDeleteActivity={handleDeleteActivity}
              onQuickAddActivity={handleQuickAddActivity}
              onQuickSchedulePlace={handleQuickScheduleToDay}
              onAddDay={handleAddDay}
              onRemoveDay={handleRemoveDay}
            />
          )}

          {activeTab === "tips" && (
            <TipsAndPackingView
              trip={currentTrip}
              packingList={currentTrip?.packingChecklist || []}
              lang={lang}
              onTogglePackingItem={handleTogglePackingItem}
              onAddPackingItem={handleAddPackingItem}
              onDeletePackingItem={handleDeletePackingItem}
            />
          )}

          {activeTab === "budget" && (
            <BudgetView
              trip={currentTrip}
              places={currentTrip?.places || []}
              itinerary={currentTrip?.itinerary || []}
              lang={lang}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-5 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 tracking-wide">
                MaxVenture
              </span>
              <span>·</span>
              <span>{isHe ? "כל השינויים נשמרים אוטומטית בדפדפן שלך" : "Saved locally in your browser"}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button
                onClick={handleStartBlankTrip}
                className="hover:text-slate-800 transition-colors font-semibold cursor-pointer"
              >
                {isHe ? "✨ התחל טיול נקי מאפס" : "Start Blank Trip"}
              </button>
              <span>·</span>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="hover:text-slate-800 transition-colors cursor-pointer"
              >
                {isHe ? "ייצוא / גיבוי" : "Export / Backup"}
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <DestinationModal
        trips={trips}
        activeTripId={activeTripId}
        lang={lang}
        onSelectTrip={(id) => {
          setActiveTripId(id);
          showToast({
            type: "info",
            message: isHe ? "היעד הוחלף" : "Destination switched"
          });
        }}
        onCreateTrip={(newTrip) => {
          setTrips((prev) => [newTrip, ...prev]);
          setActiveTripId(newTrip.id);
        }}
        onDeleteTrip={(id) => {
          if (trips.length <= 1) return;
          const rem = trips.filter((t) => t.id !== id);
          setTrips(rem);
          if (activeTripId === id) setActiveTripId(rem[0].id);
        }}
        isOpen={isDestinationModalOpen}
        onClose={() => setIsDestinationModalOpen(false)}
      />

      <WeatherModal
        trip={currentTrip}
        lang={lang}
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
      />

      <CurrencyModal
        trip={currentTrip}
        lang={lang}
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
      />

      <CompanionsModal
        companions={currentTrip?.companions || []}
        onUpdateCompanions={handleUpdateCompanions}
        lang={lang}
        isOpen={isCompanionsModalOpen}
        onClose={() => setIsCompanionsModalOpen(false)}
      />

      <PlaceModal
        isOpen={isPlaceModalOpen}
        onClose={() => setIsPlaceModalOpen(false)}
        onSavePlace={handleSavePlace}
        placeToEdit={placeToEdit}
        currencySymbol={currentTrip?.currencySymbol || "€"}
        lang={lang}
      />

      <AddToItineraryModal
        place={placeToSchedule}
        trip={currentTrip}
        isOpen={!!placeToSchedule}
        lang={lang}
        onClose={() => setPlaceToSchedule(null)}
        onSchedule={(newAct) => {
          updateCurrentTrip((prev) => ({
            ...prev,
            itinerary: [...(prev.itinerary || []), newAct]
          }));
          showToast({
            type: "success",
            message: isHe
              ? `שובץ ביום ${newAct.dayNumber} בלו״ז!`
              : `Scheduled on Day ${newAct.dayNumber}!`
          });
        }}
      />

      <ItineraryModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSaveActivity={handleSaveActivity}
        activityToEdit={activityToEdit}
        trip={currentTrip}
        places={currentTrip?.places || []}
        lang={lang}
      />

      <ExportShareModal
        trip={currentTrip}
        allTrips={trips}
        lang={lang}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onImportData={(data) => {
          setTrips(data);
          if (data.length > 0) setActiveTripId(data[0].id);
        }}
        onResetDefaults={handleResetDefaults}
        onPrint={handlePrint}
        onToast={showToast}
      />

      <FirebaseSyncModal
        trip={currentTrip}
        isOpen={isSyncModalOpen}
        lang={lang}
        onClose={() => setIsSyncModalOpen(false)}
        onTripLoadedFromCloud={(loadedTrip) => {
          setTrips((prev) => {
            const exists = prev.some((t) => t.id === loadedTrip.id);
            return exists
              ? prev.map((t) => (t.id === loadedTrip.id ? loadedTrip : t))
              : [loadedTrip, ...prev];
          });
          setActiveTripId(loadedTrip.id);
        }}
        onToast={showToast}
      />

      {/* Interactive Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
