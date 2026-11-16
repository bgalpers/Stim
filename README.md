# Stim

Earn your scroll time. A short challenge for your body or your mind unlocks 30 minutes of social media; when it runs out, you take five and do another.

**Live:** https://bgalpers.github.io/Stim/

Stim is the follow-up to [pushup-gate](https://github.com/bgalpers/pushup-gate). Same mechanism (a web page plus two iOS Shortcuts), but it runs all day instead of once in the morning, and the challenge is your choice.

## How it works

1. You open a blocked app. An iOS automation checks whether you have time left. If not, it sends you to Stim.
2. You pick a challenge. Each takes roughly four to seven minutes.
3. When you finish, Stim adds 30 minutes and hands that number to a Shortcut, which lifts the block.
4. When the time is up, the next app-open sends you back here.

Time can be banked (60 minutes by default), so you can do two challenges in a row before a long stretch.

## Challenges

| Type | What you do | How it's checked |
| --- | --- | --- |
| **Move** | Push-ups, squats, lunges, jumping jacks, burpees, plank sets, wall sits, a bodyweight circuit, a mobility flow | Push-ups and squats are counted by the camera (on-device pose tracking, the same approach as pushup-gate). The rest use a tap counter or a guided timer that can't be skipped ahead. |
| **Learn** | One lesson from a course: a short read, three questions, up to two questions from earlier lessons, then a one-sentence recap in your own words | The quiz unlocks after a minimum reading time. Missed questions come back until you get them right. |
| **News** | Today's briefing (current stories) or On this day (five events from today's date) | Fill-in-the-blank and match-the-year questions built from what you just read. Once per day each. |
| **Reset** | Five minutes of box breathing, or a 60-word journal entry from a prompt | Guided timer; word count. |

Courses included, six lessons each: **Finance foundations**, **The 20th century in six turns**, **How economies work**, **Habits, attention and choice**. A finished lesson can be reviewed for credit again after a week.

News comes from Wikipedia's public featured-content feed, fetched by your browser when you open that challenge. It is the only network request Stim makes besides loading the pose model for the camera.

## Settings

Everything in the deal is adjustable in the Settings tab:

- minutes earned per challenge (default 30), the most you can bank (60), and an optional daily limit
- effort: Light, Standard, Hard or Max, which scales reps and timed work (25 push-ups at Standard, 50 at Max)
- which kinds of challenge are offered, and individual challenges on or off
- camera counting, minimum reading time
- the name of the Shortcut to run, and what hour the day rolls over

The Progress tab shows your streak (a leaf per day, a flower at a week), minutes of effort against minutes of apps for the last seven days, a breakdown by type, course progress, rep totals and your journal.

Skipping is possible. It asks three times, gives you the time, and marks the day as a skip instead of a win.

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

Courses are plain JavaScript objects in `content/`. Copy the shape in `content/courses-a.js`:

```js
{
  id: "fin-1", title: "The time value of money",
  body: ["Paragraph…", "Paragraph…"],
  takeaway: "One sentence.",
  quiz: [{ q: "Question?", o: ["A", "B", "C", "D"], a: 1, why: "Shown after answering." }],
}
```

Add the course to the list in `content/courses.js`. `npm test` checks that every lesson has three four-option questions with a valid answer and that the correct option isn't always in the same slot.

Fixed challenges live in `js/catalog.js`.

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
| `js/store.js` | State and the rules: earning, banking, daily limit, streaks |
| `js/catalog.js` | The fixed challenges and how effort scales them |
| `js/app.js` | Screens and routing |
| `js/pose.js` | Camera rep counter (MediaPipe pose) |
| `js/news.js` | Turns the Wikipedia feed into a read-and-quiz lesson |
| `content/` | Courses |

Not yet tested on a real phone: squat counting thresholds, and the live Wikipedia feed (the builder is tested against a sample of the feed's format).
