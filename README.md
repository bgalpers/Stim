# Stim

Earn your scroll time. A short challenge for your body or your mind unlocks 30 minutes of social media; when it runs out, you take five and do another.

**Live:** https://bgalpers.github.io/Stim/

Stim is the follow-up to [pushup-gate](https://github.com/bgalpers/pushup-gate). Same mechanism (a web page plus two iOS Shortcuts), but it runs all day instead of once in the morning, and the challenge is your choice.

## How it works

1. You open a blocked app. An iOS automation checks whether you have time left. If not, it sends you to Stim.
2. You pick a challenge, or shuffle for a new set. Each takes roughly three to six minutes.
3. When you finish, Stim adds 30 minutes and hands that number to a Shortcut, which lifts the block.
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

## Progress

Each finished challenge is worth 10 XP plus up to 5 bonus (camera-verified, first-try answers, no slips). 100 XP is a level. There is a daily goal (three challenges by default), a streak, a seven-day chart, minutes of effort against minutes of apps, lifetime rep counts, course paths and your journal.

Skipping is possible. It asks three times, gives you the time, earns no XP, and marks the day as a skip.

## Settings

- minutes earned per challenge (default 30), the most you can bank (60), an optional daily limit, and the daily goal
- effort: Light, Standard, Hard or Max, which scales reps, holds and problem counts
- which kinds of challenge are offered, and individual challenges on or off
- camera tracking, minimum reading time
- the name of the Shortcut to run, and what hour the day rolls over

## Set up the lock on iPhone

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

There is no account and no server. Progress, settings and journal entries are kept in your browser's local storage on your phone. Camera frames are processed on the device and never uploaded. Settings › Your data lets you export, import or erase everything.

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
| `js/news.js` | Turns the Wikipedia feed into a read-and-quiz lesson |
| `content/` | Courses |

## What still needs a real phone

The camera rules are tested against stick figures, not people. Push-ups use the thresholds from pushup-gate; every other exercise is a first estimate and will need tuning (the numbers are the `lo` / `hi` values in `js/pose.js`). The live Wikipedia feed is tested against a sample of its format.

## Toward a real app

This is a web app, which is why blocking goes through Shortcuts. A native iOS app could use Apple's Screen Time API (FamilyControls / ManagedSettings) to shield apps directly and lift the shield for exactly 30 minutes, which would also fix the "nothing kicks you out mid-scroll" gap. The logic in `js/store.js`, the content and the pose rules would carry over.
