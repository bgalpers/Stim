import * as S from "./store.js";
import { CATS, CHALLENGES, byId, scaled, JOURNAL_PROMPTS } from "./catalog.js";
import { COURSES, courseById, findLesson, wordCount } from "../content/courses.js";
import * as News from "./news.js";

// ---------- basics ----------
const state = S.load(localStorage);
const persist = () => S.save(localStorage, state);
const $ = (sel, root = document) => root.querySelector(sel);
const view = $("#view");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let current = location.hash;
const path = () => current.replace(/^#\/?/, "");
function go(hash, push = true) {
  current = hash;
  try { if (push && location.hash !== hash) history.pushState(null, "", hash); } catch {}
  route();
}
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const DAY = 86_400_000, REVIEW_AFTER = 7 * DAY;
const hash = str => { let h = 0; for (const c of String(str)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

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
const chime = () => { beep(1320, 0.12); setTimeout(() => beep(1760, 0.35), 140); navigator.vibrate?.([60, 40, 120]); };
let wakeLock = null;
async function keepAwake(on) {
  try { if (on) wakeLock = await navigator.wakeLock?.request("screen"); else { await wakeLock?.release?.(); wakeLock = null; } } catch {}
}

// ---------- small pieces of UI ----------
const ICON = {
  move: '<path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z"/>',
  learn: '<path d="M4 5.500C6.500 4.500 9.500 4.800 12 6.500c2.500-1.700 5.500-2 8-1V18c-2.500-1-5.500-.7-8 1-2.500-1.700-5.500-2-8-1ZM12 6.500V19"/>',
  news: '<path d="M5 5h11v14H7a2 2 0 0 1-2-2ZM16 9h3v8a2 2 0 0 1-2 2M8 9h5M8 12.500h5M8 16h3"/>',
  reset: '<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="3.500"/>',
};
const ico = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;
const LOGO = '<svg class="logo" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="8"/><path d="M14 22V11M14 16c-4 0-6-2.500-6-6 4 0 6 2.500 6 6ZM14 12.500c0-3.500 2.500-6 6-6 0 3.500-2.500 6-6 6Z"/></svg>';
const CHECK = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7.500l2.500 2.500L11 4.500"/></svg>';
const SLASH = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M4 10 10 4"/></svg>';

const CIRC = 2 * Math.PI * 52;
const ring = (p, big, small, cls = "") => `<div class="ring ${cls}"><svg viewBox="0 0 120 120"><circle class="t" cx="60" cy="60" r="52"/><circle class="f" cx="60" cy="60" r="52" stroke-dasharray="${CIRC.toFixed(2)}" stroke-dashoffset="${(CIRC * (1 - Math.max(0, Math.min(1, p)))).toFixed(2)}"/></svg><div class="c"><b class="num">${esc(big)}</b><small>${esc(small)}</small></div></div>`;
function setRing(el, p, big) {
  if (!el) return;
  $(".f", el).style.strokeDashoffset = (CIRC * (1 - Math.max(0, Math.min(1, p)))).toFixed(2);
  if (big != null) $("b", el).textContent = big;
}
const pop = el => { if (el && !reduceMotion) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); } };

/** The plant: one leaf per day of streak, a flower from a full week. */
function stemSVG(n, cls = "") {
  const k = Math.min(n, 9), X = t => 60 + 7 * Math.sin(t * 1.1), Y = t => 182 - 17 * t;
  const end = k + (n ? 0.9 : 0.45);
  let line = "";
  for (let t = 0; t <= end + 1e-6; t += 0.15) line += `${X(t).toFixed(1)},${Y(t).toFixed(1)} `;
  let leaves = "";
  for (let i = 1; i <= k; i++) {
    const side = i % 2 ? 1 : -1, sc = (0.72 + 0.045 * (k - i)).toFixed(2);
    leaves += `<path class="leaf" style="--i:${i}" transform="translate(${X(i - 0.1).toFixed(1)} ${Y(i - 0.1).toFixed(1)}) scale(${side * sc} ${sc}) rotate(-24)" d="M0 0C8-11 23-12 30-3 22 7 8 7 0 0Z"/>`;
  }
  const tx = X(end).toFixed(1), ty = Y(end).toFixed(1);
  const tip = n >= 7
    ? `<g class="flower" transform="translate(${tx} ${ty})">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="4.500" ry="8" cy="-8" transform="rotate(${a})"/>`).join("")}<circle r="4.500"/></g>`
    : n ? `<ellipse class="bud" cx="${tx}" cy="${ty}" rx="3.500" ry="5.500"/>`
        : `<path class="leaf" transform="translate(${tx} ${ty}) scale(.5) rotate(-40)" d="M0 0C8-11 23-12 30-3 22 7 8 7 0 0Z"/><path class="leaf" transform="translate(${tx} ${ty}) scale(-.5 .5) rotate(-40)" d="M0 0C8-11 23-12 30-3 22 7 8 7 0 0Z"/>`;
  const top = Math.max(0, Math.floor(Y(end) - 26));
  return `<svg class="stem ${cls}" viewBox="0 ${top} 120 ${200 - top}" role="img" aria-label="${plural(n, "day")} streak"><ellipse class="soil" cx="60" cy="186" rx="34" ry="7"/><polyline class="stalk" points="${line.trim()}"/>${leaves}${tip}</svg>`;
}

const shortcutUrl = (min = Math.ceil(S.remainingMs(state) / 60000)) =>
  `shortcuts://run-shortcut?name=${encodeURIComponent(state.settings.shortcutName)}&input=text&text=${min}`;
const openAppsBtn = (cls = "light") => state.settings.useShortcut && S.isOpen(state)
  ? `<a class="btn ${cls}" href="${esc(shortcutUrl())}">Open my apps <span aria-hidden="true">→</span></a>` : "";
