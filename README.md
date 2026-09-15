# Zoom! Black Jet — Power Rankings Site

A static site for the Gores Whores fantasy league: live power rankings,
weekly recap & awards, Monte Carlo playoff odds, and next-week spreads.
No build step — it's plain HTML/CSS/JS, so GitHub Pages can serve it directly.

## One-time setup (nbh14975/ZoomBlackJet)

1. Copy all files from this folder (`index.html`, `style.css`, `data.js`,
   `engine.js`, `main.js`) into the root of your repo.
2. Commit and push:
   ```
   git add .
   git commit -m "Initial site"
   git push
   ```
3. On GitHub: go to **Settings → Pages**. Under "Build and deployment",
   set **Source** to "Deploy from a branch", branch `main`, folder `/ (root)`.
   Save.
4. GitHub will give you a URL like `https://nbh14975.github.io/ZoomBlackJet/`
   — it can take a minute or two to go live the first time.

## Updating scores each week

Everything on the site is calculated from one file: **`data.js`**.
Open it and add a new entry to `WEEKLY_SCORES` with that week's points for
every team, e.g.:

```js
const WEEKLY_SCORES = {
  1: { Reese: 148.20, Seth: 147.36, ... },
  2: { Reese: 130.10, Seth: 155.20, ... }   // <-- add this
};
```

Commit and push that one change — rankings, luck scores, playoff odds, next
week's spread, and the recap/awards cards all regenerate automatically from
that data, no other edits needed.

If you want to drop in a player-level highlight for the week (e.g. who the
actual top scorer's best player was), add it to `PLAYER_HIGHLIGHTS`:

```js
const PLAYER_HIGHLIGHTS = {
  2: { topScorer: "Seth — Ja'Marr Chase, 41.2 pts" }
};
```

Since you're pasting scores to Claude each week: just send the week number
and each team's final score, and Claude will hand back the updated `data.js`
(or the full diff) to drop in.

## How the numbers are calculated

- **Power Score / Luck Score** — reproduce your Google Sheet's exact
  formulas (verified against Week 1's numbers).
- **Playoff odds** — an 8,000-iteration season simulation. Each team's
  projected weekly score is drawn from a normal distribution centered on
  their scoring average (blended toward the league average early in the
  season, so Week 1 outliers don't produce absurd odds) with their own
  week-to-week variance. Simulated results feed a top-6 bracket with byes
  for seeds 1 and 2, run 8,000 times, and the frequency of each outcome
  becomes the probability, converted to American odds.
- **Spreads** — the projected scoring gap between next week's opponents,
  rounded to the nearest half point.

## Notes

- Weeks 15–17 are treated as playoffs (top 6, seeds 1 & 2 bye) — change
  `PLAYOFF_TEAMS`, `BYE_SEEDS`, or `REGULAR_SEASON_WEEKS` in `data.js` if
  your format changes.
- Player-level awards need manual input (ESPN's fantasy site blocks
  automated scraping and your league is private), so those are optional
  bonus lines rather than automatic.
