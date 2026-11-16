// State + the rules of the game. No DOM in here so it can be tested in Node.

export const KEY = "stim.v2";
const MIN = 60_000, HOUR = 3_600_000;

export const DEFAULTS = {
  v: 1,
  settings: {
    sessionMin: 30,        // minutes of apps earned per challenge
    maxBankMin: 60,        // most time you can have stacked up at once
    dailyCapMin: 0,        // 0 = no daily limit
    effort: 1,             // scales mind challenges (math problems, words, breathing time)
    moveDefault: "med",    // easy | med | hard: exercise difficulty unless one is chosen per challenge
    diff: {},              // per-exercise choice: { id: { mode: "easy"|"med"|"hard"|"custom", mult } }
    take: 1,               // last position of the time-vs-XP slider (share of the time taken)
    cats: { move: true, learn: true, news: true, mind: true },
    goalPerDay: 3,         // challenges you aim to finish each day
    off: {},               // individual challenges switched off, by id
    camera: true,          // track every exercise with the camera
    readTimer: true,       // quiz unlocks only after a minimum reading time
    useShortcut: true,     // hand off to an iOS Shortcut when time is earned
    shortcutName: "Stim Unlock",
    resetHour: 4,          // the "day" rolls over at 4 AM
  },
  expiresAt: 0,
  log: [],                 // {t, id, cat, title, kind:"done"|"skip", min, spentMs, detail}
  courses: { enrolled: ["finance", "money", "psychology", "history", "numbers", "tech"], done: {} },
  totals: {},              // reps by challenge id
  journal: [],             // {t, prompt, text}
  notes: {},               // your one-line recap of each lesson, by lesson id
  me: { name: "", shape: "blob", color: "#5b3df5", eyes: "dot", mouth: "smile", mark: "bolt", top: "none", wear: {} },   // your character
  owned: [],               // character items bought with XP
  spent: 0,                // XP spent on items
  social: null,            // { id, secret, handle } once you join friends
};

const clone = o => JSON.parse(JSON.stringify(o));

export function merge(saved) {
  const s = clone(DEFAULTS);
  if (!saved || typeof saved !== "object") return s;
  Object.assign(s, saved);
  s.settings = { ...DEFAULTS.settings, ...(saved.settings || {}) };
  s.settings.cats = { ...DEFAULTS.settings.cats, ...(saved.settings?.cats || {}) };
  s.settings.off = { ...(saved.settings?.off || {}) };
  s.courses = { enrolled: [...(saved.courses?.enrolled ?? DEFAULTS.courses.enrolled)], done: { ...(saved.courses?.done || {}) } };
  s.log = Array.isArray(saved.log) ? saved.log : [];
  s.journal = Array.isArray(saved.journal) ? saved.journal : [];
  s.totals = { ...(saved.totals || {}) };
  s.notes = { ...(saved.notes || {}) };
  s.me = { ...DEFAULTS.me, ...(saved.me || {}), wear: { ...(saved.me?.wear || {}) } };
  s.owned = Array.isArray(saved.owned) ? [...saved.owned] : [];
  s.spent = Math.max(0, Number(saved.spent) || 0);
  s.social = saved.social?.id ? { ...saved.social } : null;
  s.settings.diff = { ...(saved.settings?.diff || {}) };
  s.expiresAt = Number(saved.expiresAt) || 0;
  return sanitize(s);
}

const clamp = (n, lo, hi, d) => (Number.isFinite(+n) ? Math.min(hi, Math.max(lo, +n)) : d);

export function sanitize(s) {
  const x = s.settings;
  x.sessionMin = Math.round(clamp(x.sessionMin, 5, 180, 30));
  x.maxBankMin = Math.round(clamp(x.maxBankMin, x.sessionMin, 480, Math.max(60, x.sessionMin)));
  x.dailyCapMin = Math.round(clamp(x.dailyCapMin, 0, 1440, 0));
  x.effort = clamp(x.effort, 0.5, 2, 1);
  x.resetHour = Math.round(clamp(x.resetHour, 0, 12, 4));
  x.goalPerDay = Math.round(clamp(x.goalPerDay, 1, 10, 3));
  if (!DIFF[x.moveDefault]) x.moveDefault = "med";
  x.take = clamp(x.take, 0, 1, 1);
  x.shortcutName = String(x.shortcutName || "Stim Unlock").slice(0, 60);
  return s;
}

