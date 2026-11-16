// Camera rep counter (MediaPipe pose). Counts a rep when a joint angle passes a "down"
// threshold and then an "up" threshold. Runs entirely on the phone; no video leaves it.

const MP = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
const MODEL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
const MIN_VIS = 0.4;

// Landmark indices: 11/12 shoulders, 13/14 elbows, 15/16 wrists, 23/24 hips, 25/26 knees, 27/28 ankles
export const MODES = {
  pushup: {
    left: [11, 13, 15, 23], right: [12, 14, 16, 24],     // shoulder, elbow, wrist, hip
    angle: [0, 1, 2], draw: [3, 0, 1, 2],
    down: 110, up: 140, min: 60, max: 175,
    // body must be roughly horizontal, or standing around would count
    ready: ([sh, , , hip]) => { const t = Math.abs(Math.atan2(sh.y - hip.y, sh.x - hip.x) * 180 / Math.PI); return Math.min(t, 180 - t) <= 55; },
    cues: { down: "Push up", up: "Go down", lost: "Turn sideways so the camera sees your arm and hip." },
  },
  squat: {
    left: [23, 25, 27, 11], right: [24, 26, 28, 12],     // hip, knee, ankle, shoulder
    angle: [0, 1, 2], draw: [3, 0, 1, 2],
    down: 105, up: 155, min: 60, max: 180,
    // feet below hips: you're upright, not lying down
    ready: ([hip, , ankle]) => ankle.y > hip.y,
    cues: { down: "Stand up", up: "Squat down", lost: "Step back so the camera sees you from shoulder to ankle." },
  },
};

function angle(a, b, c) {
  const v1 = [a.x - b.x, a.y - b.y], v2 = [c.x - b.x, c.y - b.y];
  const cos = (v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2) || 1);
  return Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
}

/** The counting rule on its own, so it can be tested without a camera. */
export function makeCounter(mode) {
  let phase = "up", smooth = null;
  return {
    get phase() { return phase; },
    reset() { phase = "up"; smooth = null; },
    /** feed one raw angle; returns { angle, rep, wentDown } */
    feed(a) {
      smooth = smooth == null ? a : smooth * 0.6 + a * 0.4;
      let rep = false, wentDown = false;
      if (phase === "up" && smooth < mode.down) { phase = "down"; wentDown = true; }
      else if (phase === "down" && smooth > mode.up) { phase = "up"; rep = true; }
      return { angle: smooth, rep, wentDown };
    },
  };
}

let landmarker = null;

export class RepCamera {
  constructor({ video, canvas, mode, onRep, onState }) {
    Object.assign(this, { video, canvas, onRep, onState });
    this.mode = MODES[mode]; this.counter = makeCounter(this.mode);
    this.ctx = canvas.getContext("2d"); this.running = false; this.paused = false; this.lastT = -1;
    this.loop = this.loop.bind(this);
  }
  pct(a) { const { min, max } = this.mode; return Math.max(0, Math.min(100, (a - min) / (max - min) * 100)); }

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
    this.running = true; this.paused = false; this.counter.reset();
    requestAnimationFrame(this.loop);
  }
  pause() { this.paused = true; }
  resume() { this.paused = false; this.counter.reset(); requestAnimationFrame(this.loop); }
  stop() {
    this.running = false;
    this.stream?.getTracks().forEach(t => t.stop()); this.stream = null; this.video.srcObject = null;
  }

  loop() {
    if (!this.running || this.paused) return;
    const t = performance.now(), v = this.video;
    if (v.readyState >= 2 && t !== this.lastT) {
      this.lastT = t;
      const W = this.canvas.width = v.videoWidth, H = this.canvas.height = v.videoHeight;
      const res = landmarker.detectForVideo(v, t);
      this.ctx.clearRect(0, 0, W, H);
      const lm = res.landmarks?.[0];
      if (!lm) this.onState({ cue: "idle", text: "Get in position", hint: "Can't see you. Back up so your whole body is in frame." });
      else this.process(lm, W, H);
    }
    requestAnimationFrame(this.loop);
  }

  process(lm, W, H) {
    const m = this.mode, P = i => ({ x: lm[i].x * W, y: lm[i].y * H, v: lm[i].visibility ?? 1 });
    const L = m.left.map(P), R = m.right.map(P);
    const pts = L.reduce((s, p) => s + p.v, 0) >= R.reduce((s, p) => s + p.v, 0) ? L : R;
    this.draw(m.draw.map(i => pts[i]), this.counter.phase === "down" ? "#ff8a5c" : "#5fd39a");
    if (Math.min(...pts.map(p => p.v)) < MIN_VIS) return this.onState({ cue: "idle", text: "Adjust your position", hint: m.cues.lost });
    if (!m.ready(pts)) return this.onState({ cue: "idle", text: "Get in position", hint: "" });
    const r = this.counter.feed(angle(...m.angle.map(i => pts[i])));
    if (r.rep) this.onRep();
    const ph = this.counter.phase;
    this.onState({ cue: ph, text: m.cues[ph], hint: "", angle: Math.round(r.angle), pct: this.pct(r.angle), wentDown: r.wentDown });
  }

  draw(pts, color) {
    const c = this.ctx;
    c.lineCap = c.lineJoin = "round"; c.shadowColor = color; c.shadowBlur = 18; c.strokeStyle = color; c.lineWidth = 8;
    c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.stroke();
    c.shadowBlur = 0;
    for (const p of pts) {
      c.fillStyle = "#fff"; c.beginPath(); c.arc(p.x, p.y, 8, 0, Math.PI * 2); c.fill();
      c.fillStyle = color; c.beginPath(); c.arc(p.x, p.y, 4, 0, Math.PI * 2); c.fill();
    }
  }
}
