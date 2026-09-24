import React, { useState } from "react";
import { X, ArrowRightLeft, DollarSign, Calculator, AlertCircle, Coins } from "lucide-react";

export function CurrencyModal({ trip, isOpen, onClose }) {
  if (!isOpen || !trip) return null;

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
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Coins className="w-4 h-4" /> Live Currency Widget
          </div>
          <h3 className="text-2xl font-bold">Currency & Exchange Calculator</h3>
          <p className="text-emerald-100 text-sm mt-0.5">
            Base: 1 {baseCurr} ({currSymbol}) ≈ ${rateToUSD} USD
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Two-way converter */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Trip Currency ({baseCurr})
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
                  US Dollars (USD)
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
            <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 font-medium shrink-0">Quick presets:</span>
              {[20, 50, 100, 250, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setPreset(amt)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                    parsedLocal === amt
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {currSymbol}{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Tipping Guide */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <Calculator className="w-4 h-4 text-amber-600" />
                Restaurant Tip Calculator
              </div>
              <div className="flex gap-1">
                {[5, 10, 12, 15].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setTipPercent(pct)}
                    className={`text-xs px-2 py-0.5 rounded-md font-semibold transition-colors ${
                      tipPercent === pct
                        ? "bg-amber-600 text-white"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <div className="text-xs text-slate-500">Tip ({tipPercent}%)</div>
                <div className="text-base font-bold text-slate-800">{currSymbol}{tipAmount}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <div className="text-xs text-slate-500">Total with Tip</div>
                <div className="text-base font-bold text-emerald-700">{currSymbol}{totalWithTip}</div>
              </div>
            </div>
          </div>

          {/* Golden Rule Tip */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Rule of Thumb:</strong> When paying with a credit card at European or international terminals, always select <span className="underline font-bold text-slate-900">Local Currency ({baseCurr})</span> rather than USD/Home currency to avoid the 7–14% hidden markup bank conversion fees!
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