const pill = () => { const o = S.isOpen(state); return `<span class="pill ${o ? "open" : ""}" data-pill><i></i><span>${o ? "Open" : "Locked"}</span></span>`; };
const backBar = (label, href = "#/") => `<header class="bar"><a class="backlink" href="${href}" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></a><span class="eyebrow">${esc(label)}</span><span class="bar-end">${pill()}</span></header>`;
const tips = ch => (ch.tips?.length ? `<ol class="tips">${ch.tips.map(t => `<li><span>${esc(t)}</span></li>`).join("")}</ol>` : "");

function earnLine() {
  const g = S.nextGrant(state);
  return g > 0 ? `Earns ${fmtMin(g)} of app time.` : "Counts toward your streak. No time added right now.";
}

function weekBlock() {
  const st = S.streak(state);
  const days = S.week(state).map(d => {
    const cls = ["dot", d.status === "done" ? "done" : d.status === "skip" ? "skipped" : !d.future && !d.today ? "missed" : "", d.today ? "today" : ""].join(" ");
    const name = d.date.toLocaleDateString("en-US", { weekday: "long" });
    const what = d.status === "done" ? plural(d.count, "challenge") : d.status === "skip" ? "skipped" : d.future ? "upcoming" : d.today ? "nothing yet" : "missed";
    return `<div class="day${d.future ? " future" : ""}"><div class="${cls}" title="${name}: ${what}">${d.status === "done" ? (d.count > 1 ? `<b class="num">${d.count}</b>` : CHECK) : d.status === "skip" ? SLASH : ""}</div><span>${d.date.toLocaleDateString("en-US", { weekday: "narrow" })}</span></div>`;
  }).join("");
  return `<div class="row"><p class="eyebrow">This week</p><div class="streak"><b class="num">${st}</b><span>day streak</span></div></div><div class="week">${days}</div>`;
}

// ---------- what to offer ----------
const creditable = id => { const t = state.courses.done[id]; return !t || Date.now() - t > REVIEW_AFTER; };

function lessonItem(course) {
  let l = S.nextLesson(state, course), review = false;
  if (!l) { l = [...course.lessons].sort((a, b) => state.courses.done[a.id] - state.courses.done[b.id])[0]; review = true; if (!creditable(l.id)) return null; }
  const i = course.lessons.indexOf(l);
  return { key: l.id, cat: "learn", href: `#/lesson/${l.id}`, title: l.title, sub: `${course.title} · ${review ? "Review" : `Lesson ${i + 1} of ${course.lessons.length}`} · ~5 min` };
}
function challengeItem(c) {
  const ch = scaled(c, state.settings.effort), done = c.daily && S.doneToday(state, c.id);
  const what = ch.type === "reps" ? `${ch.target} ${ch.unit}` : ch.type === "timed" ? plural(ch.steps.filter(s => !s.rest).length, "round") : ch.type === "breath" ? "Guided" : ch.type === "journal" ? `${ch.words} words` : "Read + quiz";
  return { key: c.id, cat: c.cat, href: `#/do/${c.id}`, title: c.title, sub: done ? "Done today" : `${what} · ~${ch.estMin} min`, done };
}
function candidates(cat, includeDone = false) {
  if (!state.settings.cats[cat]) return [];
  if (cat === "learn") return COURSES.filter(c => state.courses.enrolled.includes(c.id)).map(lessonItem).filter(Boolean);
  return CHALLENGES.filter(c => c.cat === cat && !state.settings.off[c.id]).map(challengeItem).filter(i => includeDone || !i.done);
}
let shuffleN = 0;
function suggestions() {
  const seed = hash(S.dayKey(Date.now(), state.settings.resetHour)) + state.log.length + shuffleN;
  return Object.keys(CATS).map((cat, i) => { const list = candidates(cat); return list.length ? list[(seed + i) % list.length] : null; }).filter(Boolean);
}
const card = it => `<a class="ch cat-${it.cat}${it.done ? " is-done" : ""}" href="${it.href}"><span class="ico">${ico(it.cat)}</span><span class="ch-main"><b>${esc(it.title)}</b><small>${esc(it.sub)}</small></span><span class="tag">${CATS[it.cat].name}</span></a>`;

// ---------- router ----------
let acts = {}, cleanup = [], token = 0, last = null;
const onLeave = fn => cleanup.push(fn);

function route() {
  cleanup.splice(0).forEach(f => { try { f(); } catch {} });
  acts = {}; token++;
  const [name = "", arg] = path().split("/");
  const fn = ROUTES[name] || home;
  document.body.classList.toggle("focus", ["do", "lesson", "done"].includes(name));
  document.querySelectorAll("#tabs a").forEach(a => a.classList.toggle("on", a.dataset.tab === (TAB[name] ?? "home")));
  fn(decodeURIComponent(arg || ""));
  window.scrollTo(0, 0);
}
const TAB = { "": "home", all: "home", learn: "learn", course: "learn", progress: "progress", settings: "settings" };

document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if (!el) return;
  ensureAudio();
  (acts[el.dataset.act] || GLOBAL[el.dataset.act])?.(el, e);
});

const GLOBAL = {
  shuffle() { shuffleN++; home(); },
  skip() { openSheet(); },
  relock() {
    S.relock(state); persist(); home();
    if (state.settings.useShortcut) location.href = shortcutUrl(0);
  },
};

