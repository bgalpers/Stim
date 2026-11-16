// Camera tracking for every exercise (MediaPipe pose, on-device; no video leaves the phone).
// Each pose is either a "rep" (a measurement that must swing past two thresholds)
// or a "hold" (a position that must be kept). The rules are pure functions so they can be tested.

const MP = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
const MODEL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
const MIN_VIS = 0.4;
const IDX = { L: { sh: 11, el: 13, wr: 15, hip: 23, kn: 25, an: 27 }, R: { sh: 12, el: 14, wr: 16, hip: 24, kn: 26, an: 28 } };

const ang = (a, b, c) => {
  const v1 = [a.x - b.x, a.y - b.y], v2 = [c.x - b.x, c.y - b.y];
  const cos = (v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2) || 1);
  return Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
};
/** angle of the line a→b from horizontal: 0 = lying flat, 90 = upright */
const tilt = (a, b) => { const t = Math.abs(Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI); return Math.min(t, 180 - t); };
const torso = s => Math.hypot(s.sh.x - s.hip.x, s.sh.y - s.hip.y) || 1;
const knee = s => ang(s.hip, s.kn, s.an);
const hipAng = s => ang(s.sh, s.hip, s.kn);
const upright = (s, min = 50) => s.hip.y > s.sh.y && tilt(s.sh, s.hip) >= min;
const mid = (a, b) => (a + b) / 2;

const SIDE = "Stand the phone 2–3 m away and turn side-on to it.";
const FRONT = "Stand the phone 2–3 m away and face it, whole body in frame.";
const FLOOR = "Prop the phone on the floor 2 m to your side.";

