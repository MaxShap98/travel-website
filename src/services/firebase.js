import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

const STORAGE_KEY_FIREBASE_CONFIG = "travel_planner_firebase_config_v1";

// MaxVenture Firebase Project default config
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCP4SPJ742fV3TkYv89Pt4uCinI9yfvYuU",
  authDomain: "maxventure-6e3dd.firebaseapp.com",
  projectId: "maxventure-6e3dd",
  storageBucket: "maxventure-6e3dd.firebasestorage.app",
  messagingSenderId: "66276104083",
  appId: "1:66276104083:web:28c940e925f9bec7a9ba66",
  measurementId: "G-BHBTE83J9H"
};

let dbInstance = null;
let currentApp = null;

// Read config from localStorage, Vite env, or embedded default
export function getFirebaseConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {}

  // Check Vite environment variables as fallback
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
  }

  // Use MaxVenture project config as default
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(config));
    // Re-initialize
    return initFirebase(config);
  } catch (e) {
    console.error("Failed to save Firebase config", e);
    return false;
  }
}

export function removeFirebaseConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY_FIREBASE_CONFIG);
    dbInstance = null;
    currentApp = null;
    return true;
  } catch (e) {
    return false;
  }
}

export function initFirebase(config = null) {
  const conf = config || getFirebaseConfig();
  if (!conf || !conf.apiKey || !conf.projectId) {
    return false;
  }

  try {
    if (getApps().length > 0) {
      currentApp = getApp();
    } else {
      currentApp = initializeApp(conf);
    }
    dbInstance = getFirestore(currentApp);
    return true;
  } catch (e) {
    console.error("Firebase initialization failed:", e);
    return false;
  }
}

export function isFirebaseReady() {
  if (dbInstance) return true;
  return initFirebase();
}

/**
 * Save / Update a trip in Firestore cloud
 */
export async function syncTripToCloud(trip) {
  if (!isFirebaseReady() || !dbInstance || !trip || !trip.id) {
    return false;
  }

  try {
    // Sanitize trip object for Firestore (strip undefined fields)
    const sanitized = JSON.parse(JSON.stringify(trip));
    sanitized.lastUpdatedCloud = new Date().toISOString();

    const tripRef = doc(dbInstance, "trips", trip.id);
    await setDoc(tripRef, sanitized, { merge: true });
    return true;
  } catch (err) {
    console.error("Error saving trip to cloud:", err);
    throw err;
  }
}

/**
 * Real-time listener: calls onUpdate whenever someone updates the trip on PC or phone
 */
export function subscribeToCloudTrip(tripId, onUpdate, onError) {
  if (!isFirebaseReady() || !dbInstance || !tripId) {
    return null;
  }

  try {
    const tripRef = doc(dbInstance, "trips", tripId);
    const unsubscribe = onSnapshot(
      tripRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          onUpdate(data);
        }
      },
      (err) => {
        console.error("Cloud sync snapshot error:", err);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error("Failed to subscribe to cloud trip:", err);
    return null;
  }
}

const GLOBAL_STATE_DOC = "global_master_state";

/**
 * Save entire global planner state (all trips and active ID) to Firestore
 * This ensures that EVERY visitor sees the exact same trips in real-time!
 */
export async function syncGlobalStateToCloud(trips, activeTripId) {
  if (!isFirebaseReady() || !dbInstance || !trips || trips.length === 0) {
    return false;
  }

  try {
    const sanitizedTrips = JSON.parse(JSON.stringify(trips));
    const payload = {
      trips: sanitizedTrips,
      activeTripId: activeTripId || (trips[0] ? trips[0].id : "my-trip"),
      lastUpdatedCloud: new Date().toISOString()
    };

    const globalRef = doc(dbInstance, "app_state", GLOBAL_STATE_DOC);
    await setDoc(globalRef, payload, { merge: true });
    return true;
  } catch (err) {
    console.error("Error saving global state to cloud:", err);
    return false;
  }
}

/**
 * Real-time listener for the shared global planner state
 * Anyone browsing the site connects to this live snapshot automatically!
 */
export function subscribeToGlobalState(onUpdate, onError) {
  if (!isFirebaseReady() || !dbInstance) {
    return null;
  }

  try {
    const globalRef = doc(dbInstance, "app_state", GLOBAL_STATE_DOC);
    const unsubscribe = onSnapshot(
      globalRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          onUpdate(data);
        } else {
          // Document does not exist yet (first-time initialization)
          onUpdate(null);
        }
      },
      (err) => {
        console.error("Global cloud sync snapshot error:", err);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error("Failed to subscribe to global cloud state:", err);
    return null;
  }
}

/**
 * One-time fetch of a trip by code/id
 */
export async function fetchCloudTrip(tripId) {
  if (!isFirebaseReady() || !dbInstance || !tripId) {
    return null;
  }

  try {
    const tripRef = doc(dbInstance, "trips", tripId);
    const docSnap = await getDoc(tripRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error("Error fetching trip from cloud:", err);
    throw err;
  }
}