// ---------- Today ----------
function home() {
  const now = Date.now(), open = S.isOpen(state, now), g = S.nextGrant(state, now), x = state.settings;
  const sug = suggestions();
  const note = g === 0
    ? `<p class="note">${S.capLeft(state, now) === 0 ? `You've used today's ${fmtMin(x.dailyCapMin)} limit.` : `Your bank is full at ${fmtMin(x.maxBankMin)}.`} Challenges still count toward your streak.</p>`
    : g < x.sessionMin ? `<p class="note">The next challenge adds ${fmtMin(g)}, which takes you to your limit.</p>` : "";
  view.innerHTML = `<div class="page home">
    <section class="hero${open ? " is-open" : ""}">
      <header class="top"><div class="mark">${LOGO}Stim</div>${pill()}</header>
      <div class="hero-body">
        <div class="hero-text">${open
          ? `<p class="eyebrow">App time left</p><div class="clock num" data-clock>${fmtClock(S.remainingMs(state, now))}</div><p class="lede">When it runs out, come back and take five.</p>`
          : `<h1>Earn your next <span class="num">${x.sessionMin}</span> minutes.</h1><p class="lede">One short challenge for your body or your mind, then your apps open.</p>`}
        </div>${stemSVG(S.streak(state, now))}
      </div>
      ${open ? `<div class="hero-actions">${openAppsBtn()}<button class="link light" type="button" data-act="relock">Lock now</button></div>` : ""}
    </section>
    <section class="block">
      <div class="row"><h2>${open ? "Bank more time" : "Pick a challenge"}</h2>${sug.length ? `<button class="chipbtn" type="button" data-act="shuffle">Shuffle</button>` : ""}</div>
      ${note}
      <div class="list">${sug.map(card).join("") || `<p class="empty">Nothing to offer. Turn on a category or a course in <a href="#/settings">Settings</a>.</p>`}</div>
      <a class="more" href="#/all">All challenges →</a>
    </section>
    <section class="card pad">${weekBlock()}</section>
    ${open ? "" : `<button class="link" type="button" data-act="skip">Skip this one</button>`}
  </div>`;
}

function all() {
  const groups = Object.keys(CATS).map(cat => {
    const items = candidates(cat, true);
    return items.length ? `<h3 class="grp">${CATS[cat].name}<small>${CATS[cat].blurb}</small></h3><div class="list">${items.map(card).join("")}</div>` : "";
  }).join("");
  view.innerHTML = `<div class="page">${backBar("All challenges")}<h1 class="title">Choose your five minutes</h1><p class="sub">${earnLine()}</p>${groups || `<p class="empty">Everything is switched off. Turn something on in <a href="#/settings">Settings</a>.</p>`}</div>`;
}

// keep clocks and the lock state current
let wasOpen = S.isOpen(state);
setInterval(() => {
  const open = S.isOpen(state), ms = S.remainingMs(state);
  document.querySelectorAll("[data-clock]").forEach(el => (el.textContent = fmtClock(ms)));
  document.querySelectorAll("[data-pill]").forEach(el => { el.classList.toggle("open", open); el.lastElementChild.textContent = open ? "Open" : "Locked"; });
  if (wasOpen && !open) { beep(660, 0.25); setTimeout(() => beep(440, 0.4), 260); if (!path()) home(); }
  wasOpen = open;
  document.title = open ? `${fmtClock(ms)} · Stim` : "Stim";
}, 1000);

// ---------- finishing ----------
function complete({ id, cat, title, detail = "", started, reps = 0, after }) {
  last = { entry: S.grant(state, { id, cat, title, kind: "done", spentMs: started ? Date.now() - started : 0, detail }), prevStreak: 0 };
  if (reps) state.totals[id] = (state.totals[id] || 0) + reps;
  after?.();
  persist(); wasOpen = S.isOpen(state);
  chime(); keepAwake(false);
  go("#/done");
}

function done() {
  if (!last) return go("#/");
  const e = last.entry, skip = e.kind === "skip", st = S.streak(state), open = S.isOpen(state);
  const why = e.min ? "" : S.capLeft(state) === 0 ? `You're at today's ${fmtMin(state.settings.dailyCapMin)} limit, so no time was added.` : `Your bank is full at ${fmtMin(state.settings.maxBankMin)}, so no time was added.`;
  view.innerHTML = `<div class="page donepage${skip ? " is-skip" : ""}">
    <div class="done-top">${stemSVG(st, "grow")}</div>
    <p class="eyebrow">${skip ? "Skipped" : "Challenge complete"}</p>
    <h1 class="title big">${e.min ? `+${e.min} minutes` : skip ? "Unlocked nothing" : "Logged"}</h1>
    <p class="sub">${skip ? "No challenge this time. Skips don't count toward your streak." : `${esc(e.title)}${e.detail ? ` · ${esc(e.detail)}` : ""}. ${why}`}</p>
    <div class="tiles two">
      <div class="tile"><small>App time</small><b class="num" data-clock>${fmtClock(S.remainingMs(state))}</b></div>
      <div class="tile"><small>Streak</small><b class="num">${plural(st, "day")}</b></div>
    </div>
    <div class="stack">
      ${openAppsBtn("primary")}
      <a class="btn ${open && state.settings.useShortcut ? "quiet" : "primary"}" href="#/">${S.nextGrant(state) > 0 ? "Do another to bank more" : "Back to Stim"}</a>
    </div>
  </div>`;
}

// ---------- skip sheet ----------
const sheet = $("#sheet"), scrim = $("#scrim");
let ask = 0;
const ASKS = () => [
  ["Are you sure?", "Skipping opens your apps without doing anything for it.", "Yes, skip"],
  ["Are you really sure?", "The shortest challenge takes about four minutes.", "Yes, really"],
  ["Last chance.", `A skip gives you ${fmtMin(S.nextGrant(state))} and is marked on your week.`, "Skip and unlock"],
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
  last = { entry: S.grant(state, { id: "skip", cat: "skip", title: "Skipped", kind: "skip" }) };
  persist(); wasOpen = S.isOpen(state);
  go("#/done");
};

// ---------- challenge runners ----------
function doChallenge(id) {
  const base = byId(id);
  if (!base) return go("#/");
  const ch = scaled(base, state.settings.effort);
  ({ reps: repsView, timed: timedView, breath: timedView, journal: journalView, feed: feedView })[ch.type](ch);
}

