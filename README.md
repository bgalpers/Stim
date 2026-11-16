# Stim

Earn your scroll time. A short challenge for your body or your mind unlocks 30 minutes of social media; when it runs out, you take five and do another.

**Live:** https://bgalpers.github.io/Stim/

Stim is the follow-up to [pushup-gate](https://github.com/bgalpers/pushup-gate). Same mechanism (a web page plus two iOS Shortcuts), but it runs all day instead of once in the morning, and the challenge is your choice.

## How it works

1. You open a blocked app. An iOS automation checks whether you have time left. If not, it sends you to Stim.
2. You pick a challenge, or shuffle for a new set. Each takes roughly three to six minutes.
3. When you finish, a slider lets you take the reward as app time (up to 30 minutes), as XP for your character, or a mix. Whatever time you take is handed to a Shortcut, which lifts the block.
4. When the time is up, the next app-open sends you back here.

Time can be banked (60 minutes by default), so you can do two challenges in a row before a long stretch.

## Challenges

| Type | What you do | How it's checked |
| --- | --- | --- |
| **Move** (20) | Push-ups, squats, lunges, jumping jacks, high knees, sit-ups, glute bridges, burpees, good mornings, squat jumps; plank, wall-sit, bridge, lunge and one-leg-balance holds; four mixed circuits; a mobility flow | **All by camera.** On-device pose tracking counts each rep and only runs the clock on a hold while you are actually in position. Circuits move from station to station on their own. |
| **Learn** (60 lessons) | One lesson from a course: three or four short cards, three questions, up to two questions from earlier lessons, then a one-sentence recap in your own words | One thing per screen. Each card needs a few seconds before you can continue; missed questions come back until you get them right. |
| **News** (2) | Today's briefing (current stories) or On this day (five events from today's date) | Fill-in-the-blank and match-the-year questions built from what you just read. Once per day each. |
| **Mind** (6) | Mental math sprint, sequence memory, box breathing, and three writing prompts (journal, gratitude, planning) | Right answers, completed rounds, a guided timer, or a word count. |

**Courses** (star the ones you want in your shuffle): Finance foundations · Your money · How economies work · Thinking in numbers · Habits, attention and choice · Communication and negotiation · The 20th century in six turns · The ancient world · How the US government works · Big questions (philosophy) · Space and physics · How your body works · Computing and AI. A finished lesson can be reviewed for credit again after a week.

If the camera can't be used (permission denied, no camera, tracking not working) every exercise falls back to a tap counter or a plain timer, and the result is logged as "no camera" with no bonus XP.

News comes from Wikipedia's public featured-content feed, fetched by your browser when you open that challenge.

## Difficulty

Every exercise has its own picker on its start screen: **Easy** (10 push-ups), **Medium** (25), **Hard** (40) or **Custom**, where you set the number yourself. The same multipliers (0.4×, 1×, 1.6×) apply to every other exercise, and your choice is remembered per exercise. Settings holds the default for exercises you haven't set.

In **All challenges**, a star on each one decides whether it can come up in your shuffle. You can always open any challenge directly.

## Time or XP

After every challenge a slider splits the reward. All the way right is the full 30 minutes and no XP; all the way left is no time and full XP; halfway is 15 minutes and half the XP. Full XP is 20, plus up to 5 bonus (camera-verified, first-try answers, no slips), scaled by exercise difficulty (Easy 0.4×, Hard 1.6×). When your time bank is full, challenges pay out entirely in XP, so you can keep going without unlocking anything.

## Your character

XP raises your level (100 XP each) and is also what you spend. In **Me → Customise**:

- **Build the base for free** by swiping the character left and right (or using the arrows) through 8 body shapes, 16 colours, 8 eye styles, 6 mouths, 6 belly marks and 8 kinds of ears: close to 300,000 combinations. A dice button rolls a random one.
- **Shop** for 47 items across eight slots: headwear, eyewear, neckwear, gear, back, feet, auras and backdrops, from 30 to 600 XP. Tap an item to try it on before you buy.

Spending never lowers your level. To add options or items, edit the tables in `js/buddy.js`.

## Friends

Create a handle in the **Friends** tab, then follow people by handle or send your invite link. The board ranks you and your friends by challenges in the last seven days and shows each person's character, level, streak, today's and this week's counts, and the name of their last challenge.

## Progress

There is a daily goal (three challenges by default), a streak, a seven-day chart, minutes of effort against minutes of apps, lifetime rep counts, course paths and your journal.

