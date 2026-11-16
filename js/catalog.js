// Every fixed challenge. Lessons and the daily briefing are generated elsewhere.
// Move challenges are a list of camera "stations": {pose, reps} | {pose, s} (a hold) | {rest: s}.

import { MODES } from "./pose.js";

export const CATS = {
  move:  { name: "Move",  blurb: "No-equipment exercise, tracked by camera", icon: "⚡" },
  learn: { name: "Learn", blurb: "A lesson from your courses", icon: "📚" },
  news:  { name: "News",  blurb: "Read today, answer questions", icon: "📰" },
  mind:  { name: "Mind",  blurb: "Focus, memory, breathing, writing", icon: "🧠" },
};

const R = (pose, reps) => ({ pose, reps });
const H = (pose, s, label, cue) => ({ pose, s, ...(label ? { label, cue } : {}) });
const sets = (n, st, rest) => Array.from({ length: n }, (_, i) => (i < n - 1 ? [st, { rest }] : [st])).flat();
const move = (id, icon, title, est, stations, tip) => ({ id, cat: "move", type: "move", icon, title, est, stations, tip });

export const CHALLENGES = [
  move("pushups", "💪", "Push-ups", 4, [R("pushup", 25)]),
  move("squats", "🦵", "Squats", 4, [R("squat", 50)]),
  move("lunges", "🚶", "Alternating lunges", 4, [R("lunge", 30)], "Each leg counts as one."),
  move("jacks", "⭐", "Jumping jacks", 3, [R("jacks", 80)]),
  move("highknees", "🏃", "High knees", 3, [R("highknees", 80)], "Each knee counts as one. Bring it to hip height."),
  move("situps", "🌀", "Sit-ups", 4, [R("situp", 30)], "Knees bent, feet on the floor."),
  move("bridges", "🌉", "Glute bridges", 4, [R("bridge", 30)], "On your back, knees bent, drive your hips up."),
  move("burpees", "🔥", "Burpees", 5, [R("burpee", 15)], "Chest to the floor, then stand all the way up."),
  move("goodmornings", "🙇", "Good mornings", 4, [R("goodmorning", 30)], "Hands behind your head, legs straight, hinge at the hips."),
  move("squatjumps", "🦘", "Squat jumps", 4, [R("squat", 30)], "Squat, then jump as you stand."),
  move("plank", "🪵", "Plank sets", 4, sets(3, H("plank", 40), 20), "Forearms down, elbows under shoulders."),
  move("wallsit", "🧱", "Wall sits", 4, sets(3, H("wallsit", 40), 20), "Back on a wall, or hold a low squat."),
  move("bridgehold", "🌁", "Bridge holds", 4, sets(3, H("bridgehold", 40), 15)),
  move("lungehold", "🗿", "Lunge holds", 4, sets(4, H("lungehold", 25), 8), "Swap legs each round."),
  move("balance", "🦩", "One-leg balance", 4, sets(4, H("balance", 35), 5), "Swap legs each round. Harder than it sounds."),
  move("fullbody", "🎯", "Full-body circuit", 6, [R("jacks", 25), R("squat", 15), R("pushup", 10), R("lunge", 16), H("plank", 30)]),
  move("legs", "🏔️", "Leg day circuit", 6, [R("squat", 20), R("lunge", 20), R("highknees", 30), H("wallsit", 40)]),
  move("core", "🛡️", "Core circuit", 6, [R("situp", 15), H("plank", 30), R("bridge", 15), H("plank", 30)]),
  move("cardio", "💥", "Cardio burst", 5, [R("jacks", 30), R("highknees", 40), R("burpee", 8), R("jacks", 30)]),
  move("mobility", "🧘", "Mobility flow", 5, [
    H("present", 40, "Neck and arm circles", "Slow circles, both directions."), H("present", 40, "Cat-cow", "On all fours: round your spine, then arch it."),
    H("present", 40, "World's greatest stretch", "Lunge, elbow to instep, rotate up. Switch halfway."), H("present", 40, "Deep squat hold", "Heels down, chest tall."),
    H("present", 40, "Forward fold", "Soft knees, let your head hang."), H("present", 40, "Child's pose", "Hips back, arms long, breathe."),
  ], "The camera just checks you're there. Follow the cues."),

  { id: "breathing", cat: "mind", type: "breath", icon: "🌬️", title: "Box breathing", est: 5, seconds: 304 },
  { id: "math", cat: "mind", type: "math", icon: "🔢", title: "Mental math sprint", est: 4, count: 25 },
  { id: "memory", cat: "mind", type: "memory", icon: "🧩", title: "Sequence memory", est: 4, rounds: 7 },
  { id: "journal", cat: "mind", type: "journal", icon: "✍️", title: "Write for five", est: 5, words: 60, prompts: "journal" },
  { id: "gratitude", cat: "mind", type: "journal", icon: "🙏", title: "Three good things", est: 3, words: 40, prompts: "gratitude" },
  { id: "plan", cat: "mind", type: "journal", icon: "🗺️", title: "Plan the next block", est: 3, words: 40, prompts: "plan" },

  { id: "briefing", cat: "news", type: "feed", feed: "news", icon: "🗞️", title: "Today's briefing", est: 5, daily: true },
  { id: "onthisday", cat: "news", type: "feed", feed: "onthisday", icon: "📅", title: "On this day", est: 4, daily: true },
];