// reps: camera or tap
function repsView(ch) {
  let n = 0, mode = "intro", cam = null, started = 0, lastTap = 0;
  const step = ch.step || 1, canCam = !!(ch.pose && state.settings.camera && navigator.mediaDevices?.getUserMedia);
  const stage = $("#stage");
  const paint = (err = "") => {
    view.innerHTML = `<div class="page runner cat-${ch.cat}">${backBar(CATS[ch.cat].name)}
      <h1 class="title">${esc(ch.title)}</h1><p class="sub">${ch.target} ${esc(ch.unit)}. ${earnLine()}</p>
      <div class="center" id="repRing">${ring(n / ch.target, n, `of ${ch.target}`, "ring-lg")}</div>
      ${mode === "tap"
        ? `<button class="tapbtn" type="button" data-act="tap">+${step}</button>
           <div class="row spread"><button class="link" type="button" data-act="untap">Undo</button>${canCam ? `<button class="link" type="button" data-act="cam">Use the camera</button>` : ""}</div>`
        : `${tips(ch)}${err ? `<p class="err">${esc(err)}</p>` : ""}
           <div class="stack">${canCam ? `<button class="btn primary" type="button" data-act="cam">Count with camera</button>` : ""}
           <button class="btn ${canCam ? "quiet" : "primary"}" type="button" data-act="tapmode">Count by tapping</button></div>`}
    </div>`;
  };
  const finish = () => complete({ id: ch.id, cat: ch.cat, title: ch.title, detail: `${n} ${ch.unit}`, started, reps: n });
  const stopCam = () => { cam?.stop(); cam = null; stage.hidden = true; keepAwake(false); };
  onLeave(stopCam);

  Object.assign(acts, {
    tapmode() { mode = "tap"; started ||= Date.now(); paint(); },
    tap() {
      const t = performance.now(); if (t - lastTap < 180) return; lastTap = t;
      started ||= Date.now();
      n = Math.min(ch.target, n + step);
      const r = $("#repRing .ring"); setRing(r, n / ch.target, n); pop(r); navigator.vibrate?.(10);
      if (n >= ch.target) return finish();
      beep(n % (step * 10) === 0 ? 1320 : 880, 0.06);
    },
    untap() { n = Math.max(0, n - step); setRing($("#repRing .ring"), n / ch.target, n); },
    async cam(btn) {
      const my = token; btn.disabled = true; started ||= Date.now();
      const camRing = $("#camRing");
      camRing.innerHTML = ring(n / ch.target, n, `of ${ch.target}`, "ring-sm on-dark");
      const set = (kind, text) => { const c = $("#camCue"); c.className = "cue " + kind; c.textContent = text; };
      set("idle", "Starting camera…"); $("#camPaused").hidden = true; $("#camHint").hidden = true;
      try {
        const { RepCamera, MODES } = await import("./pose.js");
        const m = MODES[ch.pose];
        cam = new RepCamera({
          video: $("#video"), canvas: $("#canvas"), mode: ch.pose,
          onRep() {
            n++; const r = $(".ring", camRing); setRing(r, n / ch.target, n); pop(r);
            if (n >= ch.target) { stopCam(); return finish(); }
            n % 10 === 0 ? beep(1320, 0.14) : beep(880);
          },
          onState(s) {
            set(s.cue, s.text);
            $("#camHint").hidden = !s.hint; if (s.hint) $("#camHint").textContent = s.hint;
            if (s.angle != null) { $("#camAngle").textContent = s.angle + "°"; $("#camMeter").style.width = s.pct + "%"; }
            if (s.wentDown) beep(440, 0.05, 0.1);
          },
        });
        $("#mkDown").style.left = cam.pct(m.down) + "%"; $("#mkUp").style.left = cam.pct(m.up) + "%";
        stage.hidden = false;
        await cam.start(msg => set("idle", msg));
        if (my !== token) return stopCam();
        set("idle", "Get in position"); keepAwake(true);
      } catch (e) {
        stopCam(); if (my !== token) return;
        mode = "intro";
        paint(e?.name === "NotAllowedError"
          ? "Camera access is blocked. Allow it in Settings › Safari › Camera, or count by tapping."
          : `Couldn't start the camera (${e?.message || e}). You can count by tapping instead.`);
      }
    },
  });
  $("#camPause").onclick = () => { cam?.pause(); $("#camPaused").hidden = false; };
  $("#camResume").onclick = () => { $("#camPaused").hidden = true; cam?.resume(); };
  $("#camExit").onclick = () => { stopCam(); mode = "tap"; paint(); };
  paint();
}

