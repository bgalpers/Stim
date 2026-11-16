import test from "node:test";
import assert from "node:assert/strict";
import * as S from "../js/store.js";
import { CHALLENGES, scaled, byId } from "../js/catalog.js";
import { COURSES, wordCount } from "../content/courses.js";
import { buildBriefing, buildOnThisDay, strip } from "../js/news.js";
import { makeCounter, MODES } from "../js/pose.js";

const MIN = 60_000, DAY = 86_400_000;
const T0 = new Date(2026, 10, 16, 13, 0).getTime();   // Mon 16 Nov 2026, 1 PM local
const fresh = () => S.merge(null);
const win = (s, t, id = "pushups") => S.grant(s, { id, cat: "move", title: id }, t);

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
  assert.equal(S.remainingMs(s, T0), 60 * MIN);
  assert.equal(win(s, T0).min, 0, "bank full");
  assert.equal(win(s, T0 + 10 * MIN).min, 10, "only tops up to the limit");
  assert.equal(S.remainingMs(s, T0 + 10 * MIN), 60 * MIN);
});

test("daily limit caps what can be earned and resets next day", () => {
  const s = fresh(); s.settings.dailyCapMin = 45;
  assert.equal(win(s, T0).min, 30);
  assert.equal(win(s, T0 + 40 * MIN).min, 15);
  assert.equal(win(s, T0 + 2 * 60 * MIN).min, 0);
  assert.equal(S.capLeft(s, T0 + 3 * 60 * MIN), 0);
  assert.equal(win(s, T0 + DAY).min, 30);
});

test("settings are clamped to sane values", () => {
  const s = S.merge({ settings: { sessionMin: 999, maxBankMin: 1, effort: 9, dailyCapMin: -5 } });
  assert.equal(s.settings.sessionMin, 180);
  assert.equal(s.settings.maxBankMin, 180, "bank can't be smaller than one session");
  assert.equal(s.settings.effort, 2);
  assert.equal(s.settings.dailyCapMin, 0);
  assert.equal(s.settings.cats.news, true, "missing keys fall back to defaults");
});

test("streak counts consecutive days with a completed challenge", () => {
  const s = fresh();
  assert.equal(S.streak(s, T0), 0);
  win(s, T0 - 2 * DAY); win(s, T0 - DAY);
  assert.equal(S.streak(s, T0), 2, "today still open: yesterday's streak stands");
  win(s, T0);
  assert.equal(S.streak(s, T0), 3);
  assert.equal(S.streak(s, T0 + 2 * DAY), 0, "a missed day breaks it");
});

test("a skip unlocks time but does not count for the streak", () => {
  const s = fresh();
  win(s, T0 - DAY);
  const e = S.grant(s, { id: "skip", cat: "skip", title: "Skipped", kind: "skip" }, T0);
  assert.equal(e.min, 30);
  assert.equal(S.dayStatus(s, S.dayKey(T0, 4)), "skip");
  assert.equal(S.streak(s, T0 + DAY), 0);
  win(s, T0 + 60 * MIN);
  assert.equal(S.dayStatus(s, S.dayKey(T0, 4)), "done", "a real challenge the same day overrides the skip");
});

test("the day rolls over at the reset hour, not midnight", () => {
  const late = new Date(2026, 10, 17, 1, 30).getTime();   // 1:30 AM Tuesday
  assert.equal(S.dayKey(late, 4), "2026-11-16");
  assert.equal(S.dayKey(late, 0), "2026-11-17");
});

test("week view marks today and the right statuses", () => {
  const s = fresh(); win(s, T0); win(s, T0 + MIN);
  const w = S.week(s, T0);
  assert.equal(w.length, 7);
  assert.deepEqual(w.map(d => d.today), [true, false, false, false, false, false, false]);
  assert.equal(w[0].count, 2); assert.equal(w[1].future, true);
});

test("effort scales reps and timed work, and ids are unique", () => {
  assert.equal(scaled(byId("pushups"), 1).target, 25);
  assert.equal(scaled(byId("pushups"), 2).target, 50);
  assert.equal(scaled(byId("squats"), 0.5).target, 25);
  assert.equal(scaled(byId("jacks"), 1.5).target, 150);
  const plank = scaled(byId("plank"), 2).steps;
  assert.equal(plank.find(x => !x.rest).s, 90); assert.equal(plank.find(x => x.rest).s, 30);
  assert.equal(scaled(byId("breathing"), 1).seconds % 16, 0, "whole breathing cycles");
  assert.equal(new Set(CHALLENGES.map(c => c.id)).size, CHALLENGES.length);
  for (const c of CHALLENGES) { const m = scaled(c, 1).estMin; assert.ok(m >= 2 && m <= 10, `${c.id} est ${m}`); }
});