// rep modes: start at rest (value > hi), go active (value < lo), return to rest = one rep
export const MODES = {
  pushup: { name: "Push-ups", kind: "rep", setup: FLOOR, need: ["sh", "el", "wr", "hip"], lo: 110, hi: 140, min: 60, max: 175,
    ready: s => tilt(s.sh, s.hip) <= 55, metric: s => ang(s.sh, s.el, s.wr), cues: ["Go down", "Push up"] },
  squat: { name: "Squats", kind: "rep", setup: SIDE, need: ["sh", "hip", "kn", "an"], lo: 105, hi: 155, min: 60, max: 180,
    ready: s => s.an.y > s.hip.y && tilt(s.sh, s.hip) >= 35, metric: knee, cues: ["Squat down", "Stand up"] },
  lunge: { name: "Lunges", kind: "rep", setup: SIDE, need: ["sh", "hip", "kn", "an"], lo: 110, hi: 150, min: 60, max: 180,
    ready: s => upright(s), metric: (s, P) => Math.min(...[P.L, P.R].filter(x => vis(x, ["hip", "kn", "an"]) >= MIN_VIS).map(knee), knee(s)), cues: ["Step and lower", "Back up"] },
  jacks: { name: "Jumping jacks", kind: "rep", setup: FRONT, both: true, need: ["sh", "wr", "hip"], lo: -20, hi: 50, min: -100, max: 110,
    ready: s => upright(s), metric: (s, P) => (mid(P.L.wr.y, P.R.wr.y) - mid(P.L.sh.y, P.R.sh.y)) / torso(s) * 100, cues: ["Arms up", "Arms down"] },
  highknees: { name: "High knees", kind: "rep", setup: FRONT, both: true, need: ["sh", "hip", "kn"], lo: 25, hi: 55, min: -10, max: 110,
    ready: s => upright(s), metric: (s, P) => Math.min(P.L.kn.y - P.L.hip.y, P.R.kn.y - P.R.hip.y) / torso(s) * 100, cues: ["Knee up", "Switch"] },
  situp: { name: "Sit-ups", kind: "rep", setup: FLOOR, need: ["sh", "hip", "kn"], lo: 80, hi: 105, min: 40, max: 150,
    ready: s => (s.kn.y - s.hip.y) / torso(s) < 0.45, metric: hipAng, cues: ["Sit up", "Lower back"] },
  bridge: { name: "Glute bridges", kind: "rep", setup: FLOOR, need: ["sh", "hip", "kn"], lo: 18, hi: 32, min: 0, max: 70,
    ready: s => tilt(s.sh, s.hip) <= 40, metric: s => 180 - hipAng(s), cues: ["Hips up", "Lower"] },
  burpee: { name: "Burpees", kind: "rep", setup: SIDE, need: ["sh", "hip"], lo: 30, hi: 65, min: 0, max: 90,
    ready: () => true, metric: s => tilt(s.sh, s.hip), cues: ["Down to the floor", "Jump up"] },
  goodmorning: { name: "Good mornings", kind: "rep", setup: SIDE, need: ["sh", "hip", "kn", "an"], lo: 45, hi: 70, min: 20, max: 90,
    ready: s => s.an.y > s.hip.y && knee(s) > 135, metric: s => tilt(s.sh, s.hip), cues: ["Hinge forward", "Stand tall"] },

  // hold modes: the clock only runs while hold() is true
  plank: { name: "Plank", kind: "hold", setup: FLOOR, need: ["sh", "el", "hip", "an"], cue: "Straight line, head to heels",
    hold: s => tilt(s.sh, s.hip) <= 35 && ang(s.sh, s.hip, s.an) >= 150 && (s.el.y - s.sh.y) / torso(s) >= 0.3 },
  wallsit: { name: "Wall sit", kind: "hold", setup: SIDE, need: ["sh", "hip", "kn", "an"], cue: "Thighs parallel, back straight",
    hold: s => knee(s) >= 60 && knee(s) <= 125 && upright(s, 55) },
  bridgehold: { name: "Bridge hold", kind: "hold", setup: FLOOR, need: ["sh", "hip", "kn", "an"], cue: "Hips high, squeeze",
    hold: s => tilt(s.sh, s.hip) <= 40 && 180 - hipAng(s) <= 20 && knee(s) <= 125 },
  lungehold: { name: "Lunge hold", kind: "hold", setup: SIDE, both: true, need: ["sh", "hip", "kn", "an"], cue: "Front knee at 90°, chest up",
    hold: (s, P) => Math.min(knee(P.L), knee(P.R)) <= 115 && upright(s, 55) && Math.abs(P.L.an.x - P.R.an.x) / torso(s) > 0.5 },
  balance: { name: "One-leg balance", kind: "hold", setup: FRONT, both: true, need: ["sh", "hip", "an"], cue: "One foot off the floor, stay tall",
    hold: (s, P) => Math.abs(P.L.an.y - P.R.an.y) / torso(s) >= 0.2 && upright(s, 60) },
  present: { name: "Stretch", kind: "hold", setup: "Stand the phone where it can see you.", need: ["sh", "hip"], cue: "Stay in frame", hold: () => true },
};

const vis = (o, keys) => Math.min(...keys.map(k => o[k].v));
function points(lm, W, H) {
  const pt = i => ({ x: lm[i].x * W, y: lm[i].y * H, v: lm[i].visibility ?? 1 });
  const mk = s => Object.fromEntries(Object.entries(IDX[s]).map(([k, i]) => [k, pt(i)]));
  return { L: mk("L"), R: mk("R") };
}

/** One tracker per station. feed() takes a frame of landmarks and reports what happened. */
export function makeTracker(name) {
  const m = MODES[name];
  let phase = "up", smooth = null, miss = 0, held = false;
  return {
    mode: m,
    reset() { phase = "up"; smooth = null; miss = 0; held = false; },
    feed(lm, W = 1, H = 1) {
      const P = points(lm, W, H), s = vis(P.L, m.need) >= vis(P.R, m.need) ? P.L : P.R;
      const seen = m.both ? Math.min(vis(P.L, m.need), vis(P.R, m.need)) : vis(s, m.need);
      const out = { side: s, P };
      if (seen < MIN_VIS) return { ...out, state: "lost", hint: m.setup };
      if (m.kind === "hold") {
        // tolerate a few bad frames so a flicker doesn't stop the clock
        if (m.hold(s, P)) { held = true; miss = 0; } else if (++miss > 6) held = false;
        return { ...out, state: held ? "hold" : "ready", holding: held };
      }
      if (!m.ready(s, P)) return { ...out, state: "idle" };
      const raw = m.metric(s, P);
      smooth = smooth == null ? raw : smooth * 0.6 + raw * 0.4;
      let rep = false, wentDown = false;
      if (phase === "up" && smooth < m.lo) { phase = "down"; wentDown = true; }
      else if (phase === "down" && smooth > m.hi) { phase = "up"; rep = true; }
      return { ...out, state: phase, rep, wentDown, value: smooth, pct: Math.max(0, Math.min(100, (smooth - m.min) / (m.max - m.min) * 100)) };
    },
  };
}
export const meterPct = (m, v) => Math.max(0, Math.min(100, (v - m.min) / (m.max - m.min) * 100));