// timed: guided intervals, and box breathing
function timedView(ch) {
  const breath = ch.type === "breath";
  const steps = breath ? [{ label: "Box breathing", s: ch.seconds, cue: "In for 4, hold 4, out for 4, hold 4." }] : ch.steps;
  const total = steps.reduce((n, s) => n + s.s, 0) * 1000;
  let idx = 0, left = steps[0].s * 1000, spent = 0, running = false, started = 0, prev = 0, lastPhase = -1;
  const PH = ["Breathe in", "Hold", "Breathe out", "Hold"];
  view.innerHTML = `<div class="page runner cat-${ch.cat}">${backBar(CATS[ch.cat].name)}
    <h1 class="title">${esc(ch.title)}</h1><p class="sub">${fmtMin(Math.round(total / 60000))}. ${earnLine()}</p>
    <div class="center">${breath ? `<div class="orb" id="orb"><span id="orbText">Ready</span></div>` : ring(1, steps[0].s, "sec", "ring-lg")}</div>
    <p class="steplabel" id="stepLabel"></p><p class="stepcue" id="stepCue"></p>
    <div class="bar-track"><i id="totalBar"></i></div><p class="mini" id="totalLeft"></p>
    <div class="stack"><button class="btn primary" type="button" data-act="toggle" id="tBtn">Start</button></div>
    ${tips(ch)}
  </div>`;
  const paint = () => {
    const s = steps[idx];
    $("#stepLabel").textContent = breath ? `${fmtClock(left)} left` : s.label;
    $("#stepLabel").classList.toggle("rest", !!s.rest);
    $("#stepCue").textContent = s.cue || "";
    $("#totalBar").style.width = (spent / total * 100).toFixed(1) + "%";
    $("#totalLeft").textContent = breath ? "" : `${fmtClock(total - spent)} left · ${idx + 1} of ${steps.length}`;
    if (breath) {
      const ph = Math.floor((s.s * 1000 - left) / 4000) % 4;
      if (running && ph !== lastPhase) { lastPhase = ph; $("#orbText").textContent = PH[ph]; $("#orb").dataset.ph = ph; beep(ph % 2 ? 520 : 660, 0.05, 0.05); }
    } else {
      const r = $(".ring", view); setRing(r, left / (s.s * 1000), Math.ceil(left / 1000)); r.classList.toggle("rest", !!s.rest);
    }
  };
  const setRun = on => {
    running = on; prev = performance.now(); $("#tBtn").textContent = on ? "Pause" : spent ? "Resume" : "Start"; keepAwake(on);
    if (breath && !on) { lastPhase = -1; $("#orb").dataset.ph = ""; $("#orbText").textContent = spent ? "Paused" : "Ready"; }
  };
  const timer = setInterval(() => {
    if (!running) return;
    const t = performance.now(), dt = Math.min(1000, t - prev); prev = t;
    left -= dt; spent = Math.min(total, spent + dt);
    if (left <= 0) {
      if (++idx >= steps.length) { clearInterval(timer); return complete({ id: ch.id, cat: ch.cat, title: ch.title, detail: fmtMin(Math.round(total / 60000)), started }); }
      left += steps[idx].s * 1000; steps[idx].rest ? beep(520, 0.25) : beep(1040, 0.25); navigator.vibrate?.(80);
    }
    paint();
  }, 100);
  const hide = () => { if (document.hidden && running) setRun(false); };
  document.addEventListener("visibilitychange", hide);
  onLeave(() => { clearInterval(timer); document.removeEventListener("visibilitychange", hide); keepAwake(false); });
  acts.toggle = () => { started ||= Date.now(); setRun(!running); if (running) beep(1040, 0.15); };
  paint();
}

// journal
function journalView(ch) {
  let p = hash(S.dayKey(Date.now(), state.settings.resetHour)) % JOURNAL_PROMPTS.length, started = Date.now();
  view.innerHTML = `<div class="page runner cat-${ch.cat}">${backBar(CATS[ch.cat].name)}
    <h1 class="title">${esc(ch.title)}</h1><p class="sub">${ch.words} words or more. ${earnLine()}</p>
    <blockquote class="prompt" id="prompt"></blockquote>
    <button class="link left" type="button" data-act="another">Give me a different prompt</button>
    <textarea id="jtext" rows="9" placeholder="Start anywhere." aria-labelledby="prompt"></textarea>
    <div class="row spread"><span class="mini" id="wc"></span><span class="mini">Saved on this phone only</span></div>
    <div class="stack"><button class="btn primary" type="button" data-act="save" id="jBtn" disabled>Done</button></div>
  </div>`;
  const ta = $("#jtext"), words = () => (ta.value.trim().match(/\S+/g) || []).length;
  const upd = () => { const w = words(); $("#wc").textContent = `${w} / ${ch.words} words`; $("#jBtn").disabled = w < ch.words; };
  const setPrompt = () => ($("#prompt").textContent = JOURNAL_PROMPTS[p]);
  ta.oninput = upd; setPrompt(); upd();
  acts.another = () => { p = (p + 1) % JOURNAL_PROMPTS.length; setPrompt(); };
  acts.save = () => {
    if (words() < ch.words) return;
    const w = words();
    complete({ id: ch.id, cat: ch.cat, title: ch.title, detail: `${w} words`, started, after() {
      state.journal.push({ t: Date.now(), prompt: JOURNAL_PROMPTS[p], text: ta.value.trim() });
      if (state.journal.length > 200) state.journal.splice(0, state.journal.length - 200);
    } });
  };
}

// daily feed (news / on this day)
const DAILY_KEY = "stim.daily";
async function getDaily(kind) {
  const today = News.feedDate();
  let cache = null; try { cache = JSON.parse(localStorage.getItem(DAILY_KEY)); } catch {}
  if (cache?.date !== today) {
    const feed = await News.fetchFeed();
    cache = { date: today, news: News.buildBriefing(feed, today), onthisday: News.buildOnThisDay(feed, today) };
    try { localStorage.setItem(DAILY_KEY, JSON.stringify(cache)); } catch {}
  }
  return cache[kind];
}
async function feedView(ch) {
  const my = token;
  if (S.doneToday(state, ch.id)) {
    view.innerHTML = `<div class="page runner">${backBar(CATS.news.name)}<h1 class="title">${esc(ch.title)}</h1><p class="sub">You've already done this one today. There's a fresh one tomorrow.</p><div class="stack"><a class="btn primary" href="#/all">Pick something else</a></div></div>`;
    return;
  }
  view.innerHTML = `<div class="page runner">${backBar(CATS.news.name)}<h1 class="title">${esc(ch.title)}</h1><p class="sub loading">Fetching today's stories…</p></div>`;
  let lesson = null;
  try { lesson = await getDaily(ch.feed); } catch {}
  if (my !== token) return;
  if (!lesson) {
    view.innerHTML = `<div class="page runner">${backBar(CATS.news.name)}<h1 class="title">${esc(ch.title)}</h1><p class="err">Couldn't load today's stories. Check your connection, or pick a different challenge.</p><div class="stack"><button class="btn primary" type="button" data-act="retry">Try again</button><a class="btn quiet" href="#/all">Pick something else</a></div></div>`;
    acts.retry = () => feedView(ch);
    return;
  }
  reader(lesson, { cat: "news", id: ch.id, title: ch.title, label: CATS.news.name, credit: true });
}

