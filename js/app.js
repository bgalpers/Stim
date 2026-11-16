import * as S from "./store.js";
import { CATS, CHALLENGES, byId, scaled, summary, stationLabel, PROMPTS } from "./catalog.js";
import { COURSES, courseById, findLesson } from "../content/courses.js";
import * as News from "./news.js";

// ---------- basics ----------
const state = S.load(localStorage);
const persist = () => S.save(localStorage, state);
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const view = $("#view");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const DAY = 86_400_000, REVIEW_AFTER = 7 * DAY;
const hash = str => { let h = 0; for (const c of String(str)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
const clamp01 = p => Math.max(0, Math.min(1, p));
const today = () => S.dayKey(Date.now(), state.settings.resetHour);

// router state lives here so it works on GitHub Pages and inside frames that don't pass "#/path" hashes
let current = location.hash;
const path = () => current.replace(/^#\/?/, "");
function go(h, push = true) {
  current = h;
  try { if (push && location.hash !== h) history.pushState(null, "", h); } catch {}
  route();
}

function fmtClock(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}
const fmtMin = m => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`);

// ---------- sound / haptics / wake lock ----------
let audio = null;
function ensureAudio() { try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume?.(); } catch {} }
function beep(freq = 880, dur = 0.08, vol = 0.15) {
  if (!audio) return;
  try {
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
    o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime + dur + 0.02);
  } catch {}
}
const buzz = p => { try { navigator.vibrate?.(p); } catch {} };
const good = () => { beep(880, 0.08); setTimeout(() => beep(1320, 0.14), 90); };
const bad = () => { beep(240, 0.2); buzz(60); };
const fanfare = () => { [660, 880, 1100, 1320].forEach((f, i) => setTimeout(() => beep(f, 0.16), i * 110)); buzz([60, 40, 120]); };
let wakeLock = null;
async function keepAwake(on) {
  try { if (on) wakeLock = await navigator.wakeLock?.request("screen"); else { await wakeLock?.release?.(); wakeLock = null; } } catch {}
}

// ---------- motion helpers ----------
/** After a render: grow bars, count numbers up, draw rings. */
function mount(root = view) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$("[data-w]", root).forEach(el => (el.style.width = el.dataset.w + "%"));
    $$("[data-h]", root).forEach(el => (el.style.height = el.dataset.h + "%"));
    $$("[data-p]", root).forEach(el => (el.style.strokeDashoffset = (CIRC * (1 - clamp01(+el.dataset.p))).toFixed(2)));
  }));
  $$("[data-count]", root).forEach(el => {
    const to = +el.dataset.count, from = +(el.dataset.from || 0), pre = el.dataset.pre || "", suf = el.dataset.suf || "";
    if (reduceMotion || to === from) return void (el.textContent = pre + to + suf);
    const t0 = performance.now(), dur = 900;
    const tick = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = pre + Math.round(from + (to - from) * e) + suf; if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}
const pop = el => { if (el && !reduceMotion) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); } };
const shake = el => { if (el) { el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); } };

let confettiRun = 0;
function confetti() {
  if (reduceMotion) return;
  const my = ++confettiRun;
  const c = $("#confetti"), ctx = c.getContext("2d"), W = (c.width = innerWidth), H = (c.height = innerHeight);
  const cols = ["#5b3df5", "#ffb020", "#ff5a5f", "#10b8a6", "#2b96f0", "#e754c4"];
  const parts = Array.from({ length: 110 }, () => ({ x: W / 2 + (Math.random() - 0.5) * 80, y: H * 0.32, vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 13 - 3, s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: cols[(Math.random() * cols.length) | 0] }));
  const t0 = performance.now();
  (function frame(t) {
    const age = t - t0; ctx.clearRect(0, 0, W, H);
    if (age > 2400 || my !== confettiRun) return;
    ctx.globalAlpha = age > 1800 ? 1 - (age - 1800) / 600 : 1;
    for (const p of parts) {
      p.vy += 0.32; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.66); ctx.restore();
    }
    requestAnimationFrame(frame);
  })(t0);
}

// ---------- small pieces of UI ----------
const BOLT = '<svg class="bolt" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>';
const CHECK = '<svg class="tick" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7.500l2.500 2.500L11 4.500"/></svg>';
const CIRC = 2 * Math.PI * 52;
/** ring that animates to p on mount; pass live=true to set it immediately (for tickers) */
const ring = (p, inner, cls = "", live = false) => `<div class="ring ${cls}"><svg viewBox="0 0 120 120"><circle class="t" cx="60" cy="60" r="52"/><circle class="f" cx="60" cy="60" r="52" stroke-dasharray="${CIRC.toFixed(2)}" stroke-dashoffset="${(live ? CIRC * (1 - clamp01(p)) : CIRC).toFixed(2)}" ${live ? "" : `data-p="${clamp01(p)}"`}/></svg><div class="c">${inner}</div></div>`;
function setRing(el, p, big) {
  if (!el) return;
  $(".f", el).style.strokeDashoffset = (CIRC * (1 - clamp01(p))).toFixed(2);
  if (big != null) $("b", el).textContent = big;
}
const shortcutUrl = (min = Math.ceil(S.remainingMs(state) / 60000)) =>
  `shortcuts://run-shortcut?name=${encodeURIComponent(state.settings.shortcutName)}&input=text&text=${min}`;
const openAppsBtn = (cls = "white") => state.settings.useShortcut && S.isOpen(state)
  ? `<a class="btn ${cls}" href="${esc(shortcutUrl())}">Open my apps</a>` : "";
const flame = n => `<span class="stat flame${n ? " lit" : ""}" title="${plural(n, "day")} streak"><i>🔥</i><b class="num">${n}</b></span>`;
const xpChip = () => { const l = S.level(state); return `<span class="stat xp" title="${l.xp} XP"><i>${BOLT}</i><b class="num">${l.xp}</b></span>`; };
const timeChip = () => { const o = S.isOpen(state); return `<span class="stat time${o ? " open" : ""}" data-timechip><i>${o ? "🔓" : "🔒"}</i><b class="num" data-clock>${o ? fmtClock(S.remainingMs(state)) : "Locked"}</b></span>`; };
const statsBar = title => `<header class="top"><div class="brand">${title ? esc(title) : `<span class="logo">${BOLT}</span>Stim`}</div><div class="stats">${flame(S.streak(state))}${xpChip()}${timeChip()}</div></header>`;
const backBar = (label, href = "#/") => `<header class="bar"><a class="xbtn" href="${href}" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></a><span class="bar-title">${esc(label)}</span>${timeChip()}</header>`;
const flowBar = (p, href) => `<header class="flowbar"><a class="xbtn" href="${href}" aria-label="Quit">✕</a><div class="pbar"><i style="width:${(clamp01(p) * 100).toFixed(1)}%"></i></div></header>`;
const setFlowBar = p => { const i = $(".flowbar .pbar i"); if (i) i.style.width = (clamp01(p) * 100).toFixed(1) + "%"; };

function earnLine() {
  const g = S.nextGrant(state);
  return g > 0 ? `Earns ${fmtMin(g)} of app time` : "Counts for your streak and XP. No time added right now";
}
function goalPips() {
  const n = S.doneCountToday(state), g = state.settings.goalPerDay;
  return `<div class="goal"><div class="goal-head"><b>Daily goal</b><span class="num">${Math.min(n, g)} / ${g}</span></div><div class="pips">${Array.from({ length: g }, (_, i) => `<i class="${i < n ? "on" : ""}" style="--i:${i}"></i>`).join("")}</div></div>`;
}

// ---------- what to offer ----------
const creditable = id => { const t = state.courses.done[id]; return !t || Date.now() - t > REVIEW_AFTER; };

function lessonItem(course) {
  let l = S.nextLesson(state, course), review = false;
  if (!l) { l = [...course.lessons].sort((a, b) => state.courses.done[a.id] - state.courses.done[b.id])[0]; review = true; if (!creditable(l.id)) return null; }
  const i = course.lessons.indexOf(l);
  return { key: l.id, cat: "learn", icon: course.icon, href: `#/lesson/${l.id}`, title: l.title, sub: `${course.tag} · ${review ? "Review" : `Lesson ${i + 1} of ${course.lessons.length}`}` };
}
function challengeItem(c) {
  const ch = scaled(c, state.settings.effort), done = c.daily && S.doneToday(state, c.id);
  const what = ch.type === "move" ? summary(ch) : ch.type === "breath" ? "Guided" : ch.type === "journal" ? `${ch.words} words` : ch.type === "math" ? `${ch.count} problems` : ch.type === "memory" ? `${ch.rounds} rounds` : "Read + quiz";
  return { key: c.id, cat: c.cat, icon: c.icon, href: `#/do/${c.id}`, title: c.title, sub: done ? "Done today" : `${what} · ~${ch.estMin} min`, done };
}
function candidates(cat, includeDone = false) {
  if (!state.settings.cats[cat]) return [];
  if (cat === "learn") return COURSES.filter(c => state.courses.enrolled.includes(c.id)).map(lessonItem).filter(Boolean);
  return CHALLENGES.filter(c => c.cat === cat && !state.settings.off[c.id]).map(challengeItem).filter(i => includeDone || !i.done);
}
let shuffleN = 0;
function suggestions() {
  const rnd = News.seeded(today() + "/" + state.log.length + "/" + shuffleN);
  return Object.keys(CATS).map(cat => { const list = candidates(cat); return list.length ? list[Math.floor(rnd() * list.length)] : null; }).filter(Boolean);
}
const card = (it, i = 0) => `<a class="ch cat-${it.cat}${it.done ? " is-done" : ""}" style="--i:${i}" href="${it.href}"><span class="ico">${it.icon}</span><span class="ch-main"><b>${esc(it.title)}</b><small>${esc(it.sub)}</small></span><span class="tag">${CATS[it.cat].name}</span></a>`;

// ---------- router ----------
let acts = {}, cleanup = [], token = 0, last = null;
const onLeave = fn => cleanup.push(fn);
const TAB = { "": "home", all: "home", learn: "learn", course: "learn", progress: "progress", settings: "settings" };

function route() {
  cleanup.splice(0).forEach(f => { try { f(); } catch {} });
  acts = {}; token++;
  const [name = "", arg] = path().split("/");
  const fn = ROUTES[name] || home;
  if (name !== "done") confettiRun++;
  document.body.classList.toggle("focus", ["do", "lesson", "done"].includes(name));
  $$("#tabs a").forEach(a => a.classList.toggle("on", a.dataset.tab === (TAB[name] ?? "home")));
  fn(decodeURIComponent(arg || ""));
  window.scrollTo(0, 0);
}

document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if (el) { ensureAudio(); (acts[el.dataset.act] || GLOBAL[el.dataset.act])?.(el, e); return; }
  const a = e.target.closest('a[href^="#/"]');
  if (a && !e.metaKey && !e.ctrlKey) { e.preventDefault(); ensureAudio(); go(a.getAttribute("href")); }
});

const GLOBAL = {
  shuffle() { shuffleN++; const l = $("#shuffle"); if (l) { l.innerHTML = suggestions().map(card).join(""); l.classList.remove("deal"); void l.offsetWidth; l.classList.add("deal"); } beep(700, 0.05, 0.08); },
  skip() { openSheet(); },
  relock() { S.relock(state); persist(); wasOpen = false; home(); if (state.settings.useShortcut) location.href = shortcutUrl(0); },
};

function draw(html, cls = "") {
  view.innerHTML = `<div class="page ${cls}">${html}</div>`;
  mount();
}

// ---------- Today ----------
function home() {
  const now = Date.now(), open = S.isOpen(state, now), g = S.nextGrant(state, now), x = state.settings, left = S.remainingMs(state, now);
  const sug = suggestions();
  const note = g === 0
    ? `<p class="note">${S.capLeft(state, now) === 0 ? `You've used today's ${fmtMin(x.dailyCapMin)} limit.` : `Your bank is full at ${fmtMin(x.maxBankMin)}.`} Challenges still count for your streak and XP.</p>`
    : g < x.sessionMin ? `<p class="note">The next challenge adds ${fmtMin(g)}, which takes you to your limit.</p>` : "";
  draw(`${statsBar()}
    <section class="hero${open ? " is-open" : ""}">
      ${ring(open ? left / (x.maxBankMin * 60000) : 0, open ? `<b class="num" data-clock>${fmtClock(left)}</b><small>left</small>` : `<span class="lock">🔒</span>`, "ring-hero")}
      <div class="hero-text">${open
        ? `<h1>Your apps are open</h1><p>When the clock hits zero, come back and take five.</p>`
        : `<h1>Earn your next <span class="num">${x.sessionMin}</span> minutes</h1><p>One short challenge for your body or your mind.</p>`}</div>
      ${open ? `<div class="hero-actions">${openAppsBtn()}<button class="link light" type="button" data-act="relock">Lock now</button></div>` : ""}
    </section>
    ${goalPips()}
    <section class="block">
      <div class="row"><h2>${open ? "Bank more time" : "Pick a challenge"}</h2>${sug.length ? `<button class="chipbtn" type="button" data-act="shuffle">🔀 Shuffle</button>` : ""}</div>
      ${note}
      <div class="list deal" id="shuffle">${sug.map(card).join("") || `<p class="empty">Nothing to offer. Turn on a category or a course in Settings.</p>`}</div>
      <a class="btn outline" href="#/all">All ${CHALLENGES.length + COURSES.reduce((n, c) => n + c.lessons.length, 0)} challenges</a>
    </section>
    ${open ? "" : `<button class="link" type="button" data-act="skip">Skip this one</button>`}`, "home");
}

function all() {
  const groups = Object.keys(CATS).map(cat => {
    const items = candidates(cat, true);
    return items.length ? `<h3 class="grp">${CATS[cat].icon} ${CATS[cat].name}<small>${items.length}</small></h3><div class="list deal">${items.map(card).join("")}</div>` : "";
  }).join("");
  draw(`${backBar("All challenges")}<p class="sub">${earnLine()}. Lessons show the next one from each course in your shuffle; open Learn for the rest.</p>${groups || `<p class="empty">Everything is switched off. Turn something on in Settings.</p>`}`);
}

// keep clocks and the lock state current
let wasOpen = S.isOpen(state);
setInterval(() => {
  const open = S.isOpen(state), ms = S.remainingMs(state);
  $$("[data-clock]").forEach(el => (el.textContent = open ? fmtClock(ms) : el.closest("[data-timechip]") ? "Locked" : "0:00"));
  const hr = $(".ring-hero"); if (hr && open) setRing(hr, ms / (state.settings.maxBankMin * 60000));
  if (wasOpen !== open) {
    if (!open) { beep(660, 0.25); setTimeout(() => beep(440, 0.4), 260); }
    $$("[data-timechip]").forEach(el => { el.classList.toggle("open", open); el.firstElementChild.textContent = open ? "🔓" : "🔒"; });
    if (!path()) home();
  }
  wasOpen = open;
  document.title = open ? `${fmtClock(ms)} · Stim` : "Stim";
}, 1000);

// ---------- finishing ----------
function complete({ id, cat, title, detail = "", started, bonus = 0, reps, after }) {
  const before = S.level(state), streakBefore = S.streak(state), goalBefore = S.doneCountToday(state);
  const entry = S.grant(state, { id, cat, title, kind: "done", spentMs: started ? Date.now() - started : 0, detail, bonus });
  for (const [k, n] of Object.entries(reps || {})) state.totals[k] = (state.totals[k] || 0) + n;
  after?.();
  persist(); wasOpen = S.isOpen(state);
  last = { entry, before, streakBefore, goalBefore };
  keepAwake(false);
  go("#/done");
}

function done() {
  if (!last) return go("#/");
  const e = last.entry, skip = e.kind === "skip", st = S.streak(state), lv = S.level(state), g = state.settings.goalPerDay, n = S.doneCountToday(state);
  const levelUp = !skip && lv.level > last.before.level, goalHit = !skip && last.goalBefore < g && n >= g;
  const why = e.min ? "" : S.capLeft(state) === 0 ? `You're at today's ${fmtMin(state.settings.dailyCapMin)} limit, so no time was added.` : `Your bank is full at ${fmtMin(state.settings.maxBankMin)}, so no time was added.`;
  draw(`<div class="done-icon${skip ? " skip" : ""}">${skip ? "⏭️" : levelUp ? "🏆" : goalHit ? "🎯" : "⚡"}</div>
    <p class="eyebrow">${skip ? "Skipped" : levelUp ? `Level ${lv.level}!` : goalHit ? "Daily goal hit" : "Challenge complete"}</p>
    <h1 class="mega">${e.min ? `<span data-count="${e.min}" data-pre="+">+0</span> min` : skip ? "No time" : "Logged"}</h1>
    <p class="sub center">${skip ? "Skips don't count for your streak." : `${esc(e.title)}${e.detail ? ` · ${esc(e.detail)}` : ""}. ${why}`}</p>
    <div class="tiles three rise">
      <div class="tile t-xp" style="--i:0"><small>XP</small><b class="num" data-count="${e.xp || 0}" data-pre="+">+0</b></div>
      <div class="tile t-streak" style="--i:1"><small>Streak</small><b class="num"><span data-count="${st}" data-from="${skip ? st : last.streakBefore}">${st}</span> 🔥</b></div>
      <div class="tile t-time" style="--i:2"><small>App time</small><b class="num" data-clock>${fmtClock(S.remainingMs(state))}</b></div>
    </div>
    ${skip ? "" : `<div class="lvl card pad"><div class="row"><b>Level ${lv.level}</b><span class="num mini">${lv.into} / ${lv.need} XP</span></div><div class="pbar big"><i style="width:${levelUp ? 0 : last.before.into}%" data-w="${lv.into}"></i></div></div>${goalPips()}`}
    <div class="stack">${openAppsBtn("primary")}<a class="btn ${S.isOpen(state) && state.settings.useShortcut ? "outline" : "primary"}" href="#/">${S.nextGrant(state) > 0 ? "Do another to bank more" : "Back to Stim"}</a></div>`, `donepage${skip ? " is-skip" : ""}`);
  if (!skip) { fanfare(); confetti(); }
}

// ---------- skip sheet ----------
const sheet = $("#sheet"), scrim = $("#scrim");
let ask = 0;
const ASKS = () => [
  ["Are you sure?", "Skipping opens your apps without doing anything for it.", "Yes, skip"],
  ["Are you really sure?", "The shortest challenge takes about three minutes.", "Yes, really"],
  ["Last chance.", `A skip gives you ${fmtMin(S.nextGrant(state))}, no XP, and is marked on your week.`, "Skip and unlock"],
];
function paintSheet() {
  const [q, sub, yes] = ASKS()[ask];
  sheet.dataset.step = ask + 1; $("#sheetQ").textContent = q; $("#sheetSub").textContent = sub; $("#sheetYes").textContent = yes;
}
function openSheet() {
  ask = 0; paintSheet(); scrim.hidden = sheet.hidden = false;
  requestAnimationFrame(() => { scrim.classList.add("on"); sheet.classList.add("on"); $("#sheetNo").focus(); });
}
function closeSheet() {
  scrim.classList.remove("on"); sheet.classList.remove("on");
  setTimeout(() => { scrim.hidden = sheet.hidden = true; }, reduceMotion ? 0 : 350);
}
$("#sheetNo").onclick = scrim.onclick = closeSheet;
document.addEventListener("keydown", e => { if (e.key === "Escape" && !sheet.hidden) closeSheet(); });
$("#sheetYes").onclick = () => {
  if (++ask < 3) return paintSheet();
  closeSheet();
  last = { entry: S.grant(state, { id: "skip", cat: "skip", title: "Skipped", kind: "skip" }), before: S.level(state), streakBefore: S.streak(state), goalBefore: 0 };
  persist(); wasOpen = S.isOpen(state);
  go("#/done");
};

// ---------- challenge runners ----------
function doChallenge(id) {
  const base = byId(id);
  if (!base) return go("#/");
  const ch = scaled(base, state.settings.effort);
  ({ move: moveView, breath: breathView, journal: journalView, math: mathView, memory: memoryView, feed: feedView })[ch.type](ch);
}
const intro = (ch, extra = "") => `${backBar(CATS[ch.cat].name)}<div class="hello cat-${ch.cat}"><span class="bigico">${ch.icon}</span><h1 class="title">${esc(ch.title)}</h1><p class="sub center">${earnLine()}</p></div>${extra}`;

// Move: a list of camera stations (reps, holds, rests). Falls back to tap/timer if the camera can't be used.
function moveView(ch) {
  const st = ch.stations, work = st.filter(s => !s.rest), stage = $("#stage");
  const canCam = !!(state.settings.camera && navigator.mediaDevices?.getUserMedia);
  let i = 0, n = 0, heldMs = 0, restMs = 0, started = 0, mode = "intro", cam = null, MODES = null, holding = false, lastTap = 0, finished = false;
  const reps = {};
  const cur = () => st[i];
  const workIdx = () => work.indexOf(cur()) + 1 || work.indexOf(st[i + 1]) + 1;
  const overall = () => { const per = 1 / st.length, s = cur(); const frac = s.rest ? 1 - restMs / (s.rest * 1000) : s.reps ? n / s.reps : heldMs / (s.s * 1000); return clamp01((i + clamp01(frac)) * per); };
  const target = s => (s.reps ? `× ${s.reps}` : s.rest ? `${s.rest}s` : `${s.s}s`);

  const paintIntro = (err = "") => draw(intro(ch, `
    <ol class="stations">${st.map(s => `<li class="${s.rest ? "rest" : ""}"><span>${esc(stationLabel(s))}</span><b class="num">${target(s)}</b></li>`).join("")}</ol>
    <div class="tipbox"><b>📱 Set up</b><p>${esc(MODESetup(ch))}${ch.tip ? " " + esc(ch.tip) : ""}</p></div>
    ${err ? `<p class="err">${esc(err)}</p>` : ""}
    <div class="stack">${canCam ? `<button class="btn primary" type="button" data-act="cam">Start camera</button>` : ""}
    ${!canCam || err ? `<button class="btn ${canCam ? "outline" : "primary"}" type="button" data-act="manual">Start without the camera</button>` : ""}</div>
    ${canCam ? "" : `<p class="mini center">Camera tracking is ${state.settings.camera ? "not available in this browser" : "turned off in Settings"}.</p>`}`), "runner");

  const enter = () => {
    n = 0; heldMs = 0; holding = false; const s = cur();
    restMs = s.rest ? s.rest * 1000 : 0;
    if (mode === "cam") { cam.setMode(s.rest ? null : s.pose); paintStage(true); } else paintManual();
  };
  const advance = () => {
    const s = cur(); if (s.reps) reps[s.pose] = (reps[s.pose] || 0) + s.reps;
    if (++i >= st.length) return finish();
    cur().rest ? beep(520, 0.25) : good(); buzz(80); enter();
  };
  const finish = () => {
    if (finished) return; finished = true; stopCam();
    complete({ id: ch.id, cat: ch.cat, title: ch.title, detail: summary(ch) + (mode === "cam" ? "" : " · no camera"), started, reps, bonus: mode === "cam" ? 5 : 0 });
  };

  // ---- camera mode ----
  const stopCam = () => { cam?.stop(); cam = null; stage.hidden = true; keepAwake(false); };
  const paintStage = full => {
    const s = cur();
    $("#camBar").style.width = (overall() * 100).toFixed(1) + "%";
    $("#camStep").textContent = work.length > 1 ? `${workIdx()} / ${work.length}` : ch.title;
    $("#camRest").hidden = !s.rest;
    if (s.rest) { $("#camRestN").textContent = fmtClock(restMs); $("#camRestNext").textContent = `Next: ${stationLabel(st[i + 1])} ${target(st[i + 1])}`; return; }
    if (full) {
      $("#camLabel").textContent = stationLabel(s);
      $("#camRing").innerHTML = ring(0, `<b class="num">0</b><small>${s.reps ? `of ${s.reps}` : "sec"}</small>`, "ring-sm on-dark", true);
      const m = MODES[s.pose]; $("#camMeterBox").hidden = m.kind !== "rep";
      if (m.kind === "rep") { const pc = v => clamp01((v - m.min) / (m.max - m.min)) * 100; $("#mkDown").style.left = pc(m.lo) + "%"; $("#mkUp").style.left = pc(m.hi) + "%"; }
      setCue("idle", s.cue || "Get in position");
    }
    const r = $("#camRing .ring");
    s.reps ? setRing(r, n / s.reps, n) : setRing(r, heldMs / (s.s * 1000), Math.ceil((s.s * 1000 - heldMs) / 1000));
  };
  const setCue = (kind, text) => { const c = $("#camCue"); c.className = "cue " + kind; c.textContent = text; };
  const onFrame = (r, dt) => {
    if (mode !== "cam" || finished) return;
    const s = cur(), hint = $("#camHint");
    if (s.rest) { restMs -= dt; if (restMs <= 0) return advance(); return paintStage(); }
    const m = MODES[s.pose];
    hint.hidden = r.state !== "lost"; if (r.state === "lost") { hint.textContent = r.hint; setCue("idle", "Adjust your position"); return; }
    if (s.reps) {
      if (r.state === "idle") return setCue("idle", "Get in position");
      $("#camMeter").style.width = r.pct + "%";
      if (r.wentDown) beep(440, 0.05, 0.1);
      if (r.rep) { n++; paintStage(); pop($("#camRing .ring")); if (n >= s.reps) return advance(); n % 10 === 0 ? beep(1320, 0.14) : beep(880); }
      setCue(r.state, m.cues[r.state === "down" ? 1 : 0]);
    } else {
      if (r.holding) { heldMs += dt; if (!holding) beep(880, 0.06); if (heldMs >= s.s * 1000) return advance(); }
      holding = r.holding; setCue(holding ? "up" : "idle", holding ? (s.cue || m.cue) : `Get into ${stationLabel(s).toLowerCase()} position`);
      paintStage();
    }
  };

  // ---- manual mode ----
  let ticker = null, running = false;
  const paintManual = () => {
    const s = cur();
    draw(`${flowBar(overall(), "#/")}
      <p class="eyebrow center">${work.length > 1 ? `${s.rest ? "Rest" : `Station ${workIdx()} of ${work.length}`}` : esc(ch.title)}</p>
      <h1 class="title center">${esc(stationLabel(s))}</h1>
      <div class="center cat-move" id="mRing">${ring(s.reps ? n / s.reps : s.rest ? 1 - restMs / (s.rest * 1000) : heldMs / (s.s * 1000), `<b class="num">${s.reps ? n : Math.ceil(((s.rest || s.s) * 1000 - (s.rest ? s.rest * 1000 - restMs : heldMs)) / 1000)}</b><small>${s.reps ? `of ${s.reps}` : "sec"}</small>`, "ring-lg", true)}</div>
      <p class="sub center">${s.rest ? `Next: ${esc(stationLabel(st[i + 1]))}` : esc(s.cue || (s.reps ? "Tap once for every rep." : "Hold the position while the clock runs."))}</p>
      ${s.reps ? `<button class="tapbtn" type="button" data-act="tap">+1</button>` : s.rest ? "" : `<div class="stack"><button class="btn primary" type="button" data-act="hold">${running ? "Pause" : heldMs ? "Resume" : "Start hold"}</button></div>`}`, "runner");
  };
  const tick = () => {
    if (mode !== "manual" || finished) return;
    const s = cur();
    if (s.rest) { restMs -= 100; if (restMs <= 0) return advance(); }
    else if (s.s && running) { heldMs += 100; if (heldMs >= s.s * 1000) { running = false; return advance(); } }
    else return;
    setRing($("#mRing .ring"), s.rest ? 1 - restMs / (s.rest * 1000) : heldMs / (s.s * 1000), Math.ceil((s.rest ? restMs : s.s * 1000 - heldMs) / 1000));
    setFlowBar(overall());
  };
  const goManual = () => { stopCam(); mode = "manual"; started ||= Date.now(); ticker ||= setInterval(tick, 100); keepAwake(true); paintManual(); };

  onLeave(() => { finished = true; stopCam(); clearInterval(ticker); keepAwake(false); });
  Object.assign(acts, {
    manual: goManual,
    tap() {
      const t = performance.now(), s = cur(); if (!s.reps || t - lastTap < 180) return; lastTap = t;
      n++; const r = $("#mRing .ring"); setRing(r, n / s.reps, n); pop(r); buzz(10); setFlowBar(overall());
      if (n >= s.reps) return advance();
      beep(n % 10 === 0 ? 1320 : 880, 0.06);
    },
    hold(btn) { running = !running; btn.textContent = running ? "Pause" : "Resume"; if (running) beep(1040, 0.12); },
    async cam(btn) {
      const my = token; btn.disabled = true; btn.textContent = "Starting camera…"; started ||= Date.now();
      try {
        const P = await import("./pose.js"); MODES = P.MODES;
        cam = new P.PoseCamera({ video: $("#video"), canvas: $("#canvas"), onFrame });
        $("#camPaused").hidden = true; $("#camHint").hidden = true; $("#camRest").hidden = true;
        mode = "cam"; stage.hidden = false; enter(); setCue("idle", "Starting camera…");
        await cam.start(msg => setCue("idle", msg));
        if (my !== token) return stopCam();
        setCue("idle", cur().cue || "Get in position"); keepAwake(true);
      } catch (e) {
        stopCam(); if (my !== token) return; mode = "intro";
        paintIntro(e?.name === "NotAllowedError" ? "Camera access is blocked. Allow it in your browser settings and try again, or carry on without it."
          : `Couldn't start the camera (${e?.message || e}). You can carry on without it.`);
      }
    },
  });
  $("#camClose").onclick = () => { cam?.pause(); $("#camPaused").hidden = false; };
  $("#camResume").onclick = () => { $("#camPaused").hidden = true; cam?.resume(); };
  $("#camManual").onclick = goManual;
  $("#camQuit").onclick = () => go("#/");
  paintIntro();
}
// setup tip for the first station, without loading the pose module up front
const SETUPS = { floor: "Prop the phone on the floor about 2 m to your side, front camera facing you.", side: "Stand the phone 2–3 m away and turn side-on to it.", front: "Stand the phone 2–3 m away and face it, whole body in frame.", any: "Stand the phone where it can see your whole body." };
const VIEW = { pushup: "floor", situp: "floor", bridge: "floor", plank: "floor", bridgehold: "floor", squat: "side", lunge: "side", burpee: "side", goodmorning: "side", wallsit: "side", lungehold: "side", jacks: "front", highknees: "front", balance: "front", present: "any" };
const MODESetup = ch => { const v = [...new Set(ch.stations.filter(s => s.pose).map(s => VIEW[s.pose]))]; return v.length === 1 ? SETUPS[v[0]] : SETUPS.any + " You'll turn side-on or face it as each station asks."; };

// Box breathing
function breathView(ch) {
  const total = ch.seconds * 1000, PH = ["Breathe in", "Hold", "Breathe out", "Hold"];
  let spent = 0, running = false, started = 0, prev = 0, lastPh = -1;
  draw(`${flowBar(0, "#/")}<div class="hello cat-mind"><h1 class="title">${esc(ch.title)}</h1><p class="sub center">In for 4, hold 4, out for 4, hold 4. ${earnLine()}.</p></div>
    <div class="center cat-mind"><div class="orb" id="orb"><span id="orbText">Ready</span></div></div>
    <p class="steplabel num" id="left">${fmtClock(total)}</p>
    <div class="stack"><button class="btn primary" type="button" data-act="toggle" id="tBtn">Start</button></div>`, "runner");
  const setRun = on => {
    running = on; prev = performance.now(); $("#tBtn").textContent = on ? "Pause" : spent ? "Resume" : "Start"; keepAwake(on);
    if (!on) { lastPh = -1; $("#orb").dataset.ph = ""; $("#orbText").textContent = spent ? "Paused" : "Ready"; }
  };
  const timer = setInterval(() => {
    if (!running) return;
    const t = performance.now(); spent = Math.min(total, spent + Math.min(1000, t - prev)); prev = t;
    if (spent >= total) { clearInterval(timer); return complete({ id: ch.id, cat: ch.cat, title: ch.title, detail: fmtMin(Math.round(total / 60000)), started, bonus: 3 }); }
    const ph = Math.floor(spent / 4000) % 4;
    if (ph !== lastPh) { lastPh = ph; $("#orbText").textContent = PH[ph]; $("#orb").dataset.ph = ph; beep(ph % 2 ? 520 : 660, 0.05, 0.05); }
    $("#left").textContent = fmtClock(total - spent); setFlowBar(spent / total);
  }, 100);
  const hide = () => { if (document.hidden && running) setRun(false); };
  document.addEventListener("visibilitychange", hide);
  onLeave(() => { clearInterval(timer); document.removeEventListener("visibilitychange", hide); keepAwake(false); });
  acts.toggle = () => { started ||= Date.now(); setRun(!running); };
}

// Writing prompts
function journalView(ch) {
  const list = PROMPTS[ch.prompts]; let p = hash(today() + ch.id) % list.length; const started = Date.now();
  draw(`${intro(ch)}<blockquote class="prompt cat-mind" id="prompt"></blockquote>
    ${list.length > 1 ? `<button class="link left" type="button" data-act="another">Different prompt</button>` : ""}
    <textarea id="jtext" rows="8" placeholder="Start anywhere." aria-labelledby="prompt"></textarea>
    <div class="pbar"><i id="jbar"></i></div>
    <div class="row"><span class="mini num" id="wc"></span><span class="mini">Saved on this phone only</span></div>
    <div class="stack"><button class="btn primary" type="button" data-act="save" id="jBtn" disabled>Done</button></div>`, "runner");
  const ta = $("#jtext"), words = () => (ta.value.trim().match(/\S+/g) || []).length;
  const upd = () => { const w = words(); $("#wc").textContent = `${w} / ${ch.words} words`; $("#jbar").style.width = clamp01(w / ch.words) * 100 + "%"; $("#jBtn").disabled = w < ch.words; };
  const setPrompt = () => ($("#prompt").textContent = list[p]);
  ta.oninput = upd; setPrompt(); upd();
  acts.another = () => { p = (p + 1) % list.length; setPrompt(); };
  acts.save = () => {
    const w = words(); if (w < ch.words) return;
    complete({ id: ch.id, cat: ch.cat, title: ch.title, detail: `${w} words`, started, bonus: 3, after() {
      state.journal.push({ t: Date.now(), prompt: list[p], text: ta.value.trim() });
      if (state.journal.length > 200) state.journal.splice(0, state.journal.length - 200);
    } });
  };
}

// Mental math
function mathView(ch) {
  const rnd = Math.random, ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const gen = () => {
    const k = ri(0, 3);
    if (k === 0) { const a = ri(12, 99), b = ri(12, 99); return [`${a} + ${b}`, a + b]; }
    if (k === 1) { const a = ri(30, 99), b = ri(11, a - 1); return [`${a} − ${b}`, a - b]; }
    if (k === 2) { const a = ri(3, 12), b = ri(3, 12); return [`${a} × ${b}`, a * b]; }
    const b = ri(3, 12), q = ri(3, 12); return [`${b * q} ÷ ${b}`, q];
  };
  let k = 0, slips = 0, input = "", cur = gen(), started = 0;
  draw(`${flowBar(0, "#/")}<p class="eyebrow center">${esc(ch.title)} · <span id="mk" class="num">1</span> of ${ch.count}</p>
    <div class="problem num" id="prob"></div><div class="answer num" id="ans"></div>
    <div class="keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "✓"].map(x => `<button type="button" class="key${x === "✓" ? " ok" : ""}" data-act="key" data-k="${x}">${x}</button>`).join("")}</div>`, "runner mathpage");
  const paint = () => { $("#prob").textContent = cur[0]; $("#ans").textContent = input || " "; $("#ans").classList.toggle("empty", !input); };
  const submit = () => {
    if (!input) return;
    if (+input === cur[1]) {
      k++; good(); setFlowBar(k / ch.count); pop($("#prob"));
      if (k >= ch.count) return complete({ id: ch.id, cat: ch.cat, title: ch.title, detail: `${k} solved, ${plural(slips, "slip")}`, started, bonus: slips === 0 ? 5 : slips <= 2 ? 3 : 0 });
      cur = gen(); input = ""; $("#mk").textContent = k + 1;
    } else { slips++; bad(); shake($("#ans")); input = ""; }
    paint();
  };
  acts.key = el => {
    started ||= Date.now(); const x = el.dataset.k;
    if (x === "✓") return submit();
    input = x === "⌫" ? input.slice(0, -1) : (input + x).slice(0, 4); paint();
  };
  const onKey = e => { if (/^\d$/.test(e.key)) acts.key({ dataset: { k: e.key } }); else if (e.key === "Enter") submit(); else if (e.key === "Backspace") acts.key({ dataset: { k: "⌫" } }); };
  document.addEventListener("keydown", onKey); onLeave(() => document.removeEventListener("keydown", onKey));
  paint();
}

// Sequence memory
function memoryView(ch) {
  let round = 1, seq = [], pos = 0, showing = false, fails = 0, started = 0, alive = true;
  onLeave(() => (alive = false));
  const len = () => Math.min(9, 2 + round), sleep = ms => new Promise(r => setTimeout(r, ms));
  draw(`${flowBar(0, "#/")}<div class="hello cat-mind"><h1 class="title">${esc(ch.title)}</h1><p class="sub center" id="msg">Watch the tiles light up, then tap them in the same order.</p></div>
    <p class="eyebrow center">Round <span id="rd" class="num">1</span> of ${ch.rounds}</p>
    <div class="grid9 cat-mind" id="grid">${Array.from({ length: 9 }, (_, i) => `<button type="button" class="cell" data-act="cell" data-i="${i}" aria-label="Tile ${i + 1}"></button>`).join("")}</div>
    <div class="stack"><button class="btn primary" type="button" data-act="go" id="goBtn">Start</button></div>`, "runner");
  const cells = $$("#grid .cell"), msg = t => ($("#msg").textContent = t);
  const flash = async (i, cls = "lit", ms = 420) => { cells[i].classList.add(cls); beep(440 + i * 70, 0.12, 0.1); await sleep(ms); cells[i].classList.remove(cls); await sleep(140); };
  const play = async () => {
    showing = true; pos = 0; $("#goBtn").hidden = true; $("#rd").textContent = round; msg(`Watch: ${len()} tiles`);
    seq = []; while (seq.length < len()) { const x = Math.floor(Math.random() * 9); if (x !== seq[seq.length - 1]) seq.push(x); }
    await sleep(500);
    for (const i of seq) { if (!alive) return; await flash(i); }
    showing = false; msg("Your turn");
  };
  acts.go = () => { started ||= Date.now(); play(); };
  acts.cell = async el => {
    if (showing || !seq.length) return;
    const i = +el.dataset.i;
    if (i !== seq[pos]) { fails++; bad(); shake($("#grid")); seq = []; msg("Not quite. Watch again."); await sleep(900); return alive && play(); }
    el.classList.add("hit"); setTimeout(() => el.classList.remove("hit"), 200); beep(440 + i * 70, 0.1, 0.1);
    if (++pos < seq.length) return;
    seq = []; good(); setFlowBar(round / ch.rounds);
    if (round >= ch.rounds) return complete({ id: ch.id, cat: ch.cat, title: ch.title, detail: `${ch.rounds} rounds, ${fails} ${fails === 1 ? "miss" : "misses"}`, started, bonus: fails === 0 ? 5 : fails <= 2 ? 3 : 0 });
    round++; msg("Nice. Next round."); await sleep(700); alive && play();
  };
}

// Daily feed (news / on this day)
const DAILY_KEY = "stim.daily";
async function getDaily(kind) {
  const day = News.feedDate();
  let cache = null; try { cache = JSON.parse(localStorage.getItem(DAILY_KEY)); } catch {}
  if (cache?.date !== day) {
    const feed = await News.fetchFeed();
    cache = { date: day, news: News.buildBriefing(feed, day), onthisday: News.buildOnThisDay(feed, day) };
    try { localStorage.setItem(DAILY_KEY, JSON.stringify(cache)); } catch {}
  }
  return cache[kind];
}
async function feedView(ch) {
  const my = token;
  if (S.doneToday(state, ch.id)) return draw(`${intro(ch)}<p class="note">You've already done this one today. There's a fresh one tomorrow.</p><div class="stack"><a class="btn primary" href="#/all">Pick something else</a></div>`, "runner");
  draw(`${intro(ch)}<p class="sub center loading">Fetching today's stories</p>`, "runner");
  let lesson = null;
  try { lesson = await getDaily(ch.feed); } catch {}
  if (my !== token) return;
  if (!lesson) {
    draw(`${intro(ch)}<p class="err">Couldn't load today's stories. Check your connection, or pick a different challenge.</p><div class="stack"><button class="btn primary" type="button" data-act="retry">Try again</button><a class="btn outline" href="#/all">Pick something else</a></div>`, "runner");
    acts.retry = () => feedView(ch); return;
  }
  flow({ kicker: lesson.kicker, title: lesson.title, cards: lesson.blocks, quiz: lesson.quiz.map(q => ({ q: q.q, right: q.o[q.a], wrong: q.o.filter((_, i) => i !== q.a), why: q.why, keepOrder: ch.feed === "onthisday" })), source: lesson.source },
    { cat: "news", id: ch.id, title: ch.title, back: "#/", credit: true, color: "" });
}

// Course lesson: cards, its questions, up to two from earlier lessons, then a one-line recap
function lessonRoute(id) {
  const f = findLesson(id);
  if (!f) return go("#/learn");
  const { course, lesson, index } = f;
  const rnd = News.seeded(id + today());
  const earlier = News.shuffle(course.lessons.slice(0, index).filter(l => S.lessonDone(state, l.id)).flatMap(l => l.quiz.map(q => ({ ...q, tag: `From earlier: ${l.title}` }))), rnd).slice(0, 2);
  flow({
    kicker: `${course.tag} · Lesson ${index + 1} of ${course.lessons.length}`, title: lesson.title, icon: course.icon,
    cards: lesson.body.map(p => ({ p })), takeaway: lesson.takeaway, quiz: [...lesson.quiz, ...earlier], myNote: state.notes?.[lesson.id],
  }, {
    cat: "learn", id: lesson.id, title: lesson.title, back: `#/course/${course.id}`, credit: creditable(lesson.id), recap: true, color: course.color,
    after(note) { state.courses.done[lesson.id] = Date.now(); if (note) (state.notes ||= {})[lesson.id] = note; },
  });
}

/** One-thing-per-screen lesson flow: cards → questions (missed ones return) → recap. */
function flow(lesson, meta) {
  const started = Date.now(), rnd = News.seeded(meta.id + today());
  const quiz = lesson.quiz.map(q => ({ ...q, o: q.keepOrder ? [q.right, ...q.wrong].sort((a, b) => parseInt(a) - parseInt(b) || a.localeCompare(b)) : News.shuffle([q.right, ...q.wrong], rnd) }));
  const cards = [{ cover: true }, ...lesson.cards, ...(lesson.takeaway ? [{ takeaway: lesson.takeaway }] : [])];
  const total = cards.length + quiz.length + (meta.recap ? 1 : 0), RECAP_WORDS = 12;
  let ci = 0, queue = quiz.map((_, i) => i), seen = new Set(), firstTry = 0, picked = null, timer = null, doneUnits = 0;
  const style = meta.color ? ` style="--c:${meta.color};--c-d:color-mix(in srgb,${meta.color} 78%,#000);--c-soft:color-mix(in srgb,${meta.color} 14%,var(--card))"` : "";
  const frame = (body, foot, cls = "") => {
    view.innerHTML = `<div class="page flow cat-${meta.cat} ${cls}"${style}>${flowBar(doneUnits / total, meta.back)}<div class="flow-body">${body}</div><footer class="flow-foot" id="foot">${foot}</footer></div>`;
    window.scrollTo(0, 0);
  };
  onLeave(() => clearInterval(timer));

  const showCard = () => {
    const c = cards[ci], words = ((c.p || "") + " " + (c.note || "") + (c.takeaway || "")).split(/\s+/).length;
    const body = c.cover
      ? `<div class="cover"><span class="bigico">${lesson.icon || CATS[meta.cat].icon}</span><p class="eyebrow">${esc(lesson.kicker)}</p><h1 class="title">${esc(lesson.title)}</h1>
          <p class="sub center">${lesson.cards.length} short reads, ${plural(quiz.length, "question")}${meta.recap ? ", one recap" : ""}.</p>
          ${meta.credit ? "" : `<p class="note">You finished this in the last week, so this is a review. It won't add app time.</p>`}
          ${lesson.myNote ? `<div class="tipbox"><b>Your note from last time</b><p>${esc(lesson.myNote)}</p></div>` : ""}</div>`
      : c.takeaway ? `<div class="readcard take"><p class="eyebrow">Takeaway</p><p class="lead">${esc(c.takeaway)}</p></div>`
      : `<div class="readcard"><p class="eyebrow">${c.h ? esc(c.h) : `${ci} of ${lesson.cards.length}`}</p><p class="read">${esc(c.p)}</p>${c.note ? `<p class="bg">${esc(c.note)}</p>` : ""}${c.link ? `<p class="src"><a href="${esc(c.link)}" target="_blank" rel="noopener">${esc(c.linkText || "Read more")} ↗</a></p>` : ""}</div>`;
    frame(body, `<button class="btn primary fill" type="button" data-act="next" id="nBtn"><i></i><span>${c.cover ? "Start" : "Continue"}</span></button>`);
    // minimum time on each card, shown as the button filling up
    const need = !c.cover && state.settings.readTimer ? Math.max(1500, Math.min(12000, words * 150)) : 0, btn = $("#nBtn");
    if (need) {
      btn.disabled = true; let el = 0; const bar = $("i", btn);
      clearInterval(timer);
      timer = setInterval(() => { if (document.hidden) return; el += 100; bar.style.width = Math.min(100, el / need * 100) + "%"; if (el >= need) { clearInterval(timer); btn.disabled = false; btn.classList.add("ready"); } }, 100);
    } else btn.classList.add("ready");
  };

  const showQ = () => {
    const i = queue[0], q = quiz[i], retry = seen.has(i); picked = null;
    frame(`<p class="eyebrow">${retry ? "Try this one again" : q.tag ? esc(q.tag) : `Question ${seen.size + 1} of ${quiz.length}`}</p>
      <h2 class="question">${esc(q.q)}</h2>
      <div class="opts">${q.o.map((o, k) => `<button class="opt" type="button" data-act="pick" data-k="${k}" style="--i:${k}">${esc(o)}</button>`).join("")}</div>`,
      `<button class="btn primary" type="button" data-act="check" id="cBtn" disabled>Check</button>`, "quiz");
  };

  const showRecap = () => {
    frame(`<p class="eyebrow">Last step</p><h2 class="question">In a sentence or two, what was the main idea?</h2>
      <p class="sub">From memory, in your own words. Saying it back is what makes it stick.</p>
      <textarea id="recap" rows="5" placeholder="The main idea is…"></textarea><span class="mini num" id="rc"></span>`,
      `<button class="btn primary" type="button" data-act="recapDone" id="rBtn" disabled>Finish</button>`, "quiz");
    const ta = $("#recap"), upd = () => { const w = count(ta.value); $("#rc").textContent = `${w} / ${RECAP_WORDS} words`; $("#rBtn").disabled = w < RECAP_WORDS; };
    ta.oninput = upd; upd();
  };
  const count = t => (t.match(/\S+/g) || []).length;
  const finish = note => {
    if (!meta.credit) { meta.after?.(note); persist(); return go(meta.back || "#/"); }
    const acc = quiz.length ? firstTry / quiz.length : 1;
    complete({ id: meta.id, cat: meta.cat, title: meta.title, detail: `${firstTry}/${quiz.length} first try`, started, bonus: Math.round(acc * 5), after: () => meta.after?.(note) });
  };
  const afterQuiz = () => (queue.length ? showQ() : meta.recap ? showRecap() : finish());

  Object.assign(acts, {
    next() { doneUnits++; if (++ci < cards.length) return showCard(); queue.length ? showQ() : afterQuiz(); },
    pick(el) { if (picked === "locked") return; picked = +el.dataset.k; $$(".opt", view).forEach(b => b.classList.toggle("sel", b === el)); $("#cBtn").disabled = false; beep(600, 0.03, 0.06); },
    check() {
      if (picked == null || picked === "locked") return;
      const i = queue[0], q = quiz[i], right = q.o[picked] === q.right, k = picked; picked = "locked";
      $$(".opt", view).forEach((b, j) => { b.disabled = true; if (q.o[j] === q.right) b.classList.add("right"); else if (j === k) b.classList.add("wrong"); });
      if (right && !seen.has(i)) firstTry++;
      seen.add(i); queue.shift(); if (right) doneUnits++; else queue.push(i);
      setFlowBar(doneUnits / total); right ? good() : bad();
      const foot = $("#foot"); foot.className = `flow-foot ${right ? "good" : "bad"}`;
      foot.innerHTML = `<div class="verdict"><b>${right ? ["Correct!", "Nice!", "Got it!", "Exactly."][seen.size % 4] : "Not quite"}</b><p>${esc(q.why)}${right ? "" : " This one comes back."}</p></div><button class="btn ${right ? "good" : "bad"}" type="button" data-act="cont">Continue</button>`;
      $("[data-act=cont]").focus();
    },
    cont: afterQuiz,
    recapDone() { const t = $("#recap").value.trim(); if (count(t) >= RECAP_WORDS) { doneUnits++; finish(t); } },
  });
  showCard();
}

// ---------- Learn ----------
function learn() {
  draw(`${statsBar("Learn")}
    <p class="sub">${COURSES.length} courses, ${COURSES.reduce((n, c) => n + c.lessons.length, 0)} lessons. Star the ones you want in your shuffle.</p>
    <div class="courses">${COURSES.map((c, i) => {
      const d = S.courseProgress(state, c), on = state.courses.enrolled.includes(c.id), full = d === c.lessons.length;
      return `<div class="ctile${on ? " on" : ""}" style="--c:${c.color};--i:${i}">
        <a class="ctile-main" href="#/course/${c.id}"><span class="cicon">${c.icon}</span><b>${esc(c.title)}</b><small>${esc(c.tag)}</small>
        <div class="pbar"><i data-w="${d / c.lessons.length * 100}"></i></div><small class="num">${full ? "Complete ✓" : `${d} / ${c.lessons.length}`}</small></a>
        <button class="star" type="button" data-act="enroll" data-id="${c.id}" aria-pressed="${on}" aria-label="${on ? "Remove from" : "Add to"} shuffle">${on ? "★" : "☆"}</button></div>`;
    }).join("")}</div>`, "learnpage");
  acts.enroll = el => {
    S.toggleEnroll(state, el.dataset.id); persist();
    const on = state.courses.enrolled.includes(el.dataset.id);
    el.textContent = on ? "★" : "☆"; el.setAttribute("aria-pressed", on); el.closest(".ctile").classList.toggle("on", on); pop(el); beep(on ? 880 : 500, 0.05, 0.08);
  };
}

function course(id) {
  const c = courseById(id);
  if (!c) return go("#/learn");
  const nxt = S.nextLesson(state, c), d = S.courseProgress(state, c), on = state.courses.enrolled.includes(c.id);
  const X = [0, 44, 64, 44, 0, -44, -64, -44];
  draw(`${backBar(c.tag, "#/learn")}
    <div class="chead" style="--c:${c.color}"><span class="bigico">${c.icon}</span><div><h1 class="title">${esc(c.title)}</h1><p>${esc(c.blurb)}</p></div>
      <div class="pbar on-color"><i data-w="${d / c.lessons.length * 100}"></i></div><div class="row"><small class="num">${d} of ${c.lessons.length} lessons</small><button class="chipbtn" type="button" data-act="enroll">${on ? "★ In my shuffle" : "☆ Add to shuffle"}</button></div></div>
    <ol class="path" style="--c:${c.color};--c-d:color-mix(in srgb,${c.color} 75%,#000)">${c.lessons.map((l, i) => {
      const dn = S.lessonDone(state, l.id), isNext = l === nxt;
      return `<li style="--x:${X[i % X.length]}px;--i:${i}"><a class="node${dn ? " is-done" : ""}${isNext ? " next" : ""}" href="#/lesson/${l.id}" aria-label="Lesson ${i + 1}: ${esc(l.title)}${dn ? ", done" : ""}">${isNext ? `<span class="bubble">${d ? "NEXT" : "START"}</span>` : ""}<span class="disc">${dn ? CHECK : i + 1}</span></a><span class="nlabel">${esc(l.title)}${dn && creditable(l.id) ? `<small>Ready to review</small>` : ""}</span></li>`;
    }).join("")}<li style="--x:0px;--i:${c.lessons.length}"><span class="node trophy${d === c.lessons.length ? " won" : ""}"><span class="disc">🏆</span></span></li></ol>`, "coursepage");
  acts.enroll = el => { S.toggleEnroll(state, c.id); persist(); const o = state.courses.enrolled.includes(c.id); el.textContent = o ? "★ In my shuffle" : "☆ Add to shuffle"; pop(el); };
}

// ---------- Progress ----------
const POSE_NAMES = { pushup: "Push-ups", squat: "Squats", lunge: "Lunges", jacks: "Jumping jacks", highknees: "High knees", situp: "Sit-ups", bridge: "Glute bridges", burpee: "Burpees", goodmorning: "Good mornings" };
function progress() {
  const st = S.stats(state), lv = S.level(state), d7 = S.days(state, 7), maxC = Math.max(1, state.settings.goalPerDay, ...d7.map(d => d.count)), maxCat = Math.max(1, ...Object.values(st.byCat));
  const cats = Object.keys(CATS).map(k => `<div class="hbar cat-${k}"><span>${CATS[k].icon} ${CATS[k].name}</span><div class="pbar"><i data-w="${(st.byCat[k] || 0) / maxCat * 100}"></i></div><b class="num">${st.byCat[k] || 0}</b></div>`).join("");
  const reps = Object.keys(POSE_NAMES).filter(k => state.totals[k]).map(k => `<div class="tile"><small>${POSE_NAMES[k]}</small><b class="num" data-count="${state.totals[k]}">0</b></div>`).join("");
  const recent = state.log.slice(-12).reverse().map(e => `<li class="${e.kind}"><span class="ico cat-${e.cat}">${e.kind === "skip" ? "⏭️" : CATS[e.cat]?.icon || "⚡"}</span><span class="ch-main"><b>${esc(e.title)}</b><small>${new Date(e.t).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })}${e.detail ? ` · ${esc(e.detail)}` : ""}</small></span><span class="num plus">${e.min ? `+${e.min}m` : "—"}</span></li>`).join("");
  const journal = state.journal.slice(-3).reverse().map(j => `<details class="jentry"><summary>${new Date(j.t).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${esc(j.prompt)}</summary><p>${esc(j.text)}</p></details>`).join("");
  const started = COURSES.filter(c => S.courseProgress(state, c) > 0);
  draw(`${statsBar("Progress")}
    <section class="levelcard">
      ${ring(lv.into / lv.need, `<small>Level</small><b class="num">${lv.level}</b>`, "ring-level")}
      <div><p class="eyebrow">Total XP</p><div class="hugenum num" data-count="${lv.xp}">0</div><p>${lv.need - lv.into} XP to level ${lv.level + 1}</p></div>
    </section>
    <div class="tiles three rise">
      <div class="tile t-streak" style="--i:0"><small>Streak</small><b class="num"><span data-count="${st.streak}">0</span> 🔥</b></div>
      <div class="tile" style="--i:1"><small>Challenges</small><b class="num" data-count="${st.total}">0</b></div>
      <div class="tile" style="--i:2"><small>Lessons</small><b class="num" data-count="${st.lessons}">0</b></div>
    </div>
    <section class="card pad"><div class="row"><p class="eyebrow">Last 7 days</p><span class="mini">goal ${state.settings.goalPerDay} a day</span></div>
      <div class="chart" style="--goal:${state.settings.goalPerDay / maxC * 100}%">${d7.map((d, i) => `<div class="col${i === 6 ? " today" : ""}${d.count >= state.settings.goalPerDay ? " hit" : ""}${d.skipped ? " skipped" : ""}"><span class="num">${d.count || ""}</span><div class="track"><i data-h="${d.count / maxC * 100}" style="--i:${i}"></i></div><small>${d.date.toLocaleDateString("en-US", { weekday: "narrow" })}</small></div>`).join("")}</div>
      <p class="trade"><b class="num" data-count="${st.weekSpentMin}">0</b> min of effort <span aria-hidden="true">→</span> <b class="num" data-count="${st.weekEarnedMin}">0</b> min of apps</p>
    </section>
    <section class="card pad"><p class="eyebrow">By type</p>${cats}</section>
    ${reps ? `<h3 class="grp">Lifetime reps</h3><div class="tiles three">${reps}</div>` : ""}
    <section class="card pad"><p class="eyebrow">Courses</p>${started.length ? started.map(c => { const d = S.courseProgress(state, c); return `<a class="hbar link-row" href="#/course/${c.id}" style="--c:${c.color}"><span>${c.icon} ${esc(c.tag)}</span><div class="pbar"><i data-w="${d / c.lessons.length * 100}"></i></div><b class="num">${d}/${c.lessons.length}</b></a>`; }).join("") : `<p class="empty">Finish a lesson and its course shows up here.</p>`}</section>
    <section class="card pad"><p class="eyebrow">Recent</p>${recent ? `<ul class="log">${recent}</ul>` : `<p class="empty">Nothing yet. Your first challenge shows up here.</p>`}</section>
    ${journal ? `<section class="card pad"><p class="eyebrow">Journal</p>${journal}</section>` : ""}`, "progresspage");
}

// ---------- Settings ----------
function settings() {
  const x = state.settings;
  const stepper = (key, label, hint, step, fmt) => `<div class="setrow"><div><b>${label}</b><small>${hint}</small></div><div class="stepper"><button type="button" data-act="step" data-key="${key}" data-d="${-step}" aria-label="Less">−</button><output>${fmt(x[key])}</output><button type="button" data-act="step" data-key="${key}" data-d="${step}" aria-label="More">+</button></div></div>`;
  const toggle = (p, label, hint, on, dis = false) => `<label class="setrow"><div><b>${label}</b>${hint ? `<small>${hint}</small>` : ""}</div><span class="switch"><input type="checkbox" data-set="${p}" ${on ? "checked" : ""} ${dis ? "disabled" : ""}><i></i></span></label>`;
  const EFF = [[0.5, "Light"], [1, "Standard"], [1.5, "Hard"], [2, "Max"]];
  const onCats = Object.values(x.cats).filter(Boolean).length;
  draw(`${statsBar("Settings")}
    <h2 class="grp">The deal</h2>
    <section class="card">
      ${stepper("sessionMin", "App time per challenge", "Minutes each challenge unlocks", 5, fmtMin)}
      ${stepper("maxBankMin", "Most you can bank", "Stops you stacking up hours", 15, fmtMin)}
      ${stepper("dailyCapMin", "Daily limit", "Total app time you can earn in a day", 15, v => (v ? fmtMin(v) : "Off"))}
      ${stepper("goalPerDay", "Daily goal", "Challenges you aim to finish each day", 1, v => String(v))}
    </section>
    <h2 class="grp">Effort</h2>
    <section class="card pad">
      <div class="seg" role="group" aria-label="Effort">${EFF.map(([v, l]) => `<button type="button" data-act="effort" data-v="${v}" class="${x.effort === v ? "on" : ""}">${l}</button>`).join("")}</div>
      <p class="mini">Right now: ${scaled(byId("pushups"), x.effort).stations[0].reps} push-ups, ${scaled(byId("squats"), x.effort).stations[0].reps} squats, ${scaled(byId("math"), x.effort).count} math problems. Lessons stay the same length.</p>
    </section>
    <h2 class="grp">Kinds of challenge</h2>
    <section class="card">${Object.keys(CATS).map(k => toggle(`cats.${k}`, `${CATS[k].icon} ${CATS[k].name}`, CATS[k].blurb, x.cats[k], x.cats[k] && onCats === 1)).join("")}</section>
    <details class="card fold"><summary>Individual challenges (${CHALLENGES.length})</summary>${CHALLENGES.map(c => toggle(`off.${c.id}`, `${c.icon} ${c.title}`, CATS[c.cat].name, !x.off[c.id])).join("")}<p class="mini pad">Courses are starred in the Learn tab.</p></details>
    <h2 class="grp">How it checks</h2>
    <section class="card">
      ${toggle("camera", "Camera tracking", "Every exercise is counted or timed on-device by the camera. Off means tapping and timers.", x.camera)}
      ${toggle("readTimer", "Minimum reading time", "Each lesson card needs a few seconds before you can move on.", x.readTimer)}
    </section>
    <h2 class="grp">iPhone hand-off</h2>
    <section class="card">
      ${toggle("useShortcut", "Run a Shortcut when time is earned", "Passes the minutes to the Shortcut that lifts your app block.", x.useShortcut)}
      <label class="setrow col"><div><b>Shortcut name</b><small>Must match the name in the Shortcuts app exactly.</small></div><input type="text" class="text" data-text="shortcutName" value="${esc(x.shortcutName)}" autocomplete="off" autocapitalize="off" spellcheck="false"></label>
      <div class="setrow"><div><b>Test it</b><small>Runs the Shortcut with 1 minute.</small></div><a class="chipbtn" href="${esc(shortcutUrl(1))}">Run</a></div>
      <a class="setrow link-row" href="https://github.com/bgalpers/Stim#set-up-the-lock-on-iphone" target="_blank" rel="noopener"><div><b>Setup guide</b><small>How to build the two Shortcuts</small></div><span aria-hidden="true">↗</span></a>
    </section>
    <h2 class="grp">Day</h2>
    <section class="card">${stepper("resetHour", "New day starts at", "Streaks and daily limits roll over then", 1, h => new Date(2000, 0, 1, h).toLocaleTimeString("en-US", { hour: "numeric" }))}</section>
    <h2 class="grp">Your data</h2>
    <section class="card">
      <div class="setrow"><div><b>Back up</b><small>Everything is stored on this device only.</small></div><button class="chipbtn" type="button" data-act="export">Export</button></div>
      <label class="setrow"><div><b>Restore</b><small>Load a backup file.</small></div><span class="chipbtn">Import<input type="file" accept="application/json,.json" data-import hidden></span></label>
      <div class="setrow"><div><b>Start over</b><small>Erases progress and settings.</small></div><button class="chipbtn danger" type="button" data-act="reset">Erase</button></div>
    </section>
    <p class="mini center">Stim · <a href="https://github.com/bgalpers/Stim" target="_blank" rel="noopener">source</a></p>`, "settings");
  const redraw = () => { S.sanitize(state); persist(); const y = scrollY, open = !!$("details.fold")?.open; settings(); if (open) $("details.fold").open = true; scrollTo(0, y); };
  let armed = false;
  Object.assign(acts, {
    step(el) { x[el.dataset.key] = (+x[el.dataset.key] || 0) + +el.dataset.d; if (el.dataset.key === "sessionMin" && x.maxBankMin < x.sessionMin) x.maxBankMin = x.sessionMin; redraw(); },
    effort(el) { x.effort = +el.dataset.v; redraw(); },
    export() {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }));
      a.download = `stim-backup-${S.dayKey(Date.now(), 0)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },
    reset(el) {
      if (!armed) { armed = true; el.textContent = "Tap again to erase"; return setTimeout(() => { armed = false; if (el.isConnected) el.textContent = "Erase"; }, 4000); }
      localStorage.removeItem(S.KEY); localStorage.removeItem(DAILY_KEY); try { history.replaceState(null, "", "#/"); } catch {} location.reload();
    },
  });
  view.onchange = async e => {
    const t = e.target;
    if (t.dataset.set) {
      const [a, b] = t.dataset.set.split(".");
      if (a === "off") t.checked ? delete x.off[b] : (x.off[b] = true);
      else if (b) x[a][b] = t.checked; else x[a] = t.checked;
      redraw();
    } else if (t.dataset.text) { x[t.dataset.text] = t.value.trim() || "Stim Unlock"; redraw(); }
    else if (t.dataset.import != null && t.files[0]) {
      try { Object.assign(state, S.merge(JSON.parse(await t.files[0].text()))); persist(); redraw(); }
      catch { t.closest(".setrow").querySelector("small").textContent = "That file couldn't be read."; }
    }
  };
  onLeave(() => (view.onchange = null));
}

// ---------- go ----------
const ROUTES = { "": home, all, do: doChallenge, lesson: lessonRoute, done, learn, course, progress, settings };
const sync = () => { if (location.hash !== current && /^(#\/.*)?$/.test(location.hash)) go(location.hash || "#/", false); };
addEventListener("popstate", sync); addEventListener("hashchange", sync);
document.addEventListener("visibilitychange", () => { if (!document.hidden && !path()) home(); });
route();
