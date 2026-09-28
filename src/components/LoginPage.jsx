import React, { useState } from "react";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Plane,
  AlertCircle,
  ArrowRight
} from "lucide-react";

export function LoginPage({ onLogin, lang = "he" }) {
  const isHe = lang === "he";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Authentication validation
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    setIsLoading(true);

    setTimeout(() => {
      if (cleanUser === "admin" && cleanPass === "Aa123456") {
        setIsLoading(false);
        onLogin({
          username: "admin",
          displayName: "מנהל ראשי",
          role: "admin",
          isReadOnly: false
        });
      } else if (cleanUser === "guest" && cleanPass === "123456") {
        setIsLoading(false);
        onLogin({
          username: "guest",
          displayName: "אורח (צפייה בלבד)",
          role: "guest",
          isReadOnly: true
        });
      } else {
        setIsLoading(false);
        setError(
          isHe
            ? "שם משתמש או סיסמה שגויים. נסה שוב."
            : "Invalid username or password. Please try again."
        );
      }
    }, 250);
  };

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-sky-950 to-indigo-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans select-none"
      dir={isHe ? "rtl" : "ltr"}
    >
      {/* Decorative ambient blurred glow spheres */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10 flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-flex p-3.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl shadow-lg shadow-sky-500/30 mb-3 ring-4 ring-white/10">
            <Plane className="w-8 h-8 text-white -rotate-45" />
          </div>
          
          <h1
            className="text-2xl sm:text-3xl font-black tracking-[0.18em] uppercase text-white drop-shadow-md"
            style={{ fontFamily: "'Montserrat', 'Outfit', sans-serif" }}
          >
            MAXVENTURE
          </h1>
          <p className="text-sky-200/80 text-xs sm:text-sm font-medium mt-1">
            {isHe
              ? "מתכנן הטיולים החכם • סנכרון חי ולו״ז אינטראקטיבי"
              : "Smart Travel Planner • Live Sync & Itinerary"}
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl flex items-center gap-2.5 text-rose-200 text-xs font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form: Only Username and Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sky-100 mb-1.5">
              {isHe ? "שם משתמש" : "Username"}
            </label>
            <div className="relative">
              <User className={`w-4 h-4 text-sky-300 absolute ${isHe ? "right-3.5" : "left-3.5"} top-3.5 pointer-events-none`} />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isHe ? "הזן שם משתמש" : "Enter username"}
                className={`w-full ${isHe ? "pr-10 pl-3.5" : "pl-10 pr-3.5"} py-2.5 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-xl text-white placeholder-sky-200/40 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sky-100 mb-1.5">
              {isHe ? "סיסמה" : "Password"}
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 text-sky-300 absolute ${isHe ? "right-3.5" : "left-3.5"} top-3.5 pointer-events-none`} />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full ${isHe ? "pr-10 pl-10" : "pl-10 pr-10"} py-2.5 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-xl text-white placeholder-sky-200/40 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${isHe ? "left-3" : "right-3"} top-3 text-sky-300/80 hover:text-white transition-colors cursor-pointer p-0.5`}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-sm font-extrabold shadow-lg shadow-sky-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isHe ? "התחבר למערכת" : "Sign In"}</span>
                <ArrowRight className={`w-4 h-4 ${isHe ? "rotate-180" : ""}`} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-7 text-[11px] text-sky-200/40">
          MaxVenture &copy; {new Date().getFullYear()} • {isHe ? "כל הזכויות שמורות" : "All rights reserved"}
        </div>
      </div>
    </div>
  );
}
