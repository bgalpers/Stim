// Helpers for writing lessons compactly.
export const L = (id, title, body, takeaway, quiz) => ({ id, title, body, takeaway, quiz });
export const Q = (q, right, wrong, why) => ({ q, right, wrong, why });
