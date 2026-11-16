import test from "node:test";
import assert from "node:assert/strict";
import * as S from "../js/store.js";
import { CHALLENGES, CATS, scaled, byId, summary, primary, PROMPTS } from "../js/catalog.js";
import { COURSES, wordCount } from "../content/courses.js";
import { buildBriefing, buildOnThisDay, strip } from "../js/news.js";
import { makeTracker, MODES } from "../js/pose.js";

const MIN = 60_000, DAY = 86_400_000;
const T0 = new Date(2026, 10, 16, 13, 0).getTime();   // Mon 16 Nov 2026, 1 PM local
const fresh = () => S.merge(null);
const win = (s, t, id = "pushups", bonus = 0, takeMin) => S.grant(s, { id, cat: "move", title: id, bonus, takeMin }, t);

test("a challenge earns one session and the clock runs down", () => {
  const s = fresh();
  assert.equal(S.isOpen(s, T0), false);
  assert.equal(win(s, T0).min, 30);
  assert.equal(S.remainingMs(s, T0), 30 * MIN);
  assert.equal(S.isOpen(s, T0 + 29 * MIN), true);
  assert.equal(S.isOpen(s, T0 + 30 * MIN), false);
});

test("time stacks up to the bank limit, never past it", () => {
  const s = fresh();
  win(s, T0); assert.equal(win(s, T0).min, 30);
  assert.equal(win(s, T0).min, 0, "bank full");
  assert.equal(win(s, T0 + 10 * MIN).min, 10, "only tops up to the limit");
  assert.equal(S.remainingMs(s, T0 + 10 * MIN), 60 * MIN);
});

test("daily limit caps what can be earned and resets next day", () => {
  const s = fresh(); s.settings.dailyCapMin = 45;
  assert.equal(win(s, T0).min, 30);
  assert.equal(win(s, T0 + 40 * MIN).min, 15);
  assert.equal(win(s, T0 + 2 * 60 * MIN).min, 0);
  assert.equal(win(s, T0 + DAY).min, 30);
});

test("settings are clamped to sane values", () => {
  const s = S.merge({ settings: { sessionMin: 999, maxBankMin: 1, effort: 9, dailyCapMin: -5, goalPerDay: 99 } });
  assert.equal(s.settings.sessionMin, 180);
  assert.equal(s.settings.maxBankMin, 180, "bank can't be smaller than one session");
  assert.equal(s.settings.effort, 2);
  assert.equal(s.settings.dailyCapMin, 0);
  assert.equal(s.settings.goalPerDay, 10);
  assert.equal(s.settings.cats.mind, true, "missing keys fall back to defaults");
});

test("streak counts consecutive days with a completed challenge", () => {
  const s = fresh();
  win(s, T0 - 2 * DAY); win(s, T0 - DAY);
  assert.equal(S.streak(s, T0), 2, "today still open: yesterday's streak stands");
  win(s, T0);
  assert.equal(S.streak(s, T0), 3);
  assert.equal(S.streak(s, T0 + 2 * DAY), 0, "a missed day breaks it");
});

test("a skip unlocks time but earns no XP and no streak", () => {
  const s = fresh();
  win(s, T0 - DAY);
  const e = S.grant(s, { id: "skip", cat: "skip", title: "Skipped", kind: "skip" }, T0);
  assert.equal(e.min, 30); assert.equal(e.xp, 0);
  assert.equal(S.streak(s, T0 + DAY), 0);
});

test("the slider trades app time for XP", () => {
  const s = fresh();
  assert.equal(win(s, T0).xp, 0, "taking the full 30 minutes leaves no XP");
  const half = win(s, T0 + MIN, "squats", 0, 15);
  assert.equal(half.min, 15); assert.equal(half.xp, 10, "half the time, half the XP");
  const none = win(s, T0 + 2 * MIN, "squats", 5, 0);
  assert.equal(none.min, 0); assert.equal(none.xp, 25, "no time: full XP plus bonus");
  assert.equal(S.remainingMs(s, T0 + 2 * MIN), 43 * MIN);
  assert.equal(win(s, T0 + 3 * MIN, "x", 0, 999).min, 18, "can't take more than is on offer");
  assert.equal(S.xpFor(s, 0, { scale: 1.6 }), 32); assert.equal(S.xpFor(s, 0, { scale: 0.4 }), 8);
  assert.equal(S.xpFor(s, 0, { bonus: 99, scale: 9 }), 50, "bonus and scale are capped");
});

