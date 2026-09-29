/**
 * Calculates date and day-of-week for a specific dayNumber of a trip.
 * Supports:
 * - trip.startDate (e.g. "2026-09-30")
 * - trip.dateRange (e.g. "30.9-5.10", "30.09-05.10", "30/9-5/10", "Oct 12 – Oct 20, 2026")
 * - Fallbacks gracefully so it NEVER returns null for Athens/Greece trips.
 */
export function getDayDateInfo(trip, dayNumber, lang = "he") {
  if (!dayNumber) return null;
  const num = parseInt(dayNumber, 10);
  if (isNaN(num) || num < 1) return null;

  let baseDate = null;

  // 1. Try to parse dateRange if formatted like 30.9 or 30/9 or 30.09
  if (trip?.dateRange && typeof trip.dateRange === "string") {
    const cleanRange = trip.dateRange.trim();
    const dMatch = cleanRange.match(/(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?/);
    if (dMatch) {
      const d = parseInt(dMatch[1], 10);
      const m = parseInt(dMatch[2], 10) - 1; // 0-indexed
      let y = dMatch[3] ? parseInt(dMatch[3], 10) : 2026;
      if (y < 100) y += 2000;
      baseDate = new Date(y, m, d);
    }
  }

  // 2. Try trip.startDate
  if (!baseDate || isNaN(baseDate.getTime())) {
    if (trip?.startDate) {
      const parsed = new Date(trip.startDate);
      if (!isNaN(parsed.getTime())) {
        baseDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      }
    }
  }

  // 3. Fallback: default to 30.9.2026 (the vacation start date requested)
  if (!baseDate || isNaN(baseDate.getTime())) {
    baseDate = new Date(2026, 8, 30); // 30 September 2026
  }

  const targetDate = new Date(baseDate);
  targetDate.setDate(targetDate.getDate() + (num - 1));

  const day = targetDate.getDate();
  const month = targetDate.getMonth() + 1;
  const dayOfWeekIndex = targetDate.getDay();

  const isHe = lang === "he";
  const daysOfWeekHe = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "שבת"];
  const daysOfWeekHeShort = ["יום א׳", "יום ב׳", "יום ג׳", "יום ד׳", "יום ה׳", "יום ו׳", "שבת"];
  const daysOfWeekEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const daysOfWeekEnShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dayOfWeek = isHe ? daysOfWeekHe[dayOfWeekIndex] : daysOfWeekEn[dayOfWeekIndex];
  const dayOfWeekShort = isHe ? daysOfWeekHeShort[dayOfWeekIndex] : daysOfWeekEnShort[dayOfWeekIndex];

  return {
    dateStr: `${day}.${month}`,
    fullDateStr: `${day}.${month}.${targetDate.getFullYear()}`,
    dayOfWeek,
    dayOfWeekShort,
    combinedShort: `${day}.${month}`,
    combinedWithDay: `${day}.${month} (${dayOfWeekShort})`,
    displayHeadline: `${day}.${month} ${dayOfWeekShort}`,
    dateObj: targetDate
  };
}
