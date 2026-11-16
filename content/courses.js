// To add a course: export an object shaped like the ones in courses-a.js and list it here.
import { finance, history } from "./courses-a.js";
import { economics, psychology } from "./courses-b.js";

export const COURSES = [finance, history, economics, psychology];
export const courseById = id => COURSES.find(c => c.id === id);
export const findLesson = id => {
  for (const c of COURSES) { const l = c.lessons.find(x => x.id === id); if (l) return { course: c, lesson: l, index: c.lessons.indexOf(l) }; }
  return null;
};
export const wordCount = lesson => lesson.body.join(" ").split(/\s+/).length;
