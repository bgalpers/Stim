// Your character, drawn as SVG. The base (shape, colour, eyes, mouth, belly mark, ears) is free
// and built by swiping through options. Everything in ITEMS is bought with XP.
// buddy() ignores anything it doesn't recognise, so it is safe to draw other people's characters.

export const COLORS = ["#5b3df5", "#8b5cf6", "#e04fc8", "#ff5a5f", "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#19b86b", "#10b8a6", "#06b6d4", "#2b96f0", "#3b5bdb", "#64748b", "#1f2937"];

const SHAPES = {
  blob:   { name: "Blob",   top: 34, d: `<rect x="28" y="34" width="64" height="68" rx="26"/>` },
  round:  { name: "Round",  top: 33, d: `<ellipse cx="60" cy="68" rx="36" ry="35"/>` },
  square: { name: "Block",  top: 36, d: `<rect x="28" y="36" width="64" height="66" rx="12"/>` },
  tall:   { name: "Tall",   top: 24, d: `<rect x="33" y="24" width="54" height="78" rx="25"/>` },
  egg:    { name: "Egg",    top: 28, d: `<path d="M60 28c20 0 32 24 32 44 0 18-13 30-32 30S28 90 28 72c0-20 12-44 32-44z"/>` },
  pear:   { name: "Pear",   top: 30, d: `<path d="M60 30c12 0 20 9 20 20 0 6 14 14 14 30 0 14-12 22-34 22S26 94 26 80c0-16 14-24 14-30 0-11 8-20 20-20z"/>` },
  drop:   { name: "Drop",   top: 22, d: `<path d="M60 22c6 12 32 28 32 52 0 16-13 28-32 28S28 90 28 74c0-24 26-40 32-52z"/>` },
  ghost:  { name: "Ghost",  top: 32, d: `<path d="M28 60c0-16 14-28 32-28s32 12 32 28v44l-10.700-8-10.600 8-10.700-8-10.700 8-10.600-8L28 104z"/>` },
};
const E = (l, r) => l + r, INK = "#1d1b2f", L = 47, R = 73, Y = 62;
const dot = x => `<circle cx="${x}" cy="${Y}" r="4.500" fill="${INK}"/>`;
const star = (x, y, r, fill) => `<path fill="${fill}" d="M${x} ${y - r}l${r * 0.29} ${r * 0.6} ${r * 0.66} ${r * 0.1}-${r * 0.48} ${r * 0.46} ${r * 0.12} ${r * 0.66}-${r * 0.59}-${r * 0.31}-${r * 0.59} ${r * 0.31} ${r * 0.12}-${r * 0.66}-${r * 0.48}-${r * 0.46} ${r * 0.66}-${r * 0.1}z"/>`;
const heart = (x, y, s, fill) => `<path fill="${fill}" transform="translate(${x} ${y}) scale(${s})" d="M0 4C-6-2-10-5-10-9c0-3 2-5 5-5 2 0 4 1 5 3 1-2 3-3 5-3 3 0 5 2 5 5 0 4-4 7-10 13z"/>`;
const EYE = {
  dot:     { name: "Dots",    d: E(dot(L), dot(R)) },
  happy:   { name: "Happy",   d: `<g fill="none" stroke="${INK}" stroke-width="3.500" stroke-linecap="round"><path d="M${L - 5} ${Y + 1}q5-7 10 0"/><path d="M${R - 5} ${Y + 1}q5-7 10 0"/></g>` },
  wide:    { name: "Wide",    d: [L, R].map(x => `<circle cx="${x}" cy="${Y}" r="7" fill="#fff"/><circle cx="${x + 1}" cy="${Y + 1}" r="3.500" fill="#1D1B2F"/>`).join("") },
  wink:    { name: "Wink",    d: dot(L) + `<path d="M${R - 5} ${Y}h10" stroke="${INK}" stroke-width="3.500" stroke-linecap="round"/>` },
  sleepy:  { name: "Sleepy",  d: [L, R].map(x => `<path d="M${x - 6} ${Y - 1}h12a6 6 0 0 1-12 0z" fill="${INK}"/>`).join("") },
  focused: { name: "Focused", d: E(dot(L), dot(R)) + `<g stroke="${INK}" stroke-width="3" stroke-linecap="round"><path d="M${L - 7} ${Y - 10}l11 4"/><path d="M${R + 7} ${Y - 10}l-11 4"/></g>` },
  sparkle: { name: "Sparkle", d: [L, R].map(x => `<circle cx="${x}" cy="${Y}" r="6.500" fill="${INK}"/><circle cx="${x + 2}" cy="${Y - 2}" r="2.200" fill="#fff"/><circle cx="${x - 2}" cy="${Y + 2.500}" r="1.100" fill="#fff"/>`).join("") },
  stars:   { name: "Starry",  d: star(L, Y, 8, INK) + star(R, Y, 8, INK) },
};
const MOUTH = {
  smile: { name: "Smile", d: `<path d="M54 72q6 5 12 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` },
  grin:  { name: "Grin",  d: `<path d="M51 71h18a9 8 0 0 1-18 0z" fill="${INK}"/><path d="M54 71h12v3H54z" fill="#fff"/>` },
  flat:  { name: "Flat",  d: `<path d="M54 74h12" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` },
  oh:    { name: "Oh",    d: `<ellipse cx="60" cy="74" rx="4" ry="5" fill="${INK}"/>` },
  tongue:{ name: "Cheeky",d: `<path d="M53 71q7 4 14 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M58 73h7v3a3.500 3.500 0 0 1-7 0z" fill="#ff7a8a"/>` },
  smirk: { name: "Smirk", d: `<path d="M54 74q7 2 12-4" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` },
};
const MARK = {
  bolt:   { name: "Bolt",   d: `<path d="M63 78l-10 13h7l-2 9 10-13h-7z" fill="#fff" opacity=".92"/>` },
  star:   { name: "Star",   d: star(60, 90, 9, "rgba(255,255,255,.92)") },
  heart:  { name: "Heart",  d: heart(60, 94, 0.75, "rgba(255,255,255,.92)") },
  spots:  { name: "Spots",  d: `<g fill="rgba(255,255,255,.55)"><circle cx="52" cy="86" r="4"/><circle cx="66" cy="84" r="3"/><circle cx="62" cy="94" r="3.500"/></g>` },
  patch:  { name: "Tummy",  d: `<ellipse cx="60" cy="90" rx="15" ry="11" fill="rgba(255,255,255,.4)"/>` },
  none:   { name: "Plain",  d: "" },
};
const TOP = {   // ears and other free toppers, drawn at the head (shifted to each shape's top)
  none:    { name: "None",    d: "" },
  antenna: { name: "Antenna", d: c => `<path d="M60 36V20" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="17" r="5" fill="#ffb020"/>` },
  cat:     { name: "Cat",     d: c => `<path d="M34 46l2-22 16 12zM86 46l-2-22-16 12z" fill="${c}"/><path d="M38 40l1-9 7 5zM82 40l-1-9-7 5z" fill="rgba(255,255,255,.45)"/>` },
  bear:    { name: "Bear",    d: c => `<circle cx="38" cy="36" r="10" fill="${c}"/><circle cx="82" cy="36" r="10" fill="${c}"/><circle cx="38" cy="36" r="4.500" fill="rgba(255,255,255,.45)"/><circle cx="82" cy="36" r="4.500" fill="rgba(255,255,255,.45)"/>` },
  bunny:   { name: "Bunny",   d: c => `<rect x="40" y="6" width="11" height="36" rx="5.500" fill="${c}"/><rect x="69" y="6" width="11" height="36" rx="5.500" fill="${c}"/><rect x="43.500" y="11" width="4" height="22" rx="2" fill="rgba(255,255,255,.45)"/><rect x="72.500" y="11" width="4" height="22" rx="2" fill="rgba(255,255,255,.45)"/>` },
  horns:   { name: "Horns",   d: () => `<path d="M40 40c-8-4-10-12-8-20 4 6 10 8 16 10zM80 40c8-4 10-12 8-20-4 6-10 8-16 10z" fill="#fde68a"/>` },
  tuft:    { name: "Tuft",    d: c => `<path d="M52 38c-2-10 2-18 8-22 0 6 2 8 6 10-2 2-2 6-2 12z" fill="${c}"/>` },
  sprout:  { name: "Sprout",  d: () => `<path d="M60 38V26" stroke="#15803d" stroke-width="3.500" stroke-linecap="round"/><path d="M60 28c-8 0-12-5-12-11 8 0 12 5 12 11zM60 26c0-7 5-11 11-11 0 7-5 11-11 11z" fill="#22c55e"/>` },
};
export const BASE = { shape: SHAPES, color: COLORS, eyes: EYE, mouth: MOUTH, mark: MARK, top: TOP };
export const BASE_LABEL = { shape: "Shape", color: "Colour", eyes: "Eyes", mouth: "Mouth", mark: "Belly", top: "Ears" };
/** option keys for a base category, in swipe order */
export const options = cat => (cat === "color" ? COLORS : Object.keys(BASE[cat]));
export const optionName = (cat, key) => (cat === "color" ? `Colour ${COLORS.indexOf(key) + 1}` : BASE[cat][key].name);
export const DEFAULT = { shape: "blob", color: COLORS[0], eyes: "dot", mouth: "smile", mark: "bolt", top: "none" };

