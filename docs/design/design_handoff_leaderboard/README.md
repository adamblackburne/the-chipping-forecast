# Handoff: Leaderboard (Sortable Table variant)

**App:** The Chipping Forecast — a low-friction, no-account golf-majors picks group
**Feature:** Live group leaderboard with expandable pick details + full-field tournament view
**Fidelity:** **Low-fidelity wireframes.** See `leaderboard_wireframes.html`.

---

## About the design files

The files in this bundle are **design references created as HTML wireframes** — they show intent, layout, and behavior, not production visuals. Hand-drawn fonts, paper texture, and hatched borders are a *documentation style* for the wireframe itself, **not a directive for the real app's visual design**. Colors and typography in the final build should come from your app's existing design system.

Your task is to **recreate the structure, information architecture, and interactions** of these two screens inside your app's codebase, using its existing components, tokens, and patterns. If no design system exists yet, pick whatever visual direction fits the rest of the product and apply it consistently.

---

## What's in here

Two screens, meant to be navigated in sequence:

| # | Screen | Reached by |
|---|---|---|
| A | **Group leaderboard** | Tapping the "Board" tab in the bottom nav after picks lock |
| B | **Full-field tournament leaderboard** | Tapping the "Full field ›" action in the top-right of screen A |

---

## Screen A — Group leaderboard

### Purpose
Show where every member of the user's picks group stands after picks lock and the tournament begins. Primary job: let the user see who's winning and, on demand, see *which golfers* each person picked.

### Layout (top → bottom)
1. **Status bar** (system)
2. **Top bar**
   - Back chevron (left) → returns to previous screen (typically the group home)
   - Title: "Leaderboard"
   - Right action: "Full field ›" — navigates to screen B
3. **Live status strip**
   - Left: live chip — e.g. "● LIVE · R2 thru 12" (round number, holes completed by leader)
   - Right: hint text — "tap row → see names"
4. **Column headers row** (static; not sortable in v1 but visually suggests sorting)
   - `#` · `Player ↕` · `Total ↓` (default sort) · `Best` · `Δ`
5. **Player rows** — one per group member, sorted by `Total` ascending (golf: lower is better). Each row contains:
   - Rank number (1-indexed)
   - Player display name. If this row is the current user, append "(you)" in accent color.
   - Expand indicator chevron: `▸` collapsed, `▾` expanded
   - Secondary line: dot-separated finish positions for their 4 picks, e.g. `T3 · T14 · T18 · T17`. Use `CUT` for missed-cut golfers.
   - Total score (large, right-aligned)
   - Best finish among their picks, e.g. `T3`
   - Trend arrow: `▲n` (moved up n positions — accent color), `▼n` (moved down — warn color), `–` (no change — muted)
   - The current user's row has a persistent accent-soft background tint
6. **Expanded drawer** (see below)
7. **Bottom tab bar** — "My Picks", "Board" (active), "Group"

### Row expansion behavior — the key interaction
- Tapping a row toggles its expanded state
- **Only one row can be expanded at a time.** Tapping a different row collapses the currently open one and opens the new one
- Tapping the open row again collapses it (optional — acceptable to make tapping elsewhere the only way to collapse)
- The expanded drawer appears *inline beneath the row* (does not push other rows offscreen or use a modal)
- Drawer styling: accent-soft background if it's the user's own row; paper-2 otherwise. Left border is a 3px accent-color rule that visually tethers the drawer to its parent row.
- Drawer contents: for each of the player's 4 picks, one line:
  - World ranking at time of pick, e.g. `#12` (mono, de-emphasized)
  - Golfer name, e.g. "Lowry"
  - Current tournament finish, e.g. `T14`. If `CUT`, render in warn color.
- Default state on first load: the current user's own row should be **pre-expanded** so they immediately see their own picks.

### Data shape

```ts
type GroupMember = {
  id: string;
  displayName: string;
  isCurrentUser: boolean;
  totalScore: number;         // sum of their picks' finish positions (CUT = worst-case constant)
  trend: number;              // positions moved since last update. negative = moved up
  picks: Pick[];              // always 4
};

type Pick = {
  golferId: string;
  golferName: string;         // short form, e.g. "Scheffler"
  worldRankAtPick: number;    // frozen at lock time
  currentFinish: string;      // "T3" | "T14" | "CUT" | "F" | etc — raw from feed
};
```