export const byId = id => CHALLENGES.find(c => c.id === id);
const round5 = n => Math.max(5, Math.round(n / 5) * 5);

/** Apply the effort setting. Returns a copy with concrete targets. */
export function scaled(ch, effort = 1) {
  const c = { ...ch };
  if (ch.type === "move") c.stations = ch.stations.map(s => (s.rest ? s : s.reps ? { ...s, reps: round5(s.reps * effort) } : { ...s, s: round5(s.s * effort) }));
  if (ch.type === "breath") c.seconds = Math.round(ch.seconds * effort / 16) * 16;
  if (ch.type === "journal") c.words = round5(ch.words * effort);
  if (ch.type === "math") c.count = round5(ch.count * effort);
  if (ch.type === "memory") c.rounds = Math.max(4, Math.round(ch.rounds * (0.6 + 0.4 * effort)));
  c.estMin = ch.type === "feed" ? ch.est : Math.max(2, Math.round(ch.est * (0.4 + 0.6 * effort)));
  return c;
}
export const stationLabel = s => (s.rest ? "Rest" : s.label || MODES[s.pose].name);
export function summary(ch) {
  if (ch.type !== "move") return "";
  const work = ch.stations.filter(s => !s.rest);
  if (work.length === 1) return work[0].reps ? `${work[0].reps} reps` : `${work[0].s} sec`;
  if (work.every(s => s.pose === work[0].pose && !s.label)) return `${work.length} × ${work[0].s} sec`;
  return `${work.length} stations`;
}

export const PROMPTS = {
  journal: [
    "What did you actually want when you reached for your phone just now?",
    "Describe one thing you did this week that you're quietly proud of.",
    "What's one task you're avoiding, and what is the smallest first step?",
    "What would make today a good day, looking back from tonight?",
    "Write about something you changed your mind on in the last year.",
    "What are you learning right now, and why does it matter to you?",
    "If you had an extra free hour every day, what would you do with it?",
    "What habit would the person you want to be in five years already have?",
    "What's been taking more of your attention than it deserves?",
    "What conversation do you need to have that you keep putting off?",
    "What did you last read, watch or hear that changed how you see something?",
    "Describe a place where you feel calm, in as much detail as you can.",
  ],
  gratitude: [
    "Name three specific things that went well in the last 24 hours, and why each one happened.",
    "Who helped you recently? What exactly did they do, and what would you say to thank them?",
    "What's something ordinary in your day that you'd miss if it were gone?",
    "Think of something hard from the past year. What did it give you?",
  ],
  plan: [
    "What are the three things that matter most in the next few hours? What's the first step on each?",
    "What would make the rest of today a win? What could get in the way, and what will you do about it?",
    "List what's on your mind. Then mark the one thing to do next and the one thing to drop.",
  ],
};