// course lesson: the read, its questions, up to two from earlier lessons, then a one-line recap
function lessonRoute(id) {
  const f = findLesson(id);
  if (!f) return go("#/learn");
  const { course, lesson, index } = f;
  const rnd = News.seeded(id + S.dayKey(Date.now(), state.settings.resetHour));
  const earlier = News.shuffle(course.lessons.slice(0, index).filter(l => S.lessonDone(state, l.id)).flatMap(l => l.quiz.map(q => ({ ...q, tag: `From earlier: ${l.title}` }))), rnd).slice(0, 2);
  reader({
    kicker: `${course.title} · Lesson ${index + 1} of ${course.lessons.length}`, title: lesson.title,
    blocks: lesson.body.map(p => ({ p })), takeaway: lesson.takeaway, quiz: [...lesson.quiz, ...earlier], words: wordCount(lesson),
    myNote: state.notes?.[lesson.id],
  }, {
    cat: "learn", id: lesson.id, title: lesson.title, label: course.tag, back: `#/course/${course.id}`, credit: creditable(lesson.id), recap: true,
    after(note) { state.courses.done[lesson.id] = Date.now(); if (note) (state.notes ||= {})[lesson.id] = note; },
  });
}

// shared reader + quiz
function reader(lesson, meta) {
  const started = Date.now(), N = lesson.quiz.length;
  let need = state.settings.readTimer ? Math.max(20, Math.min(120, Math.round(lesson.words / 4.5))) : 0;
  let timer = null;
  onLeave(() => clearInterval(timer));

  const read = () => {
    view.innerHTML = `<div class="page runner reading cat-${meta.cat}">${backBar(meta.label, meta.back)}
      <p class="eyebrow">${esc(lesson.kicker)}</p><h1 class="title serif">${esc(lesson.title)}</h1>
      ${meta.credit ? "" : `<p class="note">You finished this lesson in the last week, so this is a review. It won't add app time.</p>`}
      <article class="prose">${lesson.blocks.map(b => `${b.h ? `<h3>${esc(b.h)}</h3>` : ""}<p>${esc(b.p)}</p>${b.note ? `<p class="bg">${esc(b.note)}</p>` : ""}${b.link ? `<p class="src"><a href="${esc(b.link)}" target="_blank" rel="noopener">${esc(b.linkText || "Read more")} ↗</a></p>` : ""}`).join("")}</article>
      ${lesson.takeaway ? `<aside class="takeaway"><b>Takeaway</b><p>${esc(lesson.takeaway)}</p></aside>` : ""}
      ${lesson.myNote ? `<aside class="takeaway mine"><b>Your note from last time</b><p>${esc(lesson.myNote)}</p></aside>` : ""}
      ${lesson.source ? `<p class="mini">Source: ${esc(lesson.source)}</p>` : ""}
      <div class="stack"><button class="btn primary" type="button" data-act="quiz" id="qBtn"></button></div>
    </div>`;
    const btn = $("#qBtn"), ready = `Take the quiz · ${plural(N, "question")}`;
    const upd = () => { btn.disabled = need > 0; btn.textContent = need > 0 ? `Quiz unlocks in ${fmtClock(need * 1000)}` : ready; };
    upd(); clearInterval(timer);
    if (need > 0) timer = setInterval(() => { if (document.hidden) return; need--; upd(); if (need <= 0) clearInterval(timer); }, 1000);
  };

  let queue = lesson.quiz.map((_, i) => i), seen = new Set(), firstTry = 0, answered = false;
  const ask = () => {
    const i = queue[0], q = lesson.quiz[i], retry = seen.has(i);
    answered = false;
    view.innerHTML = `<div class="page runner quiz cat-${meta.cat}">${backBar(meta.label, meta.back)}
      <div class="qdots">${lesson.quiz.map((_, k) => `<i class="${!queue.includes(k) ? "ok" : k === i ? "cur" : ""}"></i>`).join("")}</div>
      <p class="eyebrow">${retry ? "Try this one again" : q.tag ? esc(q.tag) : `Question ${seen.size + 1} of ${N}`}</p>
      <h2 class="question">${esc(q.q)}</h2>
      <div class="opts">${q.o.map((o, k) => `<button class="opt" type="button" data-act="pick" data-k="${k}">${esc(o)}</button>`).join("")}</div>
      <div id="fb"></div>
      <button class="link" type="button" data-act="reread">Re-read first</button>
    </div>`;
  };
  Object.assign(acts, {
    quiz() { if (need > 0) return; clearInterval(timer); ask(); window.scrollTo(0, 0); },
    reread() { read(); window.scrollTo(0, 0); },
    pick(el) {
      if (answered) return; answered = true;
      const i = queue[0], q = lesson.quiz[i], k = +el.dataset.k, right = k === q.a;
      view.querySelectorAll(".opt").forEach((b, j) => { b.disabled = true; if (j === q.a) b.classList.add("right"); else if (j === k) b.classList.add("wrong"); });
      if (right && !seen.has(i)) firstTry++;
      seen.add(i); queue.shift(); if (!right) queue.push(i);
      right ? beep(1040, 0.1) : beep(300, 0.18);
      $("#fb").innerHTML = `<div class="fb ${right ? "good" : "bad"}"><b>${right ? "Correct." : "Not quite."}</b> ${esc(q.why)}${right ? "" : " You'll get this one again."}</div>
        <div class="stack"><button class="btn primary" type="button" data-act="next">${queue.length ? "Next" : "Finish"}</button></div>`;
      $("[data-act=next]").focus();
    },
    next() {
      if (queue.length) { ask(); return window.scrollTo(0, 0); }
      if (meta.recap) return recap();
      finish();
    },
    recapDone() { const t = $("#recap").value.trim(); if (count(t) >= RECAP_WORDS) finish(t); },
  });
  const RECAP_WORDS = 12, count = t => (t.match(/\S+/g) || []).length;
  const finish = note => {
    if (!meta.credit) { meta.after?.(note); persist(); return go(meta.back || "#/"); }
    complete({ id: meta.id, cat: meta.cat, title: meta.title, detail: `${firstTry}/${N} first try`, started, after: () => meta.after?.(note) });
  };
  // retrieval practice: say it back in your own words before it counts
  const recap = () => {
    view.innerHTML = `<div class="page runner quiz cat-${meta.cat}">${backBar(meta.label, meta.back)}
      <div class="qdots">${lesson.quiz.map(() => `<i class="ok"></i>`).join("")}</div>
      <p class="eyebrow">Last step</p><h2 class="question">In a sentence or two, what was the main idea?</h2>
      <p class="sub">Write it from memory, in your own words. Putting it into words is what makes it stick.</p>
      <textarea id="recap" rows="5" placeholder="The main idea is…"></textarea>
      <div class="row spread"><span class="mini" id="rc"></span></div>
      <div class="stack"><button class="btn primary" type="button" data-act="recapDone" id="rBtn" disabled>Finish</button></div>
    </div>`;
    const ta = $("#recap"), upd = () => { const w = count(ta.value); $("#rc").textContent = `${w} / ${RECAP_WORDS} words`; $("#rBtn").disabled = w < RECAP_WORDS; };
    ta.oninput = upd; upd(); window.scrollTo(0, 0);
  };
  read();
}

// ---------- Learn ----------
function learn() {
  view.innerHTML = `<div class="page">
    <header class="top plain"><div class="mark dark">${LOGO}Learn</div>${pill()}</header>
    <h1 class="title">Courses</h1>
    <p class="sub">Switch on the ones you want. Stim offers the next lesson from each as a challenge, and you can open any lesson directly.</p>
    <div class="list">${COURSES.map(c => {
      const d = S.courseProgress(state, c), on = state.courses.enrolled.includes(c.id);
      return `<div class="course card"><a class="course-main" href="#/course/${c.id}"><span class="tag solid">${esc(c.tag)}</span><b>${esc(c.title)}</b><p>${esc(c.blurb)}</p>
        <div class="bar-track"><i style="width:${d / c.lessons.length * 100}%"></i></div><small>${d} of ${c.lessons.length} lessons${d === c.lessons.length ? " · complete" : ""}</small></a>
        <label class="switchrow"><span>${on ? "In my rotation" : "Not in rotation"}</span><span class="switch"><input type="checkbox" data-enroll="${c.id}" ${on ? "checked" : ""}><i></i></span></label></div>`;
    }).join("")}</div>
  </div>`;
  view.onchange = e => { const id = e.target.dataset?.enroll; if (id) { S.toggleEnroll(state, id); persist(); const y = scrollY; learn(); scrollTo(0, y); } };
  onLeave(() => (view.onchange = null));
}

function course(id) {
  const c = courseById(id);
  if (!c) return go("#/learn");
  const nxt = S.nextLesson(state, c), d = S.courseProgress(state, c);
  view.innerHTML = `<div class="page">${backBar(c.tag, "#/learn")}
    <h1 class="title serif">${esc(c.title)}</h1><p class="sub">${esc(c.blurb)}</p>
    <div class="bar-track"><i style="width:${d / c.lessons.length * 100}%"></i></div><p class="mini">${d} of ${c.lessons.length} lessons</p>
    <ol class="lessons">${c.lessons.map((l, i) => {
      const dn = S.lessonDone(state, l.id);
      return `<li><a class="lesson${dn ? " is-done" : ""}${l === nxt ? " next" : ""}" href="#/lesson/${l.id}"><span class="lnum">${dn ? CHECK : i + 1}</span><span class="ch-main"><b>${esc(l.title)}</b><small>${dn ? (creditable(l.id) ? "Done · ready to review" : "Done") : l === nxt ? "Up next · ~5 min" : "~5 min"}</small></span></a></li>`;
    }).join("")}</ol>
  </div>`;
}

// ---------- Progress ----------
function progress() {
  const st = S.stats(state), max = Math.max(1, ...Object.values(st.byCat));
  const cats = Object.keys(CATS).map(k => `<div class="hbar cat-${k}"><span>${CATS[k].name}</span><div class="bar-track"><i style="width:${(st.byCat[k] || 0) / max * 100}%"></i></div><b class="num">${st.byCat[k] || 0}</b></div>`).join("");
  const reps = CHALLENGES.filter(c => c.type === "reps" && state.totals[c.id]).map(c => `<div class="tile"><small>${esc(c.title)}</small><b class="num">${state.totals[c.id].toLocaleString()}</b></div>`).join("");
  const recent = state.log.slice(-12).reverse().map(e => `<li class="${e.kind}"><span class="ico cat-${e.cat}">${e.kind === "skip" ? SLASH : ico(e.cat)}</span><span class="ch-main"><b>${esc(e.title)}</b><small>${new Date(e.t).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })}${e.detail ? ` · ${esc(e.detail)}` : ""}</small></span><span class="num plus">${e.min ? `+${e.min}` : "—"}</span></li>`).join("");
  const journal = state.journal.slice(-3).reverse().map(j => `<details class="jentry"><summary>${new Date(j.t).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${esc(j.prompt)}</summary><p>${esc(j.text)}</p></details>`).join("");
  view.innerHTML = `<div class="page">
    <header class="top plain"><div class="mark dark">${LOGO}Progress</div>${pill()}</header>
    <section class="card pad growcard"><div><p class="eyebrow">Current streak</p><div class="hugenum num">${st.streak}</div><p class="sub tight">${st.streak ? `${plural(st.streak, "day")} with at least one challenge. A leaf for each.` : "Finish a challenge today to plant it."}</p></div>${stemSVG(st.streak)}</section>
    <div class="tiles">
      <div class="tile"><small>Challenges</small><b class="num">${st.total}</b></div>
      <div class="tile"><small>Lessons</small><b class="num">${st.lessons}</b></div>
      <div class="tile"><small>Skips</small><b class="num">${st.skips}</b></div>
    </div>
    <section class="card pad"><p class="eyebrow">Last 7 days</p>
      <p class="trade"><b class="num">${st.weekSpentMin}</b> min of effort <span aria-hidden="true">→</span> <b class="num">${st.weekEarnedMin}</b> min of apps</p>
      <p class="mini">${plural(st.weekDone, "challenge")} completed.</p>
      <div style="margin-top:16px">${weekBlock()}</div>
    </section>
    <section class="card pad"><p class="eyebrow">By type</p>${cats}</section>
    ${reps ? `<div class="tiles">${reps}</div>` : ""}
    <section class="card pad"><p class="eyebrow">Courses</p>${COURSES.map(c => { const d = S.courseProgress(state, c); return `<a class="hbar link-row" href="#/course/${c.id}"><span>${esc(c.tag)}</span><div class="bar-track"><i style="width:${d / c.lessons.length * 100}%"></i></div><b class="num">${d}/${c.lessons.length}</b></a>`; }).join("")}</section>
    <section class="card pad"><p class="eyebrow">Recent</p>${recent ? `<ul class="log">${recent}</ul>` : `<p class="empty">Nothing yet. Your first challenge shows up here.</p>`}</section>
    ${journal ? `<section class="card pad"><p class="eyebrow">Journal</p>${journal}</section>` : ""}
  </div>`;
}

// ---------- Settings ----------
function settings() {
  const x = state.settings;
  const stepper = (key, label, hint, step, fmt) => `<div class="setrow"><div><b>${label}</b><small>${hint}</small></div><div class="stepper"><button type="button" data-act="step" data-key="${key}" data-d="${-step}" aria-label="Less">−</button><output>${fmt(x[key])}</output><button type="button" data-act="step" data-key="${key}" data-d="${step}" aria-label="More">+</button></div></div>`;
  const toggle = (path, label, hint, on, dis = false) => `<label class="setrow"><div><b>${label}</b>${hint ? `<small>${hint}</small>` : ""}</div><span class="switch"><input type="checkbox" data-set="${path}" ${on ? "checked" : ""} ${dis ? "disabled" : ""}><i></i></span></label>`;
  const EFF = [[0.5, "Light"], [1, "Standard"], [1.5, "Hard"], [2, "Max"]];
  const onCats = Object.values(x.cats).filter(Boolean).length;
  const sample = scaled(byId("pushups"), x.effort).target, sq = scaled(byId("squats"), x.effort).target;
  view.innerHTML = `<div class="page settings">
    <header class="top plain"><div class="mark dark">${LOGO}Settings</div>${pill()}</header>
    <h2 class="grp">The deal</h2>
    <section class="card">
      ${stepper("sessionMin", "App time per challenge", "Minutes each challenge unlocks", 5, fmtMin)}
      ${stepper("maxBankMin", "Most you can bank", "Stops you stacking up hours", 15, fmtMin)}
      ${stepper("dailyCapMin", "Daily limit", "Total app time you can earn in a day", 15, v => (v ? fmtMin(v) : "Off"))}
    </section>
    <h2 class="grp">Effort</h2>
    <section class="card pad">
      <div class="seg" role="group" aria-label="Effort">${EFF.map(([v, l]) => `<button type="button" data-act="effort" data-v="${v}" class="${x.effort === v ? "on" : ""}">${l}</button>`).join("")}</div>
      <p class="mini">Right now: ${sample} push-ups, ${sq} squats, and timed challenges scaled to match. Lessons stay the same length.</p>
    </section>
    <h2 class="grp">Kinds of challenge</h2>
    <section class="card">${Object.keys(CATS).map(k => toggle(`cats.${k}`, CATS[k].name, CATS[k].blurb, x.cats[k], x.cats[k] && onCats === 1)).join("")}</section>
    <details class="card fold"><summary>Individual challenges</summary>${CHALLENGES.map(c => toggle(`off.${c.id}`, c.title, CATS[c.cat].name, !x.off[c.id])).join("")}<p class="mini pad">Courses are switched on and off in the Learn tab.</p></details>
    <h2 class="grp">How it checks</h2>
    <section class="card">
      ${toggle("camera", "Camera rep counting", "Push-ups and squats are counted on-device. Off means tapping.", x.camera)}
      ${toggle("readTimer", "Minimum reading time", "The quiz unlocks after about a minute of reading.", x.readTimer)}
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
    <p class="mini center">Stim · <a href="https://github.com/bgalpers/Stim" target="_blank" rel="noopener">source</a></p>
  </div>`;
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
document.addEventListener("click", e => {
  const a = e.target.closest('a[href^="#/"]');
  if (a && !e.metaKey && !e.ctrlKey) { e.preventDefault(); go(a.getAttribute("href")); }
});
const sync = () => { if (location.hash !== current && /^(#\/.*)?$/.test(location.hash)) go(location.hash || "#/", false); };
addEventListener("popstate", sync); addEventListener("hashchange", sync);
document.addEventListener("visibilitychange", () => { if (!document.hidden && !path()) home(); });
route();