Skipping is possible. It asks three times, gives you the time, earns no XP, and marks the day as a skip.

## Settings

- minutes earned per challenge (default 30), the most you can bank (60), an optional daily limit, and the daily goal
- default exercise difficulty (Easy, Medium, Hard), and effort for mind challenges (problem counts, word counts)
- which kinds of challenge are offered, and individual challenges on or off
- camera tracking, minimum reading time
- the name of the Shortcut to run, and what hour the day rolls over

## iPhone app (Screen Time)

The `ios/` folder is a real iPhone app: the same web app inside a native shell, plus a small Swift plugin that uses Apple's Screen Time frameworks to block the apps you choose and lift the block for exactly the minutes you claim. No Shortcuts needed. When time runs out, a background extension puts the block back even if Stim isn't open.

### What you need

- A Mac with **Xcode** (free, Mac App Store) and **Node.js** (nodejs.org).
- An **Apple Developer Program** membership ($99/year). Screen Time apps need it even for testing on your own phone.
- Your **iPhone, iOS 16 or later**, and a cable. Screen Time doesn't work in the simulator.

### First run

```sh
git clone https://github.com/bgalpers/Stim.git && cd Stim
npm install
npm run ios          # builds the web app, syncs it into ios/, opens Xcode
```

In Xcode:

1. Click the blue **App** project at the top of the left sidebar.
2. Select the **App** target → **Signing & Capabilities** → set **Team** to your developer account. Do the same for the **StimMonitor** target.
3. If Xcode says a bundle ID is unavailable, change `com.bgalpers.stim` (and `com.bgalpers.stim.monitor`) to something of your own, and change `group.com.bgalpers.stim` the same way in `App/App.entitlements`, `StimMonitor/StimMonitor.entitlements` and `Shared/StimShared.swift`. All three must match.
4. If either target shows a red error about **Family Controls** or **App Groups**, click **+ Capability** on that target, add **Family Controls**, then add **App Groups** and tick the group above.
5. Plug in your iPhone. On the phone: **Settings → Privacy & Security → Developer Mode → on** (it restarts). Pick your iPhone in the device menu at the top of Xcode and press **Run** (▶).
6. The first launch may say the developer isn't trusted: **Settings → General → VPN & Device Management → trust your account**.

In Stim, the Today screen asks you to **Allow Screen Time** and **choose apps to block**. Settings → Blocking has the same controls and a **Test the re-lock** button that unlocks for two minutes, so you can check that blocking comes back on its own.

### Keep developing

The app and the website are one codebase. Edit the files at the repo root as before; then either:

- **Rebuild:** `npm run sync`, then Run in Xcode (about a minute). Use this for anything in `ios/`.
- **Live from GitHub:** `npm run ios:live`, Run once in Xcode, and from then on the app loads `bgalpers.github.io/Stim`, so every push to `gh-pages` updates it without Xcode.
- **Live from your Mac:** `npm run serve`, then `STIM_LIVE=http://<your-mac-ip>:8080 npm run sync` and Run. Edits show up on a reload. Phone and Mac must be on the same Wi-Fi.

Switch back to the bundled app with `npm run sync` before giving the app to anyone else.

### Giving it to friends

Testing on your own phone works with the development entitlement right away. Installing on other people's phones goes through TestFlight, which needs Apple to approve the **Family Controls (Distribution)** entitlement for both `com.bgalpers.stim` and `com.bgalpers.stim.monitor`. Request it at developer.apple.com/contact/request/family-controls-distribution; approval can take days to weeks.

### Known gaps

- When you open a blocked app you see Apple's standard Screen Time screen, with no button into Stim. A custom shield screen (and a notification that opens Stim) is the next piece.
- iOS won't schedule a Device Activity interval shorter than 15 minutes, so short unlocks use one that started in the past. If the re-lock test fails, this is the first place to look (`StimShared.schedule`).
- The Swift code has not been compiled yet. Expect a round of fixes on the first build; paste Xcode's errors back to Claude.

| File | What's in it |
| --- | --- |
| `ios/App/App/ScreenTimePlugin.swift` | Permission, app picker, unlock-until |
| `ios/App/Shared/StimShared.swift` | Shield on/off and the re-lock schedule (used by app and extension) |
| `ios/App/StimMonitor/StimMonitor.swift` | Background extension that re-locks when time is up |
| `ios/App/App/StimViewController.swift` | Registers the plugin with Capacitor |
| `js/native.js` | The web app's side of the bridge |
| `capacitor.config.ts` | App ID, and the live-reload switch |
| `scripts/add-ios-targets.cjs` | Adds the extension to the Xcode project after `npx cap add ios` (already done) |