test("levels, spendable XP, buying items, day history", () => {
  const s = fresh();
  for (let i = 0; i < 6; i++) win(s, T0 - DAY + i * MIN, "pushups", 0, 0);
  assert.deepEqual(S.level(s), { xp: 120, level: 2, into: 20, need: 100 });
  assert.equal(S.buy(s, "crown", 400), false); assert.equal(S.coins(s), 120);
  assert.equal(S.buy(s, "glasses", 60), true); assert.equal(S.coins(s), 60);
  assert.equal(S.buy(s, "glasses", 60), true, "already owned costs nothing"); assert.equal(S.coins(s), 60);
  assert.equal(S.level(s).xp, 120, "spending doesn't lower your level");
  win(s, T0, "a", 0, 0); win(s, T0 + MIN, "b", 0, 0);
  assert.equal(S.doneCountToday(s, T0 + 3 * MIN), 2);
  const d = S.days(s, 7, T0 + 3 * MIN);
  assert.equal(d[6].count, 2); assert.equal(d[5].count, 6); assert.equal(d[0].count, 0);
  const again = S.merge(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(again.owned, ["glasses"]); assert.equal(again.spent, 60);
});

test("exercise difficulty: easy 10, medium 25, hard 40, or custom", () => {
  const s = fresh(), reps = id => { const l = S.moveLevel(s, id); return scaled(byId(id), 1, l.mult).stations[0].reps; };
  assert.equal(reps("pushups"), 25);
  s.settings.diff.pushups = { mode: "easy" }; assert.equal(reps("pushups"), 10);
  s.settings.diff.pushups = { mode: "hard" }; assert.equal(reps("pushups"), 40);
  s.settings.diff.pushups = { mode: "custom", mult: 60 / 25 }; assert.equal(reps("pushups"), 60);
  assert.equal(reps("squats"), 50, "other exercises keep the default");
  s.settings.moveDefault = "easy"; assert.equal(reps("squats"), 20);
  assert.deepEqual(primary(byId("pushups")), { base: 25, unit: "reps" });
  assert.deepEqual(primary(byId("plank")), { base: 40, unit: "sec each" });
  assert.equal(primary(byId("fullbody")), null);
});

test("the day rolls over at the reset hour, not midnight", () => {
  const late = new Date(2026, 10, 17, 1, 30).getTime();
  assert.equal(S.dayKey(late, 4), "2026-11-16");
  assert.equal(S.dayKey(late, 0), "2026-11-17");
});

test("catalogue: every exercise has a camera pose, effort scales, estimates are short", () => {
  assert.equal(new Set(CHALLENGES.map(c => c.id)).size, CHALLENGES.length);
  const moves = CHALLENGES.filter(c => c.type === "move");
  assert.ok(moves.length >= 18, `${moves.length} exercises`);
  for (const c of moves) for (const st of c.stations) {
    if (st.rest) continue;
    const m = MODES[st.pose]; assert.ok(m, `${c.id}: unknown pose ${st.pose}`);
    assert.equal(!!st.reps, m.kind === "rep", `${c.id}: ${st.pose} is a ${m.kind}`);
  }
  assert.equal(scaled(byId("pushups"), 1).stations[0].reps, 25);
  assert.equal(scaled(byId("pushups"), 1, 2).stations[0].reps, 50);
  const plank = scaled(byId("plank"), 1, 2).stations;
  assert.equal(plank[0].s, 80); assert.equal(plank[1].rest, 20, "rests don't scale");
  assert.equal(summary(scaled(byId("plank"), 1)), "3 × 40 sec");
  assert.equal(summary(scaled(byId("fullbody"), 1)), "5 stations");
  assert.equal(scaled(byId("breathing"), 1).seconds % 16, 0);
  for (const c of CHALLENGES) { assert.ok(CATS[c.cat], c.id); assert.ok(c.icon, c.id); const m = scaled(c, 1).estMin; assert.ok(m >= 1 && m <= 8, `${c.id} est ${m}`); }
  for (const c of CHALLENGES.filter(x => x.type === "journal")) assert.ok(PROMPTS[c.prompts].length, c.id);
});

test("every lesson is well-formed", () => {
  const ids = new Set();
  assert.ok(COURSES.length >= 13);
  for (const c of COURSES) {
    assert.ok(c.icon && c.color && c.tag && c.blurb, c.id);
    assert.ok(c.lessons.length >= 4, c.id);
    for (const l of c.lessons) {
      assert.ok(!ids.has(l.id), `duplicate ${l.id}`); ids.add(l.id);
      const w = wordCount(l);
      assert.ok(w >= 110 && w <= 520, `${l.id} has ${w} words`);
      assert.ok(l.body.length >= 3 && l.body.every(p => p.split(/\s+/).length <= 110), `${l.id}: cards too long`);
      assert.ok(l.takeaway.length > 30, l.id);
      assert.equal(l.quiz.length, 3, l.id);
      for (const q of l.quiz) {
        assert.ok(q.right && q.wrong.length === 3, `${l.id}: ${q.q}`);
        assert.equal(new Set([q.right, ...q.wrong]).size, 4, `${l.id}: duplicate options in "${q.q}"`);
        assert.ok(q.why.length > 15, l.id);
      }
    }
  }
  assert.ok(ids.size >= 60);
});

test("course progress and next lesson", () => {
  const s = fresh(), c = COURSES[0];
  assert.equal(S.nextLesson(s, c).id, c.lessons[0].id);
  s.courses.done[c.lessons[0].id] = T0;
  assert.equal(S.nextLesson(s, c).id, c.lessons[1].id);
  for (const l of c.lessons) s.courses.done[l.id] = T0;
  assert.equal(S.nextLesson(s, c), null);
  for (const id of s.courses.enrolled) assert.ok(COURSES.some(x => x.id === id), id);
});

const page = (t, extract = `${t} is a thing that exists and has a reasonably long description for testing purposes. Second sentence.`) =>
  ({ title: t.replace(/ /g, "_"), titles: { normalized: t }, extract, content_urls: { mobile: { page: `https://en.m.wikipedia.org/wiki/${t}` } } });
const FEED = {
  news: [
    { story: "<!--Nov 14-->In rugby, <a href='./x'>Freedonia</a> win the <b><a>World Cup</a></b> &amp; celebrate.", links: [page("Freedonia"), page("World Cup")] },
    { story: "A magnitude 7 earthquake strikes <a>Sylvania</a>, damaging the capital.", links: [page("Sylvania")] },
    { story: "<a>Ada Example</a> is elected president of <a>Ruritania</a>.", links: [page("Ada Example"), page("Ruritania")] },
  ],
  mostread: { articles: [page("Some Film"), page("A Singer"), page("Another Topic")] },
  onthisday: [1532, 1849, 1914, 1945, 1965, 1988, 2022].map(y => ({ year: y, text: `Event of ${y} happened.`, pages: [page(`Topic ${y}`)] })),
};
test("news briefing and on-this-day are built from the feed", () => {
  assert.equal(strip(FEED.news[0].story), "In rugby, Freedonia win the World Cup & celebrate.");
  const b = buildBriefing(FEED, "2026/11/16");
  assert.equal(b.blocks.length, 3); assert.ok(b.quiz.length >= 2);
  for (const q of b.quiz) { assert.ok(q.q.includes("_____")); assert.equal(new Set(q.o).size, 4); assert.ok(!q.q.toLowerCase().includes(q.o[q.a].toLowerCase())); }
  assert.equal(buildBriefing({}, "x"), null);
  const o = buildOnThisDay(FEED, "2026/11/16", new Date(2026, 10, 16));
  assert.equal(o.title, "November 16"); assert.equal(o.quiz.length, 3);
  for (const q of o.quiz) assert.ok(q.q.includes(`Event of ${q.o[q.a]}`));
});

// ---- camera rules, fed with stick figures (x right, y down, units arbitrary) ----
const IDX = { sh: [11, 12], el: [13, 14], wr: [15, 16], hip: [23, 24], kn: [25, 26], an: [27, 28] };
function fig(parts, right) {
  const lm = Array.from({ length: 33 }, () => ({ x: 0, y: 0, visibility: 0 }));
  for (const [k, [x, y]] of Object.entries(parts)) { const r = right?.[k] || [x, y]; lm[IDX[k][0]] = { x, y, visibility: 1 }; lm[IDX[k][1]] = { x: r[0], y: r[1], visibility: 1 }; }
  return lm;
}
const run = (name, frames, n = 8) => { const t = makeTracker(name); let reps = 0, last; for (const f0 of frames) { const f = Array.isArray(f0) ? f0 : fig(f0); for (let i = 0; i < n; i++) { last = t.feed(f); if (last.rep) reps++; } } return { reps, last }; };
const stand = { sh: [0, 0], el: [0, 2], wr: [0, 4], hip: [0, 5], kn: [0, 8], an: [0, 11] };
const squatDown = { sh: [1.5, 2.5], el: [2, 4], wr: [3, 4], hip: [-1.5, 7], kn: [1.5, 8], an: [0, 11] };
const plankUp = { sh: [0, 0], el: [0, 1.5], wr: [0, 3], hip: [5, 0.6], kn: [8, 1.2], an: [11, 1.8] };
const plankDown = { sh: [0, 2], el: [-1.4, 1.6], wr: [0, 3], hip: [5, 2.2], kn: [8, 2.4], an: [11, 2.6] };

test("camera: squats and push-ups need a full down-and-up, in the right posture", () => {
  assert.equal(run("squat", [stand, squatDown, stand, squatDown, stand]).reps, 2);
  assert.equal(run("squat", [stand, stand, stand]).reps, 0);
  assert.equal(run("pushup", [plankUp, plankDown, plankUp, plankDown, plankUp, plankDown, plankUp]).reps, 3);
  const armsBent = { ...stand, el: [1, 1.5], wr: [0, 0.5] };
  assert.equal(run("pushup", [stand, armsBent, stand, armsBent, stand]).reps, 0, "bending your arms while standing is not a push-up");
});

test("camera: jumping jacks, high knees, burpees, sit-ups, bridges", () => {
  const front = { sh: [-1, 0], wr: [-1.5, 4.5], hip: [-0.7, 5], kn: [-0.7, 8], an: [-0.7, 11] }, frontR = { sh: [1, 0], wr: [1.5, 4.5], hip: [0.7, 5], kn: [0.7, 8], an: [0.7, 11] };
  const up = { ...front, wr: [-2, -4] }, upR = { ...frontR, wr: [2, -4] };
  assert.equal(run("jacks", [fig(front, frontR), fig(up, upR), fig(front, frontR), fig(up, upR), fig(front, frontR)].map(x => x), 8).reps, 2);
  const kneeL = { ...front, kn: [-0.7, 5.3] };
  assert.equal(run("highknees", [fig(front, frontR), fig(kneeL, frontR), fig(front, frontR), fig(front, { ...frontR, kn: [0.7, 5.3] }), fig(front, frontR)]).reps, 2);
  assert.equal(run("burpee", [stand, plankDown, stand, plankDown, stand]).reps, 2);
  const lying = { sh: [0, 10], hip: [5, 10], kn: [7.5, 8], an: [9.5, 10] }, satUp = { sh: [4, 5.5], hip: [5, 10], kn: [7.5, 8], an: [9.5, 10] };
  assert.equal(run("situp", [lying, satUp, lying, satUp, lying]).reps, 2);
  const bridgeUp = { sh: [0, 10], hip: [5, 8.2], kn: [7.5, 7], an: [8, 10] };
  assert.equal(run("bridge", [lying, bridgeUp, lying, bridgeUp, lying]).reps, 2);
  assert.equal(run("situp", [stand, stand]).reps, 0);
});

test("camera: holds only count in the right position, and losing the body is reported", () => {
  const forearm = { sh: [0, 0], el: [0, 2.2], wr: [2, 2.2], hip: [5, 0.5], kn: [8, 1.2], an: [11, 1.9] };
  assert.equal(run("plank", [forearm]).last.holding, true);
  assert.equal(run("plank", [stand]).last.holding, false);
  const flat = { sh: [0, 2], el: [2, 2], wr: [4, 2], hip: [5, 2], kn: [8, 2], an: [11, 2] };
  assert.equal(run("plank", [flat]).last.holding, false, "lying flat is not a plank");
  const sit = { sh: [0, 0], el: [0, 2], wr: [1, 4], hip: [0, 5], kn: [3, 5.2], an: [3, 8.2] };
  assert.equal(run("wallsit", [sit]).last.holding, true);
  assert.equal(run("wallsit", [stand]).last.holding, false);
  assert.equal(run("balance", [fig(stand, { an: [0.6, 9] })]).last.holding, true);
  assert.equal(run("balance", [fig(stand)]).last.holding, false);
  const hidden = fig(stand); hidden.forEach(p => (p.visibility = 0.1));
  assert.equal(makeTracker("squat").feed(hidden).state, "lost");
  // a hold survives a brief flicker but not a real break
  const t = makeTracker("plank"); for (let i = 0; i < 5; i++) t.feed(fig(forearm));
  for (let i = 0; i < 4; i++) t.feed(fig(stand)); assert.equal(t.feed(fig(forearm)).holding, true);
  for (let i = 0; i < 10; i++) t.feed(fig(stand)); assert.equal(t.feed(fig(stand)).holding, false);
});
