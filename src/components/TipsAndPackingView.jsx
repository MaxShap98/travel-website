import React, { useState } from "react";
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  PhoneCall,
  Bus,
  Coins,
  ShieldAlert,
  Sparkles,
  Info,
  CheckCircle2
} from "lucide-react";

export function TipsAndPackingView({
  trip,
  packingList = [],
  onTogglePackingItem,
  onAddPackingItem,
  onDeletePackingItem
}) {
  const [newItemText, setNewItemText] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Clothing");

  const categories = ["Documents", "Clothing", "Beach Gear", "Tech & Gadgets", "Health & Toiletries"];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem = {
      id: "pk-" + Date.now(),
      category: newItemCategory,
      item: newItemText.trim(),
      completed: false
    };

    onAddPackingItem(newItem);
    setNewItemText("");
  };

  const completedCount = packingList.filter((item) => item.completed).length;
  const totalCount = packingList.length;
  const packedPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group by category
  const groupedPacking = packingList.reduce((acc, it) => {
    const cat = it.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(it);
    return acc;
  }, {});

  const tips = trip.tips || {
    emergencyContacts: [],
    transitInfo: [],
    currencyAdvice: []
  };

  return (
    <div className="space-y-8">
      {/* Top Section: Packing Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-300 text-xs font-bold uppercase tracking-wider mb-1">
              <CheckSquare className="w-4 h-4" /> Trip Essentials
            </div>
            <h3 className="text-xl font-bold">Interactive Packing Checklist</h3>
            <p className="text-sky-200 text-xs mt-0.5">
              Keep your luggage dialed in and avoid airport surprises
            </p>
          </div>

          {/* Progress bar */}
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 min-w-[200px]">
            <div className="flex justify-between text-xs font-bold text-white mb-1">
              <span>Packed Status</span>
              <span className="text-emerald-300">
                {completedCount}/{totalCount} ({packedPercent}%)
              </span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${packedPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add item inline form */}
        <form onSubmit={handleAdd} className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 text-xs">
          <input
            type="text"
            required
            placeholder="Add new item (e.g. Snorkeling mask, Power adapter...)"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="flex-1 min-w-[220px] px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </form>

        {/* Categories Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedPacking).map(([cat, items]) => (
            <div key={cat} className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center justify-between">
                <span>{cat}</span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {items.filter((i) => i.completed).length}/{items.length}
                </span>
              </h4>

              <div className="space-y-1.5">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all text-xs group ${
                      it.completed
                        ? "bg-slate-50 border-slate-200 text-slate-400"
                        : "bg-white border-slate-200/70 text-slate-700 hover:border-sky-300"
                    }`}
                  >
                    <button
                      onClick={() => onTogglePackingItem(it.id)}
                      className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
                    >
                      {it.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 group-hover:text-sky-500 shrink-0" />
                      )}
                      <span className={it.completed ? "line-through text-slate-400" : "font-medium"}>
                        {it.item}
                      </span>
                    </button>

                    <button
                      onClick={() => onDeletePackingItem(it.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-600 transition-opacity cursor-pointer"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destination Guides & Emergency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl border border-rose-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center gap-2 text-rose-900">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h4 className="font-bold text-sm">Emergency & Medical</h4>
          </div>
          <div className="p-4 divide-y divide-slate-100 space-y-2 text-xs">
            {tips.emergencyContacts?.map((c, idx) => (
              <div key={idx} className="pt-2 first:pt-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{c.name}</span>
                  <a
                    href={`tel:${c.number.replace(/\s+/g, "")}`}
                    className="font-extrabold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    {c.number}
                  </a>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Local Transit Info */}
        <div className="bg-white rounded-2xl border border-sky-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-sky-50 border-b border-sky-100 flex items-center gap-2 text-sky-900">
            <Bus className="w-4 h-4 text-sky-600" />
            <h4 className="font-bold text-sm">Local Transit & Logistics</h4>
          </div>
          <div className="p-4 space-y-3 text-xs">
            {tips.transitInfo?.map((t, idx) => (
              <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="font-bold text-slate-800 mb-0.5">{t.title}</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Currency & Tipping Advice */}
        <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-emerald-900">
            <Coins className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-sm">Money, ATMs & Tipping</h4>
          </div>
          <div className="p-4 space-y-3 text-xs">
            {tips.currencyAdvice?.map((ca, idx) => (
              <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="font-bold text-slate-800 mb-0.5">{ca.title}</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">{ca.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
