// Daily reading built from Wikipedia's public "featured feed" (In the news + On this day).
// Everything here turns the feed into the same lesson shape the courses use,
// so one reader/quiz screen handles both. Builders are pure so they can be tested.

const HOSTS = [
  d => `https://en.wikipedia.org/api/rest_v1/feed/featured/${d}`,
  d => `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${d}`,
];
const pad = n => String(n).padStart(2, "0");
export const feedDate = (d = new Date()) => `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;

export async function fetchFeed(date = new Date(), fetcher = fetch) {
  let last;
  for (const url of HOSTS) {
    try {
      const r = await fetcher(url(feedDate(date)), { headers: { accept: "application/json" } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) { last = e; }
  }
  throw last || new Error("feed unavailable");
}

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—" };
export const strip = html => String(html || "")
  .replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&(\w+);/g, (m, k) => ENT[k] ?? m)
  .replace(/\s+/g, " ").trim();

const titleOf = p => p?.titles?.normalized || p?.normalizedtitle || String(p?.title || "").replace(/_/g, " ");
const urlOf = p => p?.content_urls?.mobile?.page || p?.content_urls?.desktop?.page || (p?.title ? `https://en.wikipedia.org/wiki/${encodeURIComponent(p.title)}` : "");
const firstSentences = (t, n = 2) => (String(t || "").match(/[^.!?]+[.!?]+(\s|$)/g) || [String(t || "")]).slice(0, n).join("").trim();

/** Small deterministic PRNG so the same day gives the same questions. */
export function seeded(seed) {
  let h = 2166136261;
  for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}
export function shuffle(arr, rnd = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** In the news → read 3–4 stories, then fill-in-the-blank questions on them. */
export function buildBriefing(feed, seed = "x") {
  const rnd = seeded("news" + seed);
  const stories = (feed?.news || []).map(n => ({
    text: strip(n.story),
    links: (n.links || []).map(p => ({ title: titleOf(p), extract: p.extract || "", url: urlOf(p) })).filter(l => l.title),
  })).filter(s => s.text.length > 30).slice(0, 4);
  if (stories.length < 2) return null;

  const allTitles = [...new Set(stories.flatMap(s => s.links.map(l => l.title)).concat((feed?.mostread?.articles || []).slice(0, 12).map(titleOf)))].filter(Boolean);
  const blocks = [], quiz = [];
  for (const s of stories) {
    const bg = s.links.find(l => l.extract.length > 60);
    blocks.push({ p: s.text, note: bg ? firstSentences(bg.extract, 2) : "", link: bg?.url || s.links[0]?.url || "", linkText: bg ? `More on ${bg.title}` : "Read more" });
    // pick a linked name that literally appears in the story and blank it out
    const hit = shuffle(s.links, rnd).find(l => l.title.length >= 4 && new RegExp(`\\b${esc(l.title)}\\b`, "i").test(s.text));
    if (!hit) continue;
    const lower = s.text.toLowerCase();
    const wrong = shuffle(allTitles.filter(t => t.toLowerCase() !== hit.title.toLowerCase() && !lower.includes(t.toLowerCase())), rnd).slice(0, 3);
    if (wrong.length < 3) continue;
    const o = shuffle([hit.title, ...wrong], rnd);
    quiz.push({
      q: "Fill in the blank: " + s.text.replace(new RegExp(`\\b${esc(hit.title)}\\b`, "i"), "_____"),
      o, a: o.indexOf(hit.title), why: s.text,
    });
  }
  if (!quiz.length) return null;
  return {
    id: "briefing", kicker: "In the news", title: "Today's briefing", source: "Wikipedia · In the news",
    blocks, quiz: quiz.slice(0, 3), words: blocks.reduce((n, b) => n + (b.p + " " + b.note).split(/\s+/).length, 0),
  };
}

/** On this day → read five events, then match events to years. */
export function buildOnThisDay(feed, seed = "x", date = new Date()) {
  const rnd = seeded("otd" + seed);
  const all = (feed?.onthisday || []).filter(e => e.text && Number.isFinite(+e.year)).map(e => ({
    year: +e.year, text: strip(e.text), page: (e.pages || []).find(p => p.extract) || (e.pages || [])[0],
  }));
  const years = [...new Set(all.map(e => e.year))];
  if (all.length < 4 || years.length < 4) return null;
  const picked = shuffle(all, rnd).slice(0, 5).sort((a, b) => a.year - b.year);
  const label = y => (y < 0 ? `${-y} BC` : String(y));
  const blocks = picked.map(e => ({
    h: label(e.year), p: e.text, note: e.page?.extract ? firstSentences(e.page.extract, 1) : "",
    link: e.page ? urlOf(e.page) : "", linkText: e.page ? `More on ${titleOf(e.page)}` : "",
  }));
  const quiz = shuffle(picked, rnd).slice(0, 3).map(e => {
    const wrong = shuffle(years.filter(y => y !== e.year), rnd).slice(0, 3);
    const o = [e.year, ...wrong].sort((a, b) => a - b);
    return { q: `In which year? ${e.text}`, o: o.map(label), a: o.indexOf(e.year), why: `${label(e.year)}: ${e.text}` };
  });
  const day = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  return {
    id: "onthisday", kicker: "On this day", title: day, source: "Wikipedia · On this day",
    blocks, quiz, words: blocks.reduce((n, b) => n + (b.p + " " + b.note).split(/\s+/).length, 0),
  };
}