## Set up the lock with Shortcuts (website only)


Stim tracks the time. Shortcuts does the blocking. You need one shortcut and one automation. Action names shift a little between iOS versions; search for the nearest match.

**Use Safari, not a home-screen icon.** iOS gives a home-screen web app separate storage from Safari, and the automation below opens Stim in Safari. If you use both you will have two sets of progress.

### 1. The shortcut: `Stim Unlock`

Stim runs this with the number of minutes you have, as text. Create a shortcut with exactly this name (or change the name in Stim's settings) and these actions:

1. **Get Numbers from Input**: Shortcut Input
2. **Adjust Date**: add *Numbers* minutes to *Current Date*
3. **Format Date**: *Adjusted Date*, format ISO 8601, include time
4. **Save File**: *Formatted Date* to `Shortcuts/stim-until.txt`, Ask Where to Save off, Overwrite If File Exists on
5. Optional, **Start Timer**: for *Numbers* minutes. This is your signal that time is up while you are still inside an app.

"Lock now" in Stim runs the same shortcut with `0`, which sets the expiry to the present.

### 2. The automation: gate your apps

Shortcuts › Automation › New › **App**. Choose the apps to gate (Instagram, TikTok, X, YouTube…), **Is Opened**, **Run Immediately**. Actions:

1. **Get File** from `Shortcuts/stim-until.txt` (turn off "Error If Not Found")
2. **Get Dates from Input**: *File*
3. **If** *Dates* **is before** *Current Date*, or *Dates* does not have any value:
   **Open URLs** `https://bgalpers.github.io/Stim/`
4. **End If**

Test it from Stim: Settings › iPhone hand-off › Test it. That should write the file with a time one minute ahead.

### What this can and can't do

The check happens when a gated app is opened. iOS won't let a shortcut close an app you are already using, so if you are mid-scroll when the 30 minutes end, nothing forces you out; the optional timer in step 5 is the nudge, and the next time you open the app you are sent back. If you want a hard stop, pair this with a Screen Time limit.

## Add or edit courses

Courses are plain JavaScript in `content/`. The compact form, from `content/courses-c.js`:

```js
L("mon-1", "A budget that fits on a napkin",
  ["Card one…", "Card two…", "Card three…"],
  "One-sentence takeaway.",
  [Q("Question?", "Right answer", ["Wrong", "Wrong", "Wrong"], "Shown after answering.")])
```

Write the right answer first; options are shuffled when shown. Add the course to the list in `content/courses.js`. `npm test` checks every lesson.

Exercises live in `js/catalog.js` as lists of camera stations, and the rule for each pose (which joints, which angles) is in `js/pose.js`.

## Privacy

There is no account. Progress, settings, lesson notes and journal entries are kept in your browser's local storage on your phone. Camera frames are processed on the device and never uploaded. Settings › Your data lets you export, import or erase everything.

The one thing that leaves the phone is your friends card, and only if you create a handle: display name, handle, character, level, XP, streak, challenge counts for today and the week, and the title of your last challenge. It is stored in a small Supabase database (`js/social.js`). The tables can't be read or written directly; the app calls a handful of database functions that check a random secret kept on your device. "Delete my friends profile" removes the card and your follows.

## Develop

No build step.

```sh
npm run serve   # http://localhost:8080
npm test        # logic, content and question-builder tests
```

| File | What's in it |
| --- | --- |
| `js/store.js` | State and the rules: earning, banking, daily limit, streaks, XP |
| `js/catalog.js` | Exercises, mind games, prompts and how effort scales them |
| `js/app.js` | Screens and routing |
| `js/pose.js` | Camera tracking: one rule per exercise (MediaPipe pose) |
| `js/buddy.js` | The character: drawing, items and prices |
| `js/social.js` | Friends client (Supabase functions) |
| `js/news.js` | Turns the Wikipedia feed into a read-and-quiz lesson |
| `content/` | Courses |

## What still needs a real phone

The camera rules are tested against stick figures, not people. Push-ups use the thresholds from pushup-gate; every other exercise is a first estimate and will need tuning (the numbers are the `lo` / `hi` values in `js/pose.js`). The live Wikipedia feed is tested against a sample of its format.