test("every lesson is well-formed", () => {
  const ids = new Set();
  for (const c of COURSES) {
    assert.ok(c.lessons.length >= 5, c.id);
    for (const l of c.lessons) {
      assert.ok(!ids.has(l.id), `duplicate ${l.id}`); ids.add(l.id);
      const w = wordCount(l);
      assert.ok(w >= 230 && w <= 520, `${l.id} has ${w} words`);
      assert.ok(l.takeaway.length > 30, l.id);
      assert.equal(l.quiz.length, 3, l.id);
      for (const q of l.quiz) {
        assert.equal(q.o.length, 4, `${l.id}: ${q.q}`);
        assert.equal(new Set(q.o).size, 4, `${l.id}: duplicate options`);
        assert.ok(Number.isInteger(q.a) && q.a >= 0 && q.a < 4, `${l.id}: answer index`);
        assert.ok(q.why.length > 15, l.id);
      }
    }
    const pos = c.lessons.flatMap(l => l.quiz.map(q => q.a));
    assert.ok(new Set(pos).size === 4, `${c.id}: correct answers should not sit in one slot`);
  }
});

test("course progress and next lesson", () => {
  const s = fresh(), c = COURSES[0];
  assert.equal(S.nextLesson(s, c).id, c.lessons[0].id);
  s.courses.done[c.lessons[0].id] = T0;
  assert.equal(S.nextLesson(s, c).id, c.lessons[1].id);
  assert.equal(S.courseProgress(s, c), 1);
  for (const l of c.lessons) s.courses.done[l.id] = T0;
  assert.equal(S.nextLesson(s, c), null);
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

test("briefing is built from the feed with answerable fill-in questions", () => {
  assert.equal(strip(FEED.news[0].story), "In rugby, Freedonia win the World Cup & celebrate.");
  const b = buildBriefing(FEED, "2026/11/16");
  assert.equal(b.blocks.length, 3);
  assert.ok(b.quiz.length >= 2);
  for (const q of b.quiz) {
    assert.ok(q.q.includes("_____"));
    assert.equal(q.o.length, 4); assert.equal(new Set(q.o).size, 4);
    assert.ok(q.why.toLowerCase().includes(q.o[q.a].toLowerCase()), "the answer is in the story");
    assert.ok(!q.q.toLowerCase().includes(q.o[q.a].toLowerCase()), "and blanked out of the question");
  }
  assert.deepEqual(buildBriefing(FEED, "2026/11/16"), b, "same day, same questions");
  assert.equal(buildBriefing({ news: [] }, "x"), null);
  assert.equal(buildBriefing({}, "x"), null);
});

test("on-this-day quiz matches events to years", () => {
  const o = buildOnThisDay(FEED, "2026/11/16", new Date(2026, 10, 16));
  assert.equal(o.title, "November 16");
  assert.equal(o.blocks.length, 5); assert.equal(o.quiz.length, 3);
  for (const q of o.quiz) { assert.equal(q.o.length, 4); assert.ok(q.q.includes(`Event of ${q.o[q.a]}`)); }
  assert.equal(buildOnThisDay({ onthisday: FEED.onthisday.slice(0, 2) }, "x"), null);
});

test("rep counter needs a full down-then-up cycle", () => {
  const c = makeCounter(MODES.pushup);
  let reps = 0; const feed = (a, n = 8) => { for (let i = 0; i < n; i++) if (c.feed(a).rep) reps++; };
  feed(170); assert.equal(reps, 0);
  feed(125); feed(170); assert.equal(reps, 0, "a half rep does not count");
  feed(80); assert.equal(reps, 0); feed(170); assert.equal(reps, 1);
  feed(80); feed(170); feed(85); feed(165); assert.equal(reps, 3);
  const s = makeCounter(MODES.squat); reps = 0;
  for (const a of [175, 175, 175, 90, 90, 90, 90, 90, 175, 175, 175, 175, 175]) if (s.feed(a).rep) reps++;
  assert.equal(reps, 1);
});
