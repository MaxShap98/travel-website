import React, { useState } from "react";
import { X, ArrowRightLeft, DollarSign, Calculator, AlertCircle, Coins } from "lucide-react";

export function CurrencyModal({ trip, isOpen, onClose, lang = "he" }) {
  if (!isOpen || !trip) return null;

  const isHe = lang === "he";
  const baseCurr = trip.baseCurrency || "EUR";
  const currSymbol = trip.currencySymbol || "€";
  const rateToUSD = trip.exchangeRateToUSD || 1.09;

  const [localAmount, setLocalAmount] = useState("100");
  const [foreignAmount, setForeignAmount] = useState((100 * rateToUSD).toFixed(2));
  const [tipPercent, setTipPercent] = useState(10);

  const handleLocalChange = (val) => {
    setLocalAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setForeignAmount((num * rateToUSD).toFixed(2));
    } else {
      setForeignAmount("");
    }
  };

  const handleForeignChange = (val) => {
    setForeignAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && rateToUSD > 0) {
      setLocalAmount((num / rateToUSD).toFixed(2));
    } else {
      setLocalAmount("");
    }
  };

  const setPreset = (amt) => {
    handleLocalChange(amt.toString());
  };

  const parsedLocal = parseFloat(localAmount) || 0;
  const tipAmount = (parsedLocal * (tipPercent / 100)).toFixed(2);
  const totalWithTip = (parsedLocal + parseFloat(tipAmount)).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in no-print">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden"
        dir={isHe ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Coins className="w-4 h-4" /> {isHe ? "מחשבון המרת מטבע חי" : "Live Currency Widget"}
          </div>
          <h3 className="text-2xl font-bold">
            {isHe ? "מחשבון המרת מטבע וטיפים" : "Currency & Exchange Calculator"}
          </h3>
          <p className="text-emerald-100 text-sm mt-0.5">
            {isHe ? `שער יציג: 1 ${baseCurr} (${currSymbol}) ≈ $${rateToUSD} USD` : `Base: 1 ${baseCurr} (${currSymbol}) ≈ $${rateToUSD} USD`}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Two-way converter */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {isHe ? `מטבע הטיול (${baseCurr})` : `Trip Currency (${baseCurr})`}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">{currSymbol}</span>
                  <input
                    type="number"
                    value={localAmount}
                    onChange={(e) => handleLocalChange(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {isHe ? "דולר ארה״ב (USD)" : "US Dollars (USD)"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={foreignAmount}
                    onChange={(e) => handleForeignChange(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-2 overflow-x-auto">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                {isHe ? "סכומים מהירים:" : "Quick amounts:"}
              </span>
              {[20, 50, 100, 250, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setPreset(amt)}
                  className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                >
                  {currSymbol}{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Tip Calculator */}
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <h4 className="text-sm font-bold text-emerald-950">
                  {isHe ? "מחשבון טיפ למסעדות ושירות" : "Dining Tip Calculator"}
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                {[5, 10, 12, 15].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setTipPercent(pct)}
                    className={`px-2 py-0.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                      tipPercent === pct
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-white text-emerald-800 hover:bg-emerald-100"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                <div className="text-[11px] text-slate-400">{isHe ? "חשבון מקורי" : "Subtotal"}</div>
                <div className="text-sm font-bold text-slate-700">
                  {currSymbol}{parsedLocal.toFixed(2)}
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                <div className="text-[11px] text-emerald-600 font-medium">
                  {isHe ? `טיפ (${tipPercent}%)` : `Tip (${tipPercent}%)`}
                </div>
                <div className="text-sm font-bold text-emerald-700">
                  +{currSymbol}{tipAmount}
                </div>
              </div>
              <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-xs">
                <div className="text-[11px] text-emerald-100 font-semibold">{isHe ? "סה״כ לתשלום" : "Total Bill"}</div>
                <div className="text-base font-extrabold">
                  {currSymbol}{totalWithTip}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isHe ? "סגור" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
