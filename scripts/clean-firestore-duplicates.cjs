const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, updateDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCP4SPJ742fV3TkYv89Pt4uCinI9yfvYuU",
  authDomain: "maxventure-6e3dd.firebaseapp.com",
  projectId: "maxventure-6e3dd",
  storageBucket: "maxventure-6e3dd.firebasestorage.app",
  messagingSenderId: "66276104083",
  appId: "1:66276104083:web:28c940e925f9bec7a9ba66"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function deduplicateItinerary(itineraryList) {
  if (!Array.isArray(itineraryList)) return [];
  const seen = new Set();
  return itineraryList.filter((item) => {
    const placeKey = item.linkedPlaceId
      ? `place_${item.linkedPlaceId}`
      : `act_${(item.activity || "").trim().toLowerCase()}`;
    const uniqueKey = `${placeKey}_day_${item.dayNumber}`;
    if (seen.has(uniqueKey)) {
      return false;
    }
    seen.add(uniqueKey);
    return true;
  });
}

async function cleanDuplicates() {
  console.log("Checking Firestore shared_state for duplicate itinerary items...");
  const docRef = doc(db, "travel_planner_v2", "shared_state");
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    console.log("Document does not exist");
    return;
  }

  const data = snap.data();
  if (!data.trips || !Array.isArray(data.trips)) {
    console.log("No trips in document");
    return;
  }

  let totalRemoved = 0;
  const updatedTrips = data.trips.map((trip) => {
    const originalCount = trip.itinerary ? trip.itinerary.length : 0;
    const cleanItinerary = deduplicateItinerary(trip.itinerary || []);
    const removed = originalCount - cleanItinerary.length;
    if (removed > 0) {
      console.log(`Trip "${trip.destination}": removed ${removed} duplicate activities.`);
      totalRemoved += removed;
    }
    return {
      ...trip,
      itinerary: cleanItinerary
    };
  });

  if (totalRemoved > 0) {
    await updateDoc(docRef, {
      trips: updatedTrips,
      lastUpdatedCloud: new Date().toISOString()
    });
    console.log(`Successfully updated Firestore! Removed ${totalRemoved} duplicates in total.`);
  } else {
    console.log("No duplicates found in Firestore.");
  }
}

cleanDuplicates().catch(console.error);
