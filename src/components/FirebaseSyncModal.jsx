import React, { useState, useEffect } from "react";
import {
  X,
  Cloud,
  CloudCheck,
  CloudOff,
  RefreshCw,
  Copy,
  Check,
  Key,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Share2,
  Trash2
} from "lucide-react";
import {
  getFirebaseConfig,
  saveFirebaseConfig,
  removeFirebaseConfig,
  isFirebaseReady,
  syncTripToCloud,
  fetchCloudTrip
} from "../services/firebase";

export function FirebaseSyncModal({
  trip,
  isOpen,
  lang = "he",
  onClose,
  onTripLoadedFromCloud,
  onToast
}) {
  const isHe = lang === "he";
  const [activeTab, setActiveTab] = useState("share"); // 'share' | 'settings' | 'join'
  const [isConfigured, setIsConfigured] = useState(false);
  const [configInput, setConfigInput] = useState("");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsConfigured(isFirebaseReady());
      const currentConf = getFirebaseConfig();
      if (currentConf) {
        setConfigInput(JSON.stringify(currentConf, null, 2));
      } else {
        setConfigInput("");
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Clean room code for sharing
  const roomCode = trip?.id || "my-trip";
  const shareLiveUrl = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(
    roomCode
  )}`;

  // Parse config input (whether user pastes raw JS or JSON)
  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!configInput.trim()) return;

    try {
      let parsed = null;
      // If user pasted raw JavaScript like: const firebaseConfig = { apiKey: "..." }
      if (configInput.includes("apiKey")) {
        // Try parsing JSON first
        try {
          parsed = JSON.parse(configInput);
        } catch (jsonErr) {
          // Extract fields using regex
          const apiKeyMatch = configInput.match(/apiKey:\s*["']([^"']+)["']/);
          const authDomainMatch = configInput.match(/authDomain:\s*["']([^"']+)["']/);
          const projectIdMatch = configInput.match(/projectId:\s*["']([^"']+)["']/);
          const storageBucketMatch = configInput.match(/storageBucket:\s*["']([^"']+)["']/);
          const appIdMatch = configInput.match(/appId:\s*["']([^"']+)["']/);

          if (apiKeyMatch && projectIdMatch) {
            parsed = {
              apiKey: apiKeyMatch[1],
              authDomain: authDomainMatch ? authDomainMatch[1] : undefined,
              projectId: projectIdMatch[1],
              storageBucket: storageBucketMatch ? storageBucketMatch[1] : undefined,
              appId: appIdMatch ? appIdMatch[1] : undefined
            };
          }
        }
      }

      if (parsed && parsed.apiKey && parsed.projectId) {
        saveFirebaseConfig(parsed);
        setIsConfigured(true);
        setActiveTab("share");
        onToast({
          type: "success",
          message: isHe
            ? "Firebase הוגדר בהצלחה! סנכרון הענן פעיל."
            : "Firebase configured successfully! Cloud sync active."
        });

        // Trigger initial upload of current trip
        syncTripToCloud(trip);
      } else {
        alert(
          isHe
            ? "לא הצלחנו לזהות את פרטי ההגדרה. ודא שהעתקת את ה-firebaseConfig המלא (הכולל apiKey ו-projectId)."
            : "Could not parse Firebase config. Please ensure apiKey and projectId are present."
        );
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Remove config
  const handleRemoveConfig = () => {
    if (
      window.confirm(
        isHe
          ? "האם להסיר את הגדרות הענן ולחזור לשמירה מקומית בלבד?"
          : "Disconnect Firebase and return to local storage only?"
      )
    ) {
      removeFirebaseConfig();
      setIsConfigured(false);
      setConfigInput("");
      onToast({
        type: "info",
        message: isHe ? "התנתקת מ-Firebase." : "Disconnected from Firebase."
      });
    }
  };

  // Manual Push to Cloud
  const handleManualSyncNow = async () => {
    setIsSyncing(true);
    try {
      await syncTripToCloud(trip);
      onToast({
        type: "success",
        message: isHe ? "הטיול סונכרן לענן בהצלחה!" : "Trip synced to cloud!"
      });
    } catch (e) {
      onToast({
        type: "error",
        message: isHe ? "שגיאה בסנכרון לענן. בדוק את ההגדרות." : "Sync error. Check config."
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Join Existing Trip Room by Code
  const handleJoinByCode = async (e) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    setIsSyncing(true);
    try {
      const code = joinCodeInput.trim();
      const loaded = await fetchCloudTrip(code);
      if (loaded && loaded.destination) {
        onTripLoadedFromCloud(loaded);
        onToast({
          type: "success",
          message: isHe
            ? `התחברת לטיול: ${loaded.destination}!`
            : `Joined trip: ${loaded.destination}!`
        });
        onClose();
      } else {
        alert(
          isHe
            ? `לא נמצא טיול בענן עם הקוד "${code}". ודא שהקוד הועלה מהמכשיר השני.`
            : `No trip found in cloud with code "${code}".`
        );
      }
    } catch (err) {
      alert("Error joining room: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLiveUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    onToast({
      type: "success",
      message: isHe ? "קישור הסנכרון הועתק! פתח אותו בטלפון." : "Live sync link copied!"
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    onToast({
      type: "success",
      message: isHe ? "קוד החדר הועתק!" : "Room code copied!"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Cloud className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">
                  {isHe ? "סנכרון ענן בזמן אמת (Firebase)" : "Real-time Cloud Sync (Firebase)"}
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isConfigured ? "bg-emerald-400 text-slate-900" : "bg-black/30 text-white"
                  }`}
                >
                  {isConfigured
                    ? isHe
                      ? "● מחובר לייב"
                      : "● Live Connected"
                    : isHe
                    ? "○ לא מוגדר"
                    : "○ Not Configured"}
                </span>
              </div>
              <p className="text-amber-100 text-xs">
                {isHe
                  ? "סנכרן את התכנון בין המחשב לטלפון בזמן אמת"
                  : "Sync your trip between computer and phone in real-time"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold px-4 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab("share")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "share"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isHe ? "סנכרון לטלפון ולחברים" : "Sync to Phone"}</span>
          </button>

          <button
            onClick={() => setActiveTab("join")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "join"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isHe ? "הצטרף לטיול קיים" : "Join by Code"}</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "settings"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{isHe ? "הגדרת מסד נתונים חינמי" : "Firebase Setup"}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* TAB 1: SYNC & SHARE TO PHONE */}
          {activeTab === "share" && (
            <div className="space-y-4">
              {isConfigured ? (
                <>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>{isHe ? "הענן פעיל ומסנכרן!" : "Cloud Sync is Active!"}</span>
                      </div>
                      <button
                        onClick={handleManualSyncNow}
                        disabled={isSyncing}
                        className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                        <span>{isHe ? "סנכרן כעת" : "Sync Now"}</span>
                      </button>
                    </div>

                    <p className="text-emerald-900 text-xs leading-relaxed">
                      {isHe
                        ? "כל שינוי שאתה מבצע במחשב נשמר בענן ומסתנכרן ישירות לכל מכשיר שמחובר לטיול הזה."
                        : "Any changes you make are pushed to Firestore and sync across all devices."}
                    </p>
                  </div>

                  {/* Room Link Box */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      {isHe ? "קישור לסנכרון חי בטלפון ובחברים:" : "Live Sync Link:"}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={shareLiveUrl}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 select-all"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isHe ? "העתק קישור" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isHe
                        ? "שלח את הקישור הזה לעצמך בוואטסאפ ופתח אותו בנייד – שני המכשירים יסונכרנו אוטומטית!"
                        : "Open this link on your mobile phone to connect instantly!"}
                    </p>
                  </div>

                  {/* Room Code Box */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        {isHe ? "קוד הטיול (Room Code):" : "Trip Room Code:"}
                      </span>
                      <span className="text-sm font-mono font-extrabold text-slate-800">
                        {roomCode}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isHe ? "העתק קוד" : "Copy Code"}</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Firebase Not Configured Yet */
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <CloudOff className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {isHe ? "סנכרון הענן עדיין לא מוגדר" : "Cloud Sync is not yet set up"}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {isHe
                      ? "כדי שמה שאתה מקליד במחשב יופיע מיד בטלפון, צריך לחבר פרויקט Firebase חינמי של גוגל (לוקח 2 דקות בלבד)."
                      : "Connect a free Firebase project (takes 2 minutes) to get real-time cross-device sync."}
                  </p>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    {isHe ? "לחץ כאן להגדרה פשוטה ב-2 דקות ⚙️" : "Setup Free Firebase in 2 Min ⚙️"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: JOIN EXISTING TRIP BY CODE */}
          {activeTab === "join" && (
            <form onSubmit={handleJoinByCode} className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {isHe ? "הכנס קוד טיול מטלפון או מחשב אחר:" : "Enter Trip Code from another device:"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. my-trip-1234 or rome-2026"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  {isHe
                    ? "המכשיר יטען את הטיול מהענן ויישאר מחובר אליו בזמן אמת."
                    : "This device will fetch the trip from Firestore and subscribe to real-time changes."}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isHe ? "התחבר לטיול" : "Connect & Load"}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FIREBASE SETUP GUIDE & CONFIG INPUT */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              {/* Step-by-Step Instructions */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-amber-900 text-xs">
                    {isHe ? "איך יוצרים Firebase חינמי ב-3 צעדים:" : "How to create free Firebase:"}
                  </h4>
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 underline text-[11px]"
                  >
                    <span>{isHe ? "פתח את Firebase Console" : "Open Console"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <ol className="list-decimal list-inside space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
                  <li>
                    {isHe
                      ? "היכנס עם חשבון גוגל ולחץ על Add project (תן לו שם, למשל: my-travel-planner)."
                      : "Click 'Add project' and give it any name."}
                  </li>
                  <li>
                    {isHe
                      ? "בתפריט בצד לחץ על Build -> Firestore Database -> Create database -> בחר Start in test mode (לסנכרון חופשי ללא חסימות)."
                      : "Under Build, click 'Firestore Database' -> Create Database -> Start in test mode."}
                  </li>
                  <li>
                    {isHe
                      ? "לחץ על גלגל השיניים (Project Settings) למעלה -> לחץ על סמל </> (Web) -> העתק את ה-firebaseConfig והדבק אותו למטה!"
                      : "Go to Project Settings (gear icon) -> Add Web App (</>) -> copy firebaseConfig and paste below!"}
                  </li>
                </ol>
              </div>

              {/* Paste Config Form */}
              <form onSubmit={handleSaveConfig} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHe
                      ? "הדבק כאן את ה-firebaseConfig (אפשר להדביק את כל הקוד כמו שהוא מגוגל):"
                      : "Paste firebaseConfig object here:"}
                  </label>
                  <textarea
                    rows="6"
                    required
                    value={configInput}
                    onChange={(e) => setConfigInput(e.target.value)}
                    placeholder={`const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "my-trip.firebaseapp.com",
  projectId: "my-trip-project",
  ...
};`}
                    className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {isConfigured ? (
                    <button
                      type="button"
                      onClick={handleRemoveConfig}
                      className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isHe ? "הסר חיבור ענן" : "Disconnect"}</span>
                    </button>
                  ) : (
                    <span />
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    {isHe ? "שמור והפעל סנכרון ענן" : "Save & Enable Sync"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {isHe
              ? "מסלול Spark של Firebase הינו חינמי לחלוטין וללא חיוב."
              : "Firebase Spark Plan is 100% free with generous quotas."}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isHe ? "סגור" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
