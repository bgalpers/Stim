// Friends: a public card (name, handle, character, XP, streak, counts, last challenge title)
// stored in a small Supabase database. Nothing else leaves the phone. The key below is a
// publishable key: it can only call the stim_* functions, which check your device's secret.

const URL = "https://gtsfnyisjgsxpuefubcy.supabase.co";
const KEY = "sb_publishable__DD2dps4U0RyBHj6fLt82g_DHxq1vZ4";
const ERR = { handle_taken: "That handle is taken.", bad_handle: "Handles are 3–16 letters, numbers or underscores.", not_found: "No one has that handle.", cannot_follow_self: "That's you.", not_authorized: "This device is no longer linked to that profile.", too_many: "You're following the maximum number of people." };

async function rpc(fn, args, fetcher = fetch) {
  let r;
  try { r = await fetcher(`${URL}/rest/v1/rpc/${fn}`, { method: "POST", headers: { apikey: KEY, authorization: `Bearer ${KEY}`, "content-type": "application/json" }, body: JSON.stringify(args) }); }
  catch { throw new Error("Couldn't reach the friends server. Check your connection."); }
  const body = await r.json().catch(() => null);
  if (!r.ok) throw new Error(ERR[body?.message] || "Something went wrong on the friends server.");
  return body;
}
export const cleanHandle = h => String(h || "").trim().toLowerCase().replace(/^@/, "");
export const validHandle = h => /^[a-z0-9_]{3,16}$/.test(h);
const newSecret = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), b => b.toString(16).padStart(2, "0")).join("");
const who = s => ({ p_id: s.id, p_secret: s.secret });

/** card = { handle, name, avatar, xp, level, streak, today, week, day_key, last_title, last_at } */
export async function save(social, card) {
  const s = social || { id: null, secret: newSecret() };
  const res = await rpc("stim_save", { ...who(s), p_handle: card.handle, p_name: card.name, p_avatar: card.avatar, p_xp: card.xp, p_level: card.level, p_streak: card.streak, p_today: card.today, p_week: card.week, p_day_key: card.day_key, p_last_title: card.last_title, p_last_at: card.last_at });
  return { id: res.id, secret: s.secret, handle: res.handle };
}
export const feed = social => rpc("stim_feed", who(social));
export const find = (social, handle) => rpc("stim_find", { ...who(social), p_handle: cleanHandle(handle) });
export const follow = (social, handle, on) => rpc("stim_follow", { ...who(social), p_handle: cleanHandle(handle), p_on: on });
export const leave = social => rpc("stim_delete", who(social));