### Sorting & ranking
- Rows are sorted by `totalScore` ascending. Ties break by `min(pick.currentFinish)` ascending, then alphabetically.
- Rank number is the position in the sorted list (1-indexed). Handle ties however you prefer; not specified in v1.
- `Best` column is `T` + min finish position among non-cut picks. If all picks are CUT, show `—`.

### Live updates
- Leaderboard data refreshes periodically (server pushes or polls every ~2 min — decide based on your infra).
- When a row's total or position changes, no special animation is required for v1. Trend arrows reflect movement since the previous poll.

---

## Screen B — Full-field tournament leaderboard

### Purpose
Satisfy the "I want to see how the actual tournament is going" urge without leaving the app. Secondary: let users scan the field with their group's picks highlighted.

### Layout
1. Status bar
2. Top bar
   - Back chevron → returns to screen A
   - Title: the tournament name, e.g. "The Masters"
   - Right action: "Filter" (icon or text; opens a filter sheet — not specified in v1)
3. **Event header strip**
   - Left: small caps label "Full field · R2"; large handwritten line "All 89 golfers" (substitute actual field size)
   - Right: live chip "● LIVE"
4. **Segmented control** — three equal-width segments:
   - **All** (default, selected)
   - **Picked by group** — filters to golfers picked by any group member
   - **My picks** — filters to only the current user's 4 picks
5. **Column headers:** `Pos` · `Player` · `Score` · `Thru`
6. **Field rows** — one per golfer in the current filter. Each row:
   - Position code (e.g. "T1", "T11", "CUT") — mono, bold
   - Golfer name in "F. Last" format
   - If the golfer is picked by anyone in the group: add an inline `picked` chip (accent) and tint the row's background accent-soft
   - Score to par (e.g. `-9`, `+2`, `E`). Under-par scores render in warn color to stand out
   - Thru — holes completed, or `F` for finished
7. Bottom tab bar — "Board" still active

### Behavior
- Tapping a row is **not specified** for v1. Tapping a picked-row could optionally jump back to screen A with that player's row expanded — nice-to-have, not required.
- Segmented control switches the visible list; highlighting logic remains the same in all segments (in "My picks" every row will be highlighted).
- Filter action in the top bar is a placeholder for v2 (filter by country, round, made/missed cut, etc.)

---

## Design tokens used (lifted from the wireframe — use your app's equivalents)

| Role | Wireframe value | In your app |
|---|---|---|
| Paper / background | `#FAF8F3` | app's primary surface |
| Paper-2 / raised | `#F1EEE4` | secondary surface |
| Ink | `#1A1A1A` | primary text / borders |
| Ink-2 | `#4A4A4A` | secondary text |
| Ink-3 | `#8A8A8A` | tertiary text / divider |
| Line-soft | `#C9C5BA` | dashed row dividers |
| Accent | `#4A6B4A` (muted fairway green) | primary accent / "you" / positive trend / picked highlight |
| Accent-soft | `#DDE5D8` | accent backgrounds |
| Warn | `#A86B3C` (muted terracotta) | negative trend / under-par score / CUT |
| Warn-soft | `#EADDCB` | warn backgrounds |

The **semantic pairings** (accent for positive/picked/you, warn for negative/CUT/under-par) matter more than the exact hex values. Match them to your app's system.

Typography in wireframes uses hand-drawn fonts (Caveat, Architects Daughter) and JetBrains Mono. **Replace with your app's sans + mono** — there is no brand commitment to handwriting.

---

## Not in scope for this handoff
- Other leaderboard variants (chip view, head-to-head) — abandoned
- The Filter sheet from screen B's top-right action
- Tap-through from a field row back to a specific player's drawer
- Pre-lock (picks not yet due) state of this screen — handled elsewhere
- Empty states (group with <2 members, tournament not started, etc.) — design TBD

---

## Files in this bundle
- `leaderboard_wireframes.html` — both screens side-by-side, self-contained, open in any browser
- `README.md` — this file
- `CLAUDE_CODE.md` — how to hand this off to Claude Code
