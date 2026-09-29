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

async function setAllPlacesToUnset() {
  console.log("Connecting to Firestore app_state / global_master_state...");
  const docRef = doc(db, "app_state", "global_master_state");
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    console.log("Error: Document does not exist");
    return;
  }

  const data = snap.data();
  if (!data.trips || !Array.isArray(data.trips)) {
    console.log("Error: No trips found");
    return;
  }

  let totalUpdated = 0;
  const updatedTrips = data.trips.map((trip) => {
    const updatedPlaces = (trip.places || []).map((place) => {
      totalUpdated++;
      return {
        ...place,
        status: "Unset"
      };
    });
    return {
      ...trip,
      places: updatedPlaces
    };
  });

  console.log(`Setting ${totalUpdated} places across all trips to status "Unset" (gray)...`);
  await updateDoc(docRef, {
    trips: updatedTrips,
    lastUpdatedCloud: new Date().toISOString()
  });

  console.log(`✅ Successfully updated all ${totalUpdated} places to gray ("Unset") in Firestore!`);
}

setAllPlacesToUnset().catch(console.error);