export function load(storage) {
  try { return merge(JSON.parse(storage.getItem(KEY))); } catch { return merge(null); }
}
export function save(storage, state) {
  try { storage.setItem(KEY, JSON.stringify(state)); return true; } catch { return false; }
}

// ---------- days ----------
export function dayKey(t, resetHour = 4) {
  const d = new Date(t - resetHour * HOUR);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const dk = (s, t) => dayKey(t, s.settings.resetHour);
export const entriesOn = (s, key) => s.log.filter(e => dk(s, e.t) === key);
export const doneToday = (s, id, now = Date.now()) => entriesOn(s, dk(s, now)).some(e => e.id === id && e.kind === "done");

// ---------- time ----------
export const remainingMs = (s, now = Date.now()) => Math.max(0, s.expiresAt - now);
export const isOpen = (s, now = Date.now()) => s.expiresAt > now;
export const earnedToday = (s, now = Date.now()) => entriesOn(s, dk(s, now)).reduce((n, e) => n + (e.min || 0), 0);
export function capLeft(s, now = Date.now()) {
  const cap = s.settings.dailyCapMin;
  return cap > 0 ? Math.max(0, cap - earnedToday(s, now)) : Infinity;
}

/** How many minutes finishing a challenge right now would add. */
export function nextGrant(s, now = Date.now()) {
  const { sessionMin, maxBankMin } = s.settings;
  const room = Math.max(0, maxBankMin - remainingMs(s, now) / MIN);
  return Math.max(0, Math.floor(Math.min(sessionMin, room, capLeft(s, now))));
}

export const XP_BASE = 20;
/** XP for a finished challenge: the less of the time you take, the more XP you keep. */
export function xpFor(s, takeMin, { bonus = 0, scale = 1 } = {}) {
  const max = Math.round((XP_BASE + Math.max(0, Math.min(5, bonus))) * Math.max(0.4, Math.min(2, scale)));
  return Math.round(max * (1 - Math.max(0, Math.min(1, takeMin / s.settings.sessionMin))));
}

/** Record a finished (or skipped) challenge. takeMin = minutes of app time to take (default: all on offer). */
export function grant(s, { id, cat, title, kind = "done", spentMs = 0, detail = "", bonus = 0, scale = 1, takeMin }, now = Date.now()) {
  const offer = nextGrant(s, now);
  const min = kind === "skip" || takeMin == null ? offer : Math.max(0, Math.min(offer, Math.round(takeMin)));
  if (min > 0) s.expiresAt = Math.max(now, s.expiresAt) + min * MIN;
  const xp = kind === "done" ? xpFor(s, min, { bonus, scale }) : 0;
  const entry = { t: now, id, cat, title, kind, min, xp, spentMs: Math.round(spentMs), detail };
  s.log.push(entry);
  if (s.log.length > 3000) s.log.splice(0, s.log.length - 3000);
  return entry;
}

// ---------- exercise difficulty ----------
export const DIFF = { easy: 0.4, med: 1, hard: 1.6 };
export function moveLevel(s, id) {
  const d = s.settings.diff[id];
  if (d?.mode === "custom" && d.mult > 0) return { mode: "custom", mult: Math.max(0.2, Math.min(6, d.mult)) };
  const mode = DIFF[d?.mode] ? d.mode : s.settings.moveDefault;
  return { mode, mult: DIFF[mode] };
}

// ---------- xp ----------
export const XP_PER_LEVEL = 100;
export const xp = s => s.log.reduce((n, e) => n + (e.xp || 0), 0);
export const coins = s => Math.max(0, xp(s) - s.spent);
export function level(s) { const x = xp(s); return { xp: x, level: Math.floor(x / XP_PER_LEVEL) + 1, into: x % XP_PER_LEVEL, need: XP_PER_LEVEL }; }
export const doneCountToday = (s, now = Date.now()) => entriesOn(s, dk(s, now)).filter(e => e.kind === "done").length;

/** Last n days, oldest first: { key, date, count, spentMin, earnedMin } */
export function days(s, n = 7, now = Date.now()) {
  const out = [], base = new Date(now - s.settings.resetHour * HOUR); base.setHours(12, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base); d.setDate(base.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const e = entriesOn(s, key), dn = e.filter(x => x.kind === "done");
    out.push({ key, date: d, count: dn.length, skipped: e.length > 0 && !dn.length, spentMin: Math.round(dn.reduce((a, x) => a + (x.spentMs || 0), 0) / MIN), earnedMin: e.reduce((a, x) => a + (x.min || 0), 0) });
  }
  return out;
}

export function relock(s) { s.expiresAt = 0; }

// ---------- progress ----------
/** Day status: "done" if any challenge was completed, "skip" if only skips, else undefined. */
export function dayStatus(s, key) {
  const e = entriesOn(s, key);
  if (e.some(x => x.kind === "done")) return "done";
  if (e.length) return "skip";
}

export function streak(s, now = Date.now()) {
  const byDay = new Map();
  for (const e of s.log) {
    const k = dk(s, e.t);
    if (e.kind === "done" || !byDay.has(k)) byDay.set(k, e.kind === "done" ? "done" : byDay.get(k) || "skip");
  }
  const d = new Date(now - s.settings.resetHour * HOUR);
  const key = () => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  if (byDay.get(key()) !== "done") d.setDate(d.getDate() - 1);   // today still open: count from yesterday
  let n = 0;
  while (byDay.get(key()) === "done") { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/** Buy a character item with XP. Returns false if you can't afford it. */
export function buy(s, id, cost) {
  if (s.owned.includes(id)) return true;
  if (coins(s) < cost) return false;
  s.owned.push(id); s.spent += cost; return true;
}

export function stats(s, now = Date.now(), days = 7) {
  const since = now - days * 24 * HOUR;
  const recent = s.log.filter(e => e.t >= since);
  const sum = (arr, f) => arr.reduce((n, e) => n + f(e), 0);
  const done = s.log.filter(e => e.kind === "done");
  const byCat = {};
  for (const e of done) byCat[e.cat] = (byCat[e.cat] || 0) + 1;
  return {
    streak: streak(s, now),
    total: done.length,
    skips: s.log.length - done.length,
    byCat,
    weekDone: recent.filter(e => e.kind === "done").length,
    weekEarnedMin: sum(recent, e => e.min || 0),
    weekSpentMin: Math.round(sum(recent.filter(e => e.kind === "done"), e => e.spentMs || 0) / MIN),
    lessons: Object.keys(s.courses.done).length,
  };
}

export function week(s, now = Date.now()) {
  const base = new Date(now - s.settings.resetHour * HOUR);
  const mon = new Date(base); mon.setHours(12, 0, 0, 0); mon.setDate(base.getDate() - ((base.getDay() + 6) % 7));
  const today = dk(s, now), out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({ key, date: d, status: dayStatus(s, key), count: entriesOn(s, key).filter(e => e.kind === "done").length, today: key === today, future: key > today });
  }
  return out;
}

// ---------- courses ----------
export const lessonDone = (s, lessonId) => !!s.courses.done[lessonId];
export const nextLesson = (s, course) => course.lessons.find(l => !s.courses.done[l.id]) || null;
export const courseProgress = (s, course) => course.lessons.filter(l => s.courses.done[l.id]).length;
export function toggleEnroll(s, id) {
  const i = s.courses.enrolled.indexOf(id);
  i >= 0 ? s.courses.enrolled.splice(i, 1) : s.courses.enrolled.push(id);
}
