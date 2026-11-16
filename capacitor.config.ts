import type { CapacitorConfig } from "@capacitor/cli";

// STIM_LIVE=1 loads the app from GitHub Pages, so a push updates the app without rebuilding in Xcode.
// STIM_LIVE=http://<your-mac-ip>:8080 loads it from `npm run serve` on your Mac for instant edits.
const live = process.env.STIM_LIVE;

const config: CapacitorConfig = {
  appId: "com.bgalpers.stim",
  appName: "Stim",
  webDir: "www",
  ios: { contentInset: "never", backgroundColor: "#f6f5fb" },
  ...(live ? { server: { url: live === "1" ? "https://bgalpers.github.io/Stim/" : live, cleartext: true } } : {}),
};

export default config;
