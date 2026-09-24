import React, { useRef } from "react";
import {
  X,
  Download,
  Upload,
  Printer,
  RotateCcw,
  Share2,
  Copy,
  Link,
  Check,
  FileJson,
  Sparkles
} from "lucide-react";

export function ExportShareModal({
  trip,
  allTrips,
  isOpen,
  lang = "he",
  onClose,
  onImportData,
  onResetDefaults,
  onPrint,
  onToast
}) {
  const fileInputRef = useRef(null);
  const isHe = lang === "he";

  if (!isOpen || !trip) return null;

  // 1. Magic Share Link (encodes full trip into URL hash so friend opens it instantly)
  const handleShareMagicLink = () => {
    try {
      const jsonStr = JSON.stringify(trip);
      const b64 = btoa(
        encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        })
      );
      const shareUrl = `${window.location.origin}${window.location.pathname}#plan=${b64}`;
      navigator.clipboard.writeText(shareUrl);
      onToast({
        type: "success",
        message: isHe
          ? "🔗 קישור ישיר לטיול הועתק ללוח! שלח לחבר והטיול ייטען אצלו מיד."
          : "🔗 Direct trip link copied! Send to a friend to view your plan."
      });
    } catch (e) {
      console.error("Error creating share link", e);
    }
  };

  // 2. Export JSON
  const handleDownloadJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    const sanitizedTitle = trip.destination.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    downloadAnchor.setAttribute("download", `${sanitizedTitle}_travel_plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onToast({
      type: "success",
      message: isHe ? "קובץ הטיול הורד בהצלחה!" : "Trip downloaded as JSON file!"
    });
  };

  // 3. Import JSON
  const handleFileUpload = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onImportData(parsed);
          } else if (parsed && parsed.destination) {
            onImportData([parsed]);
          } else {
            alert(isHe ? "קובץ לא תקין" : "Invalid file");
            return;
          }
          onToast({
            type: "success",
            message: isHe ? "הטיול יובא בהצלחה!" : "Trip imported successfully!"
          });
          onClose();
        } catch (err) {
          alert(isHe ? "שגיאה בקריאת הקובץ" : "Error parsing file");
        }
      };
    }
  };

  // 4. Copy Summary Text (for WhatsApp / SMS)
  const handleCopySummary = () => {
    const summary = `✈️ תוכנית טיול: ${trip.destination}
📅 תאריכים: ${trip.dateRange} (${trip.durationDays} ימים)
👥 מטיילים: ${trip.companions?.map((c) => c.name).join(", ")}

📍 מקומות בולטים:
${trip.places
  ?.slice(0, 8)
  .map((p) => `• [${p.category}] ${p.name} (${p.location || ""}) ${p.notes ? `- ${p.notes}` : ""}`)
  .join("\n")}

🗓️ לו״ז מתוכנן:
${trip.itinerary
  ?.map((i) => `• ${i.dayLabel} (${i.period}): ${i.activity} ${i.time ? `@ ${i.time}` : ""}`)
  .join("\n")}
`;

    navigator.clipboard.writeText(summary);
    onToast({
      type: "success",
      message: isHe ? "סיכום הטיול הועתק להדבקה בוואטסאפ!" : "Summary copied for WhatsApp!"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Share2 className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isHe ? "שיתוף הטיול וגיבוי" : "Share Trip & Backup"}
              </h3>
              <p className="text-sky-200 text-xs">
                {isHe ? "שלח לחברים קישור ישיר, סיכום לוואטסאפ או קובץ גיבוי" : "Send link to friends or export file"}
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

        {/* Content Options */}
        <div className="p-5 space-y-3.5 text-xs">
          {/* 🌟 1. Magic Share Link Option (Prominent!) */}
          <div className="p-4 bg-gradient-to-r from-sky-50 to-emerald-50 rounded-2xl border-2 border-sky-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-600 text-white rounded-xl shadow-xs">
                <Link className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {isHe ? "העתק קישור ישיר לחבר (מומלץ!)" : "Copy Direct Share Link"}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isHe
                    ? "יוצר קישור המכיל את כל המקומות והלו״ז שהרכבת. כשהחבר פותח, הכל מופיע אצלו מיד!"
                    : "Encodes all your places and schedule into a link. Opens directly on their phone!"}
                </p>
              </div>
            </div>
            <button
              onClick={handleShareMagicLink}
              className="px-3.5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl shadow-md transition-colors cursor-pointer shrink-0"
            >
              {isHe ? "העתק קישור" : "Copy Link"}
            </button>
          </div>

          {/* 2. Copy WhatsApp Text Summary */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-lg">
                <Copy className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">
                  {isHe ? "העתק סיכום לוואטסאפ" : "Copy WhatsApp Summary"}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isHe ? "טקסט מעוצב ונוח לקריאה לשליחה בקבוצה" : "Clean formatted text to send in chat"}
                </p>
              </div>
            </div>
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
            >
              {isHe ? "העתק טקסט" : "Copy Text"}
            </button>
          </div>

          {/* 3. Printable / PDF View */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-800 text-white rounded-lg">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">
                  {isHe ? "הדפסה / שמירה כ-PDF" : "Print / PDF Voucher"}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isHe ? "דף מסודר להדפסה עם הלו״ז והמלונות" : "Print-friendly itinerary document"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                setTimeout(() => onPrint(), 200);
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
            >
              {isHe ? "פתח PDF" : "Open PDF"}
            </button>
          </div>

          {/* 4. Download / Import JSON */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">
                  {isHe ? "קובץ גיבוי (JSON)" : "Backup File (JSON)"}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isHe ? "הורד קובץ למחשב או ייבא קובץ של חבר" : "Export or import local backup file"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDownloadJSON}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
              >
                {isHe ? "הורד" : "Export"}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors cursor-pointer"
              >
                {isHe ? "ייבא" : "Import"}
              </button>
            </div>
          </div>

          {/* Reset Defaults */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    isHe
                      ? "האם לשחזר את טיולי הדוגמה המובנים (יוון, יפן, איטליה)?"
                      : "Reset to sample trips?"
                  )
                ) {
                  onResetDefaults();
                  onClose();
                }
              }}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {isHe ? "שחזר טיולי דוגמה" : "Restore sample trips"}
            </button>
            <span>{isHe ? "נשמר אוטומטית בדפדפן" : "Saved in browser"}</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isHe ? "סגור" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
