// Bridge to the iOS app's ScreenTime plugin (ios/App/App/ScreenTimePlugin.swift).
// In a browser there is no Capacitor, so every call quietly does nothing.

const Cap = typeof window !== "undefined" ? window.Capacitor : null;
export const isNative = !!Cap?.isNativePlatform?.();
const plugin = isNative ? (Cap.registerPlugin ? Cap.registerPlugin("ScreenTime") : Cap.Plugins?.ScreenTime) : null;

const call = (method, args) => (plugin
  ? plugin[method](args).catch(e => ({ error: e?.message || String(e) }))
  : Promise.resolve(null));

/** { authorization: "approved"|"denied"|"notDetermined", apps, categories, sites, unlockedUntil } */
export let last = null;
const keep = r => { if (r && !r.error) last = r; return r; };
export const status = () => call("status").then(keep);
export const authorize = () => call("authorize").then(keep);
export const pickApps = () => call("pickApps").then(keep);
/** Unlock the chosen apps until `until` (ms). 0 or a past time locks them now. */
export const setUnlockedUntil = until => call("setUnlockedUntil", { until: Math.max(0, Math.round(until || 0)) }).then(keep);

export const ready = s => !!s && s.authorization === "approved" && s.apps + s.categories + s.sites > 0;
export function chosen(s) {
  if (!s) return "";
  const parts = [[s.apps, "app"], [s.categories, "category"], [s.sites, "website"]].filter(([n]) => n).map(([n, w]) => `${n} ${n === 1 ? w : w === "category" ? "categories" : w + "s"}`);
  return parts.length ? parts.join(", ") : "Nothing chosen yet";
}