export const SLOTS = { head: "Headwear", face: "Eyewear", neck: "Neck", hand: "Gear", back: "Back", feet: "Feet", aura: "Aura", bg: "Backdrop" };
const sneak = (fill, stroke) => `<rect x="34" y="98" width="24" height="11" rx="5.500" fill="${fill}" stroke="${stroke}" stroke-width="1.500"/><rect x="62" y="98" width="24" height="11" rx="5.500" fill="${fill}" stroke="${stroke}" stroke-width="1.500"/>`;
const PART = {
  // head (drawn relative to a head top of y=34)
  headband: `<rect x="28" y="42" width="64" height="8" rx="4" fill="#ef4444"/><path d="M90 46l10-4-2 8 6 4-12-2z" fill="#ef4444"/>`,
  cap: `<path d="M30 44c0-16 14-24 30-24s30 8 30 24z" fill="#2563eb"/><path d="M84 40c10 0 20 2 22 8H82z" fill="#1d4ed8"/><circle cx="60" cy="21" r="3" fill="#1d4ed8"/>`,
  beanie: `<path d="M30 46c0-18 13-28 30-28s30 10 30 28z" fill="#e04fc8"/><rect x="28" y="41" width="64" height="9" rx="4.500" fill="#bd35a6"/><circle cx="60" cy="16" r="6" fill="#fff"/>`,
  party: `<path d="M60 4l16 34H44z" fill="#2b96f0"/><path d="M53 22l12 5M49 31l20 5" stroke="#fff" stroke-width="2.500"/><circle cx="60" cy="5" r="5" fill="#ffb020"/>`,
  grad: `<path d="M60 14l38 12-38 12-38-12z" fill="#1f2937"/><path d="M40 30v10c12 6 28 6 40 0V30l-20 6z" fill="#374151"/><path d="M94 26v14" stroke="#ffb020" stroke-width="2.500"/><circle cx="94" cy="42" r="3" fill="#ffb020"/>`,
  headphones: `<path d="M27 60v-8c0-18 14-30 33-30s33 12 33 30v8" fill="none" stroke="#1f2937" stroke-width="6" stroke-linecap="round"/><rect x="19" y="52" width="14" height="22" rx="6" fill="#ef4444"/><rect x="87" y="52" width="14" height="22" rx="6" fill="#ef4444"/>`,
  cowboy: `<path d="M16 40c10-6 20-6 27-6l4-16c4-6 22-6 26 0l4 16c7 0 17 0 27 6-14 9-74 9-88 0z" fill="#b45309"/><path d="M44 31h32" stroke="#78350f" stroke-width="4"/>`,
  tophat: `<rect x="41" y="6" width="38" height="30" rx="3" fill="#1f2937"/><rect x="41" y="26" width="38" height="6" fill="#ef4444"/><rect x="28" y="33" width="64" height="7" rx="3.500" fill="#1f2937"/>`,
  halo: `<ellipse cx="60" cy="22" rx="22" ry="6" fill="none" stroke="#ffb020" stroke-width="5"/>`,
  crown: `<path d="M34 40l-4-22 16 10 14-16 14 16 16-10-4 22z" fill="#ffb020" stroke="#e08f00" stroke-width="2" stroke-linejoin="round"/><circle cx="60" cy="31" r="3" fill="#ef4444"/>`,
  // face
  glasses: `<g fill="rgba(255,255,255,.35)" stroke="#1f2937" stroke-width="3"><circle cx="47" cy="62" r="9"/><circle cx="73" cy="62" r="9"/><path d="M56 62h8" fill="none"/></g>`,
  monocle: `<circle cx="73" cy="62" r="10" fill="rgba(255,255,255,.35)" stroke="#e08f00" stroke-width="3"/><path d="M80 70q6 10 2 22" fill="none" stroke="#e08f00" stroke-width="1.500"/>`,
  mustache: `<path d="M60 71c-4-5-15-5-19 3 7 2 13 2 19-1 6 3 12 3 19 1-4-8-15-8-19-3z" fill="#78350f"/>`,
  patch: `<path d="M30 50l60 14" stroke="#111827" stroke-width="2.500"/><ellipse cx="47" cy="62" rx="10" ry="8.500" fill="#111827"/>`,
  shades: `<g fill="#111827"><rect x="36" y="55" width="21" height="13" rx="5"/><rect x="63" y="55" width="21" height="13" rx="5"/><rect x="55" y="58" width="10" height="3"/></g>`,
  ninja: `<rect x="30" y="52" width="60" height="20" rx="9" fill="#111827"/><ellipse cx="47" cy="62" rx="7" ry="4" fill="#fff"/><ellipse cx="73" cy="62" rx="7" ry="4" fill="#fff"/><circle cx="48" cy="62" r="2.500" fill="#111827"/><circle cx="72" cy="62" r="2.500" fill="#111827"/><path d="M88 58l12-5-3 8 7 4-14 0z" fill="#111827"/>`,
  starshades: star(47, 62, 12, "#ffb020") + star(73, 62, 12, "#ffb020") + `<path d="M56 62h8" stroke="#e08f00" stroke-width="3"/>`,
  // neck
  bowtie: `<path d="M60 82l-12-7v14zM60 82l12-7v14z" fill="#ef4444"/><circle cx="60" cy="82" r="3.500" fill="#b91c1c"/>`,
  tie: `<path d="M56 79h8l-2 5 4 13-6 5-6-5 4-13z" fill="#2563eb"/>`,
  scarf: `<rect x="31" y="78" width="58" height="9" rx="4.500" fill="#ef4444"/><path d="M68 85h10v15l-5-3-5 3z" fill="#dc2626"/>`,
  chain: `<path d="M44 78q16 16 32 0" fill="none" stroke="#ffb020" stroke-width="4" stroke-dasharray="3 3"/><circle cx="60" cy="90" r="5" fill="#ffb020" stroke="#e08f00" stroke-width="1.500"/>`,
  medal: `<path d="M50 77l10 12 10-12" fill="none" stroke="#2563eb" stroke-width="4" stroke-linejoin="round"/><circle cx="60" cy="93" r="7" fill="#ffb020" stroke="#e08f00" stroke-width="2"/>`,
  // hand
  coffee: `<rect x="92" y="60" width="14" height="18" rx="3" fill="#fff" stroke="#cbd5e1" stroke-width="1.500"/><rect x="92" y="60" width="14" height="5" rx="2" fill="#78350f"/><path d="M96 56q2-3 0-6M102 56q2-3 0-6" fill="none" stroke="#94a3b8" stroke-width="1.500" stroke-linecap="round"/>`,
  dumbbell: `<g transform="rotate(-20 100 74)"><rect x="92" y="72" width="18" height="4" rx="2" fill="#475569"/><rect x="88" y="66" width="6" height="16" rx="2" fill="#1f2937"/><rect x="108" y="66" width="6" height="16" rx="2" fill="#1f2937"/></g>`,
  book: `<g transform="rotate(12 16 78)"><rect x="6" y="66" width="20" height="24" rx="3" fill="#10b8a6"/><rect x="9" y="69" width="14" height="3" rx="1.500" fill="#fff" opacity=".8"/><rect x="6" y="66" width="4" height="24" rx="2" fill="#0b9384"/></g>`,
  balloon: `<path d="M98 68V44" stroke="#94a3b8" stroke-width="1.500"/><ellipse cx="98" cy="30" rx="11" ry="14" fill="#ef4444"/><path d="M93 24q2-5 6-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`,
  flag: `<path d="M97 40v40" stroke="#475569" stroke-width="3" stroke-linecap="round"/><path d="M98 41h19l-5 7 5 7H98z" fill="#19b86b"/>`,
  sword: `<g transform="rotate(18 98 72)"><rect x="96" y="30" width="5" height="40" rx="2" fill="#cbd5e1"/><rect x="88" y="68" width="21" height="4" rx="2" fill="#78350f"/><rect x="96" y="72" width="5" height="9" rx="1" fill="#78350f"/></g>`,
  trophy: `<path d="M89 50h20v8c0 7-4 11-10 11s-10-4-10-11z" fill="#ffb020" stroke="#e08f00" stroke-width="1.500"/><rect x="97" y="69" width="4" height="6" fill="#e08f00"/><rect x="91" y="75" width="16" height="4" rx="2" fill="#e08f00"/>`,
  // back (behind the body)
  backpack: `<rect x="21" y="44" width="78" height="48" rx="16" fill="#f59e0b"/><rect x="21" y="60" width="78" height="6" fill="#d97706"/>`,
  cape: `<path d="M34 48c-12 14-18 36-14 56 12-6 26-6 40-2 14-4 28-4 40 2 4-20-2-42-14-56z" fill="#ef4444"/>`,
  tail: `<path d="M86 92c20 6 28-10 18-20" fill="none" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>`,
  jetpack: `<rect x="15" y="46" width="15" height="36" rx="7" fill="#94a3b8"/><rect x="90" y="46" width="15" height="36" rx="7" fill="#94a3b8"/><path d="M17 82l5.500 16 5.500-16zM92 82l5.500 16 5.500-16z" fill="#ff8a00"/>`,
  wings: `<g fill="#fff" stroke="#cbd5e1" stroke-width="1.500"><path d="M32 56C14 44 6 52 6 62c0 10 10 16 26 12z"/><path d="M88 56c18-12 26-4 26 6 0 10-10 16-26 12z"/></g>`,
  // feet
  sneakers: sneak("#fff", "#cbd5e1") + `<path d="M39 103.500h9M67 103.500h9" stroke="#ef4444" stroke-width="2.500" stroke-linecap="round"/>`,
  boots: `<path d="M36 92h18v8h4v9H36zM64 92h18v8h4v9H64z" fill="#78350f"/>`,
  skates: sneak("#2b96f0", "#1a79cf") + `<g fill="#1f2937"><circle cx="40" cy="111" r="3"/><circle cx="52" cy="111" r="3"/><circle cx="68" cy="111" r="3"/><circle cx="80" cy="111" r="3"/></g>`,
  // aura
  hearts: `<g class="aura">${heart(14, 34, 0.7, "#ff5a8a")}${heart(106, 28, 0.55, "#ff5a8a")}${heart(108, 84, 0.6, "#ff8fb0")}${heart(12, 88, 0.5, "#ff8fb0")}</g>`,
  spark: `<g class="aura"><circle cx="60" cy="64" r="52" fill="#ffb020" opacity=".18"/>${star(14, 34, 9, "#ffb020")}${star(104, 24, 7, "#ffb020")}${star(108, 88, 7, "#ffb020")}</g>`,
  storm: `<g class="aura" fill="#ffd21f"><path d="M14 20l-8 14h7l-3 11 10-15h-7z"/><path d="M108 12l-8 14h7l-3 11 10-15h-7z"/><path d="M112 70l-7 12h6l-3 10 9-13h-6z"/></g>`,
  flame: `<g class="aura"><path d="M60 4c10 14 34 22 40 46 6 26-10 54-40 62-30-8-46-36-40-62C26 26 50 18 60 4z" fill="#ff5a5f" opacity=".22"/><path d="M60 16c8 12 26 18 30 38 4 20-8 42-30 48-22-6-34-28-30-48 4-20 22-26 30-38z" fill="#ffb020" opacity=".3"/></g>`,
  rainbow: `<g class="aura" fill="none" stroke-width="6"><path d="M6 96a54 54 0 0 1 108 0" stroke="#ef4444"/><path d="M12 96a48 48 0 0 1 96 0" stroke="#f59e0b"/><path d="M18 96a42 42 0 0 1 84 0" stroke="#22c55e"/><path d="M24 96a36 36 0 0 1 72 0" stroke="#3b82f6"/></g>`,
  // backdrop (fills the square behind everything)
  sky: `<rect width="120" height="120" rx="26" fill="#bfe3ff"/><circle cx="96" cy="22" r="11" fill="#ffd54a"/><g fill="#fff"><ellipse cx="26" cy="26" rx="14" ry="6"/><ellipse cx="34" cy="21" rx="9" ry="6"/></g><path d="M0 100h120c0 11-9 20-26 20H26C9 120 0 111 0 100z" fill="#86d993"/>`,
  sunset: `<rect width="120" height="120" rx="26" fill="#ff9a5a"/><path d="M24 120a36 36 0 0 1 72 0z" fill="#ffd27a" opacity=".85"/><path d="M38 120a22 22 0 0 1 44 0z" fill="#fff1c9" opacity=".85"/>`,
  gym: `<rect width="120" height="120" rx="26" fill="#2a2552"/><g stroke="#3d3772" stroke-width="2"><path d="M0 30h120M0 60h120M0 90h120M30 0v120M60 0v120M90 0v120"/></g>`,
  night: `<rect width="120" height="120" rx="26" fill="#111836"/><circle cx="94" cy="24" r="11" fill="#fde68a"/><circle cx="89" cy="21" r="10" fill="#111836"/><g fill="#fff"><circle cx="20" cy="20" r="1.500"/><circle cx="40" cy="12" r="1"/><circle cx="64" cy="22" r="1.500"/><circle cx="14" cy="50" r="1"/><circle cx="106" cy="52" r="1.500"/><circle cx="30" cy="34" r="1"/></g>`,
  space: `<rect width="120" height="120" rx="26" fill="#0b0b1f"/><circle cx="24" cy="26" r="12" fill="#8b5cf6"/><ellipse cx="24" cy="26" rx="20" ry="5" fill="none" stroke="#c4b5fd" stroke-width="2" transform="rotate(-18 24 26)"/><g fill="#fff"><circle cx="70" cy="14" r="1.500"/><circle cx="100" cy="30" r="1"/><circle cx="108" cy="70" r="1.500"/><circle cx="12" cy="74" r="1"/><circle cx="88" cy="10" r="1"/></g>`,
};
const I = (id, slot, name, cost) => ({ id, slot, name, cost });
export const ITEMS = [
  I("headband", "head", "Headband", 30), I("cap", "head", "Cap", 60), I("beanie", "head", "Beanie", 60), I("party", "head", "Party hat", 80), I("headphones", "head", "Headphones", 120),
  I("grad", "head", "Grad cap", 150), I("cowboy", "head", "Cowboy hat", 180), I("tophat", "head", "Top hat", 220), I("halo", "head", "Halo", 300), I("crown", "head", "Crown", 500),
  I("glasses", "face", "Glasses", 40), I("monocle", "face", "Monocle", 80), I("mustache", "face", "Moustache", 80), I("patch", "face", "Eye patch", 100), I("shades", "face", "Shades", 120), I("ninja", "face", "Ninja mask", 200), I("starshades", "face", "Star shades", 260),
  I("bowtie", "neck", "Bow tie", 40), I("tie", "neck", "Tie", 60), I("scarf", "neck", "Scarf", 80), I("chain", "neck", "Gold chain", 160), I("medal", "neck", "Medal", 240),
  I("coffee", "hand", "Coffee", 40), I("dumbbell", "hand", "Dumbbell", 80), I("book", "hand", "Book", 80), I("balloon", "hand", "Balloon", 100), I("flag", "hand", "Flag", 120), I("sword", "hand", "Sword", 220), I("trophy", "hand", "Trophy", 400),
  I("backpack", "back", "Backpack", 80), I("tail", "back", "Tail", 100), I("cape", "back", "Cape", 180), I("jetpack", "back", "Jetpack", 320), I("wings", "back", "Wings", 380),
  I("sneakers", "feet", "Sneakers", 50), I("boots", "feet", "Boots", 90), I("skates", "feet", "Skates", 150),
  I("hearts", "aura", "Hearts", 120), I("spark", "aura", "Sparkles", 200), I("storm", "aura", "Storm", 280), I("rainbow", "aura", "Rainbow", 360), I("flame", "aura", "Flames", 600),
  I("sky", "bg", "Blue sky", 60), I("sunset", "bg", "Sunset", 100), I("gym", "bg", "Grid", 100), I("night", "bg", "Night", 160), I("space", "bg", "Space", 300),
];
export const itemById = id => ITEMS.find(i => i.id === id);
export const TITLES = [[1, "Rookie"], [2, "Starter"], [3, "Mover"], [5, "Regular"], [8, "Grinder"], [12, "Machine"], [18, "Legend"]];
export const titleFor = level => [...TITLES].reverse().find(([l]) => level >= l)[1];

