// Your character: a small bolt-bellied buddy drawn as SVG. Colours and eyes are free;
// everything in ITEMS is bought with XP.

export const COLORS = ["#5b3df5", "#ff5a5f", "#10b8a6", "#2b96f0", "#e04fc8", "#f59e0b", "#19b86b", "#475569"];
export const EYES = ["dot", "happy", "wide", "wink"];
export const SLOTS = { head: "Headwear", face: "Eyewear", back: "Back", hand: "Gear", aura: "Aura" };
export const ITEMS = [
  { id: "headband", slot: "head", name: "Headband", cost: 40 },
  { id: "cap", slot: "head", name: "Cap", cost: 90 },
  { id: "grad", slot: "head", name: "Grad cap", cost: 160 },
  { id: "crown", slot: "head", name: "Crown", cost: 400 },
  { id: "glasses", slot: "face", name: "Glasses", cost: 60 },
  { id: "shades", slot: "face", name: "Shades", cost: 120 },
  { id: "dumbbell", slot: "hand", name: "Dumbbell", cost: 100 },
  { id: "book", slot: "hand", name: "Book", cost: 100 },
  { id: "cape", slot: "back", name: "Cape", cost: 200 },
  { id: "wings", slot: "back", name: "Wings", cost: 350 },
  { id: "spark", slot: "aura", name: "Spark aura", cost: 250 },
  { id: "flame", slot: "aura", name: "Flame aura", cost: 500 },
];
export const itemById = id => ITEMS.find(i => i.id === id);
export const TITLES = [[1, "Rookie"], [2, "Starter"], [3, "Mover"], [5, "Regular"], [8, "Grinder"], [12, "Machine"], [18, "Legend"]];
export const titleFor = level => [...TITLES].reverse().find(([l]) => level >= l)[1];

