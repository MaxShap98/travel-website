import React, { useState } from "react";
import { X, UserPlus, Trash2, Shield, Users } from "lucide-react";

export function CompanionsModal({ companions, onUpdateCompanions, isOpen, onClose }) {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [role, setRole] = useState("Travel Companion");
  const [color, setColor] = useState("bg-blue-600");

  const colors = [
    { label: "Blue", class: "bg-blue-600" },
    { label: "Emerald", class: "bg-emerald-600" },
    { label: "Amber", class: "bg-amber-600" },
    { label: "Indigo", class: "bg-indigo-600" },
    { label: "Rose", class: "bg-rose-600" },
    { label: "Purple", class: "bg-purple-600" }
  ];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initials = name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newCompanion = {
      id: "c-" + Date.now(),
      name: name.trim(),
      role: role.trim() || "Traveler",
      avatar: initials || "TR",
      color
    };

    onUpdateCompanions([...companions, newCompanion]);
    setName("");
    setRole("Travel Companion");
  };

  const handleRemove = (id) => {
    if (companions.length <= 1) {
      alert("At least one companion/traveler should remain.");
      return;
    }
    onUpdateCompanions(companions.filter((c) => c.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Users className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Travel Companions</h3>
              <p className="text-blue-100 text-xs">{companions.length} members on this journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
          <div className="space-y-2.5">
            {companions.map((comp) => (
              <div
                key={comp.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${comp.color || "bg-blue-600"} text-white font-bold text-xs flex items-center justify-center shadow-xs`}
                  >
                    {comp.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{comp.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{comp.role}</p>
                  </div>
                </div>

                {companions.length > 1 && (
                  <button
                    onClick={() => handleRemove(comp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove companion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add form */}
          <form onSubmit={handleAdd} className="pt-4 border-t border-slate-100 space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Add New Companion
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Role (e.g. Foodie)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                {colors.map((c) => (
                  <button
                    type="button"
                    key={c.class}
                    onClick={() => setColor(c.class)}
                    className={`w-6 h-6 rounded-full ${c.class} transition-all ${
                      color === c.class ? "ring-2 ring-offset-2 ring-slate-800 scale-110" : "opacity-80 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Member
              </button>
            </div>
          </form>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