const pick = (table, key, fallback) => (Object.hasOwn(table, key) ? table[key] : table[fallback]);
const hidesEyes = { shades: 1, ninja: 1, starshades: 1 };
let uid = 0;

/** me = { shape, color, eyes, mouth, mark, top, wear: { head, face, neck, hand, back, feet, aura, bg } } */
export function buddy(me = {}, cls = "") {
  const c = /^#[0-9a-f]{6}$/i.test(me.color || "") ? me.color : COLORS[0], w = me.wear && typeof me.wear === "object" ? me.wear : {};
  const on = slot => { const it = typeof w[slot] === "string" && Object.hasOwn(PART, w[slot]) ? itemById(w[slot]) : null; return it && it.slot === slot ? PART[it.id] : ""; };
  const shape = pick(SHAPES, me.shape, "blob"), dy = shape.top - 34, id = "bd" + ++uid, top = pick(TOP, me.top, "none");
  const head = `${top.d ? top.d(c) : ""}`, face = on("face"), neck = on("neck");
  // on a dark body, draw the face in a light ink so it stays visible
  const [r, g, b] = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)), dark = 0.299 * r + 0.587 * g + 0.114 * b < 70;
  const ink = str => (dark ? str.replaceAll(INK, "#f4f3fb") : str);
  return `<svg class="buddy ${cls}" viewBox="0 0 120 120" role="img" aria-label="Character">
    ${on("bg")}${on("aura")}${on("back")}
    <ellipse cx="60" cy="111" rx="30" ry="5" fill="rgba(0,0,0,.12)"/>
    <ellipse cx="46" cy="104" rx="10" ry="6" fill="${c}"/><ellipse cx="74" cy="104" rx="10" ry="6" fill="${c}"/>
    <rect x="17" y="64" width="18" height="12" rx="6" fill="${c}"/><rect x="85" y="64" width="18" height="12" rx="6" fill="${c}"/>
    <g transform="translate(0 ${dy})">${head}</g>
    <clipPath id="${id}">${shape.d}</clipPath>
    <g fill="${c}">${shape.d}</g>
    <rect x="0" y="80" width="120" height="40" fill="rgba(0,0,0,.13)" clip-path="url(#${id})"/>
    ${neck ? "" : pick(MARK, me.mark, "bolt").d}
    ${Object.hasOwn(hidesEyes, w.face) && face ? "" : ink(pick(EYE, me.eyes, "dot").d)}
    ${w.face === "mustache" && face ? "" : ink(pick(MOUTH, me.mouth, "smile").d)}
    ${face}${neck}${on("feet")}
    <g transform="translate(0 ${dy})">${on("head")}</g>
    ${on("hand")}
  </svg>`;
}