let landmarker = null;

export class PoseCamera {
  constructor({ video, canvas, onFrame }) {
    Object.assign(this, { video, canvas, onFrame });
    this.ctx = canvas.getContext("2d"); this.running = false; this.paused = false; this.lastT = -1; this.tracker = null;
    this.loop = this.loop.bind(this);
  }
  setMode(name) { this.tracker = name ? makeTracker(name) : null; }
  async start(onProgress = () => {}) {
    onProgress("Starting camera…");
    this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
    this.video.srcObject = this.stream; await this.video.play();
    if (!landmarker) {
      onProgress("Loading pose model…");
      const { FilesetResolver, PoseLandmarker } = await import(`${MP}/vision_bundle.mjs`);
      const fileset = await FilesetResolver.forVisionTasks(`${MP}/wasm`);
      const opts = d => ({ baseOptions: { modelAssetPath: MODEL, delegate: d }, runningMode: "VIDEO", numPoses: 1 });
      try { landmarker = await PoseLandmarker.createFromOptions(fileset, opts("GPU")); }
      catch { landmarker = await PoseLandmarker.createFromOptions(fileset, opts("CPU")); }
    }
    this.running = true; this.paused = false;
    requestAnimationFrame(this.loop);
  }
  pause() { this.paused = true; }
  resume() { this.paused = false; this.tracker?.reset(); this.lastT = -1; requestAnimationFrame(this.loop); }
  stop() {
    this.running = false;
    this.stream?.getTracks().forEach(t => t.stop()); this.stream = null; this.video.srcObject = null;
  }
  loop() {
    if (!this.running || this.paused) return;
    const t = performance.now(), v = this.video;
    if (v.readyState >= 2 && t !== this.lastT) {
      const dt = this.lastT < 0 ? 0 : Math.min(250, t - this.lastT); this.lastT = t;
      const W = this.canvas.width = v.videoWidth, H = this.canvas.height = v.videoHeight;
      const lm = landmarker.detectForVideo(v, t).landmarks?.[0];
      this.ctx.clearRect(0, 0, W, H);
      if (!this.tracker) this.onFrame({ state: "rest" }, dt);
      else if (!lm) this.onFrame({ state: "lost", hint: "Can't see you. Step back so your whole body is in frame." }, dt);
      else {
        const r = this.tracker.feed(lm, W, H);
        const s = r.side; this.draw([s.wr, s.el, s.sh, s.hip, s.kn, s.an], r.state === "down" || r.state === "hold" ? "#ffb020" : "#8b7bff");
        this.onFrame(r, dt);
      }
    }
    requestAnimationFrame(this.loop);
  }
  draw(pts, color) {
    const c = this.ctx; pts = pts.filter(p => p.v >= MIN_VIS); if (!pts.length) return;
    c.lineCap = c.lineJoin = "round"; c.shadowColor = color; c.shadowBlur = 18; c.strokeStyle = color; c.lineWidth = 8;
    c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.stroke();
    c.shadowBlur = 0;
    for (const p of pts) {
      c.fillStyle = "#fff"; c.beginPath(); c.arc(p.x, p.y, 8, 0, Math.PI * 2); c.fill();
      c.fillStyle = color; c.beginPath(); c.arc(p.x, p.y, 4, 0, Math.PI * 2); c.fill();
    }
  }
}