const safeColor = c => (/^#[0-9a-f]{6}$/i.test(c || "") ? c : COLORS[0]);
const PART = {
  spark: `<g class="aura"><circle cx="60" cy="64" r="52" fill="#ffb020" opacity=".18"/><g fill="#ffb020"><path d="M14 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><path d="M104 22l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M108 84l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></g></g>`,
  flame: `<g class="aura"><path d="M60 4c10 14 34 22 40 46 6 26-10 54-40 62-30-8-46-36-40-62C26 26 50 18 60 4z" fill="#ff5a5f" opacity=".22"/><path d="M60 16c8 12 26 18 30 38 4 20-8 42-30 48-22-6-34-28-30-48 4-20 22-26 30-38z" fill="#ffb020" opacity=".3"/></g>`,
  cape: `<path d="M34 48c-12 14-18 36-14 56 12-6 26-6 40-2 14-4 28-4 40 2 4-20-2-42-14-56z" fill="#ef4444"/>`,
  wings: `<g fill="#fff" stroke="#cbd5e1" stroke-width="1.5"><path d="M32 56C14 44 6 52 6 62c0 10 10 16 26 12z"/><path d="M88 56c18-12 26-4 26 6 0 10-10 16-26 12z"/></g>`,
  headband: `<rect x="28" y="42" width="64" height="8" rx="4" fill="#ef4444"/><path d="M90 46l10-4-2 8 6 4-12-2z" fill="#ef4444"/>`,
  cap: `<path d="M30 44c0-16 14-24 30-24s30 8 30 24z" fill="#2563eb"/><path d="M84 40c10 0 20 2 22 8H82z" fill="#1d4ed8"/><circle cx="60" cy="21" r="3" fill="#1d4ed8"/>`,
  grad: `<path d="M60 14l38 12-38 12-38-12z" fill="#1f2937"/><path d="M40 30v10c12 6 28 6 40 0V30l-20 6z" fill="#374151"/><path d="M94 26v14" stroke="#ffb020" stroke-width="2.500"/><circle cx="94" cy="42" r="3" fill="#ffb020"/>`,
  crown: `<path d="M34 40l-4-22 16 10 14-16 14 16 16-10-4 22z" fill="#ffb020" stroke="#e08f00" stroke-width="2" stroke-linejoin="round"/><circle cx="60" cy="31" r="3" fill="#ef4444"/>`,
  glasses: `<g fill="rgba(255,255,255,.35)" stroke="#1f2937" stroke-width="3"><circle cx="47" cy="62" r="9"/><circle cx="73" cy="62" r="9"/><path d="M56 62h8" fill="none"/></g>`,
  shades: `<g fill="#111827"><rect x="36" y="55" width="21" height="13" rx="5"/><rect x="63" y="55" width="21" height="13" rx="5"/><rect x="55" y="58" width="10" height="3"/></g>`,
  dumbbell: `<g transform="rotate(-20 100 74)"><rect x="92" y="72" width="18" height="4" rx="2" fill="#475569"/><rect x="88" y="66" width="6" height="16" rx="2" fill="#1f2937"/><rect x="108" y="66" width="6" height="16" rx="2" fill="#1f2937"/></g>`,
  book: `<g transform="rotate(12 16 78)"><rect x="6" y="68" width="20" height="24" rx="3" fill="#10b8a6"/><rect x="9" y="71" width="14" height="3" rx="1.500" fill="#fff" opacity=".8"/><rect x="6" y="68" width="4" height="24" rx="2" fill="#0b9384"/></g>`,
};
const eyes = (kind, covered) => {
  if (covered) return "";
  const L = 47, R = 73, y = 62;
  if (kind === "happy") return `<g fill="none" stroke="#1d1b2f" stroke-width="3.500" stroke-linecap="round"><path d="M${L - 5} ${y + 1}q5-7 10 0"/><path d="M${R - 5} ${y + 1}q5-7 10 0"/></g>`;
  if (kind === "wide") return `<g><circle cx="${L}" cy="${y}" r="7" fill="#fff"/><circle cx="${R}" cy="${y}" r="7" fill="#fff"/><circle cx="${L + 1}" cy="${y + 1}" r="3.500" fill="#1d1b2f"/><circle cx="${R + 1}" cy="${y + 1}" r="3.500" fill="#1d1b2f"/></g>`;
  if (kind === "wink") return `<circle cx="${L}" cy="${y}" r="4.500" fill="#1d1b2f"/><path d="M${R - 5} ${y}h10" stroke="#1d1b2f" stroke-width="3.500" stroke-linecap="round"/>`;
  return `<circle cx="${L}" cy="${y}" r="4.500" fill="#1d1b2f"/><circle cx="${R}" cy="${y}" r="4.500" fill="#1d1b2f"/>`;
};

/** me = { color, eyes, wear: { head, face, back, hand, aura } }. Unknown values are ignored, so it is safe to draw other people's. */
export function buddy(me = {}, cls = "") {
  const c = safeColor(me.color), w = me.wear || {}, on = slot => (PART[w[slot]] && itemById(w[slot])?.slot === slot ? PART[w[slot]] : "");
  return `<svg class="buddy ${cls}" viewBox="0 0 120 120" role="img" aria-label="Character">
    ${on("aura")}${on("back")}
    <ellipse cx="60" cy="110" rx="30" ry="5" fill="rgba(0,0,0,.12)"/>
    <ellipse cx="46" cy="104" rx="10" ry="6" fill="${c}"/><ellipse cx="74" cy="104" rx="10" ry="6" fill="${c}"/>
    <rect x="18" y="64" width="16" height="12" rx="6" fill="${c}"/><rect x="86" y="64" width="16" height="12" rx="6" fill="${c}"/>
    <rect x="28" y="34" width="64" height="68" rx="26" fill="${c}"/>
    <path d="M28 76v0c0 14 12 26 26 26h12c14 0 26-12 26-26z" fill="rgba(0,0,0,.14)"/>
    <path d="M63 74l-11 14h8l-2 10 11-14h-8z" fill="#fff" opacity=".92"/>
    ${eyes(EYES.includes(me.eyes) ? me.eyes : "dot", w.face === "shades")}
    <path d="M54 72q6 5 12 0" fill="none" stroke="#1d1b2f" stroke-width="3" stroke-linecap="round"/>
    ${on("face")}${on("head")}${on("hand")}
  </svg>`;
}
