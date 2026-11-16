// The fixed challenges. Lessons and the daily briefing are generated elsewhere.
// type: "reps" (camera or tap), "timed" (guided intervals), "breath", "journal", "feed"

export const CATS = {
  move:  { name: "Move",  blurb: "No-equipment exercise" },
  learn: { name: "Learn", blurb: "A lesson from your courses" },
  news:  { name: "News",  blurb: "Read today, answer questions" },
  reset: { name: "Reset", blurb: "Breathe or write" },
};

const sets = (n, work, rest, label, cue) =>
  Array.from({ length: n }, (_, i) => [
    { label: n > 1 ? `${label} ${i + 1} of ${n}` : label, s: work, cue },
    ...(i < n - 1 ? [{ label: "Rest", s: rest, rest: true, cue: "Shake it out." }] : []),
  ]).flat();

export const CHALLENGES = [
  { id: "pushups", cat: "move", type: "reps", title: "Push-ups", base: 25, est: 4, pose: "pushup", unit: "push-ups",
    tips: ["Lean the phone on the floor 1.5–2 m to your side, front camera facing you.", "Keep your head, arm and hips in frame.", "Break it into as many sets as you need."] },
  { id: "squats", cat: "move", type: "reps", title: "Squats", base: 50, est: 5, pose: "squat", unit: "squats",
    tips: ["Stand side-on, 2–3 m from the phone, whole body in frame.", "Sit back until your thighs are about parallel to the floor.", "Stand all the way up for the rep to count."] },
  { id: "lunges", cat: "move", type: "reps", title: "Alternating lunges", base: 30, est: 5, unit: "lunges",
    tips: ["Step forward, lower until both knees are near 90°.", "Push back to standing, switch legs. Each leg counts as one."] },
  { id: "jacks", cat: "move", type: "reps", title: "Jumping jacks", base: 100, est: 4, unit: "jacks", step: 10,
    tips: ["Count in tens: tap once for every ten.", "Land softly, keep a steady rhythm."] },
  { id: "burpees", cat: "move", type: "reps", title: "Burpees", base: 15, est: 5, unit: "burpees",
    tips: ["Squat, kick back to a plank, chest to floor, jump up.", "Slow and clean beats fast and sloppy."] },
  { id: "plank", cat: "move", type: "timed", title: "Plank sets", est: 5,
    steps: sets(4, 45, 30, "Plank", "Elbows under shoulders. Straight line from head to heels."),
    tips: ["Forearm plank. Drop to your knees if your hips sag."] },
  { id: "wallsit", cat: "move", type: "timed", title: "Wall sits", est: 5,
    steps: sets(4, 45, 30, "Wall sit", "Back flat on the wall, thighs parallel, knees over ankles."),
    tips: ["Find a clear bit of wall."] },
  { id: "circuit", cat: "move", type: "timed", title: "Bodyweight circuit", est: 7,
    steps: [
      ["High knees", "Drive your knees to hip height."], ["Push-ups", "Any variation. Keep moving."],
      ["Squats", "Sit back, chest up."], ["Mountain climbers", "Hips low, quick feet."],
      ["Glute bridges", "Squeeze at the top."], ["Plank", "Hold steady."], ["Jumping jacks", "Finish strong."],
    ].flatMap(([label, cue], i, a) => [{ label, s: 40, cue }, ...(i < a.length - 1 ? [{ label: "Rest", s: 20, rest: true, cue: `Next: ${a[i + 1][0]}` }] : [])]),
    tips: ["Seven moves, 40 seconds on, 20 off."] },
  { id: "mobility", cat: "move", type: "timed", title: "Mobility flow", est: 6, gentle: true,
    steps: [
      ["Neck circles", "Slow, both directions."], ["Arm circles", "Small to large."],
      ["Cat-cow", "On all fours, round then arch your spine."], ["World's greatest stretch, left", "Lunge, elbow to instep, rotate up."],
      ["World's greatest stretch, right", "Same on the other side."], ["Deep squat hold", "Heels down, chest tall."],
      ["Forward fold", "Soft knees, let your head hang."], ["Child's pose", "Hips back, arms long, breathe."],
    ].map(([label, cue]) => ({ label, s: 45, cue })),
    tips: ["Eight stretches, 45 seconds each. No rests needed."] },

  { id: "breathing", cat: "reset", type: "breath", title: "Box breathing", est: 5, seconds: 300,
    tips: ["In for 4, hold 4, out for 4, hold 4.", "Sit upright, phone down in front of you."] },
  { id: "journal", cat: "reset", type: "journal", title: "Write for five", est: 5, words: 60,
    tips: ["A few honest sentences. Nobody else reads this."] },

  { id: "briefing", cat: "news", type: "feed", feed: "news", title: "Today's briefing", est: 6, daily: true,
    tips: ["Current stories from Wikipedia's “In the news”, then questions on what you read."] },
  { id: "onthisday", cat: "news", type: "feed", feed: "onthisday", title: "On this day", est: 5, daily: true,
    tips: ["Five things that happened on today's date, then a recall quiz."] },
];

export const byId = id => CHALLENGES.find(c => c.id === id);

const round5 = n => Math.max(5, Math.round(n / 5) * 5);

/** Apply the effort setting. Returns a copy with concrete targets. */
export function scaled(ch, effort = 1) {
  const c = { ...ch };
  if (ch.type === "reps") c.target = ch.step ? Math.max(ch.step, Math.round(ch.base * effort / ch.step) * ch.step) : round5(ch.base * effort);
  if (ch.type === "timed") c.steps = ch.steps.map(s => ({ ...s, s: s.rest ? s.s : round5(s.s * effort) }));
  if (ch.type === "breath") c.seconds = Math.round(ch.seconds * effort / 16) * 16;
  if (ch.type === "journal") c.words = round5(ch.words * effort);
  c.estMin = ["feed"].includes(ch.type) ? ch.est : Math.max(2, Math.round(ch.est * (ch.type === "timed" ? 0.4 + 0.6 * effort : effort)));
  return c;
}

export const JOURNAL_PROMPTS = [
  "What did you actually want when you reached for your phone just now?",
  "Describe one thing you did this week that you're quietly proud of.",
  "What's one task you're avoiding, and what is the smallest first step?",
  "Who helped you recently? What would you say to thank them?",
  "What would make today a good day, looking back from tonight?",
  "Write about something you changed your mind on in the last year.",
  "What are you learning right now, and why does it matter to you?",
  "If you had an extra free hour every day, what would you do with it?",
  "Describe a place where you feel calm, in as much detail as you can.",
  "What habit would the person you want to be in five years already have?",
  "What's been taking more of your attention than it deserves?",
  "Write down three specific things that went well in the last 24 hours and why.",
  "What conversation do you need to have that you keep putting off?",
  "What did you last read, watch or hear that changed how you see something?",
];
