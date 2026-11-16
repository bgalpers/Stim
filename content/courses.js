// To add a course: export an object shaped like the ones in courses-c.js and list it here.
// Options are shuffled when a question is shown, so write the right answer first.
import { finance, history } from "./courses-a.js";
import { economics, psychology } from "./courses-b.js";
import { money, numbers, space } from "./courses-c.js";
import { body, tech, philosophy } from "./courses-d.js";
import { civics, ancient, talk } from "./courses-e.js";

const LOOK = { finance: ["📈", "#10b8a6"], history: ["🕰️", "#b45309"], economics: ["⚖️", "#0891b2"], psychology: ["🧠", "#8b5cf6"] };
// older lessons list four options and an answer index; bring them to the {right, wrong} shape
const norm = q => (q.right ? q : { q: q.q, right: q.o[q.a], wrong: q.o.filter((_, i) => i !== q.a), why: q.why });

export const COURSES = [finance, money, economics, numbers, psychology, talk, history, ancient, civics, philosophy, space, body, tech].map(c => ({
  ...c, icon: c.icon || LOOK[c.id][0], color: c.color || LOOK[c.id][1],
  lessons: c.lessons.map(l => ({ ...l, quiz: l.quiz.map(norm) })),
}));
export const courseById = id => COURSES.find(c => c.id === id);
export const findLesson = id => {
  for (const c of COURSES) { const i = c.lessons.findIndex(x => x.id === id); if (i >= 0) return { course: c, lesson: c.lessons[i], index: i }; }
  return null;
};
export const wordCount = lesson => lesson.body.join(" ").split(/\s+/).length;
