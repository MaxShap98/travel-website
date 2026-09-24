import React, { useState } from "react";
import {
  X,
  Cloud,
  Check,
  RefreshCw,
  Smartphone,
  Laptop,
  ArrowUpCircle,
  ArrowDownCircle,
  ShieldCheck,
  Sparkles,
  Info
} from "lucide-react";
import { DEFAULT_FIREBASE_CONFIG, isFirebaseReady } from "../services/firebase";

export function FirebaseSyncModal({
  trip,
  allTrips = [],
  isOpen,
  lang = "he",
  onClose,
  onForcePush,
  onForcePull,
  onToast
}) {
  const isHe = lang === "he";
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [activeTab, setActiveTab] = useState("status"); // 'status' | 'info'

  if (!isOpen) return null;

  const isReady = isFirebaseReady();
  const placesCount = (trip?.places || []).length;
  const totalTripsCount = allTrips.length || 1;

  const handlePush = async () => {
    setIsPushing(true);
    try {
      if (onForcePush) {
        await onForcePush();
      }
    } finally {
      setIsPushing(false);
    }
  };

  const handlePull = async () => {
    setIsPulling(true);
    try {
      if (onForcePull) {
        await onForcePull();
      }
    } finally {
      setIsPulling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh]"
        dir={isHe ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-2xl backdrop-blur-xs">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isHe ? "סנכרון ענן אוטומטי בזמן אמת" : "Real-Time Cloud Sync"}
              </h2>
              <p className="text-xs text-sky-100 font-medium">
                Firebase Firestore · MaxVenture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div className="px-6 py-3.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-900">
              {isHe ? "ענן פעיל ומחובר (MaxVenture)" : "Live Cloud Active (MaxVenture)"}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
            {DEFAULT_FIREBASE_CONFIG.projectId}
          </span>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Explanation Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-start gap-2.5 text-slate-800 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                {isHe
                  ? "איך הסנכרון עובד בין המחשב לטלפון?"
                  : "How does cross-device sync work?"}
              </span>
            </div>
            <p className="leading-relaxed">
              {isHe
                ? "כל שינוי שאתה מבצע (הוספת מקום, עריכת לו״ז, סימון וי) נשלח ישירות לענן. כל מכשיר שגולש באתר מאזין אוטומטית ומתעדכן בלייב."
                : "Every update (adding a place, editing schedule, checkmarks) syncs automatically to the cloud. All devices receive updates live."}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {isHe ? "פעולות סנכרון ידניות" : "Manual Sync Actions"}
            </label>

            {/* Force Push Button */}
            <button
              onClick={handlePush}
              disabled={isPushing}
              className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {isPushing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isHe ? "מעלה נתונים לענן..." : "Syncing to cloud..."}</span>
                </>
              ) : (
                <>
                  <ArrowUpCircle className="w-5 h-5" />
                  <span>
                    {isHe
                      ? "סנכרן את המקומות של המחשב לענן עכשיו ⬆️"
                      : "Push Computer Data to Cloud Now ⬆️"}
                  </span>
                </>
              )}
            </button>

            {/* Force Pull Button */}
            <button
              onClick={handlePull}
              disabled={isPulling}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs border border-slate-300/80"
            >
              {isPulling ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
                  <span>{isHe ? "מושך מהענן..." : "Pulling from cloud..."}</span>
                </>
              ) : (
                <>
                  <ArrowDownCircle className="w-4 h-4 text-sky-600" />
                  <span>
                    {isHe
                      ? "משוך את הגרסה העדכנית ביותר מהענן ⬇️"
                      : "Pull Latest from Cloud ⬇️"}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Device Sync Visual Guide */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3 text-center">
              <div className="w-8 h-8 mx-auto bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-1.5">
                <Laptop className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                {isHe ? "מחשב" : "Computer"}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {trip?.destination} ({placesCount} {isHe ? "מקומות" : "places"})
              </div>
            </div>

            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 text-center">
              <div className="w-8 h-8 mx-auto bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-1.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                {isHe ? "טלפון נייד" : "Mobile Phone"}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {isHe ? "סנכרון חי אוטומטי" : "Live Auto-Sync"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200/80 p-4 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHe ? "מאובטח ב-Google Firebase" : "Secured by Google Firebase"}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {isHe ? "סגור" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
