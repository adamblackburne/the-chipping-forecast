# Using this handoff with Claude Code

This bundle is a design spec for a single feature in an app called **The Chipping Forecast**. Hand it to Claude Code when you want to implement the leaderboard screens in a real codebase.

---

## 1. Put the bundle somewhere Claude Code can see it

Drop the whole `design_handoff_leaderboard/` folder into your project — a sensible spot is alongside your repo at the root, or inside `docs/design/` if you have one:

```
your-app/
├── docs/
│   └── design/
│       └── design_handoff_leaderboard/
│           ├── README.md
│           ├── CLAUDE_CODE.md
│           └── leaderboard_wireframes.html
├── src/
└── ...
```

Open `leaderboard_wireframes.html` in your browser once so you know what you're pointing Claude at.

---

## 2. Start a Claude Code session in your repo

```bash
cd your-app
claude
```

---

## 3. First prompt — orient Claude

Paste something like:

> Read `docs/design/design_handoff_leaderboard/README.md` end-to-end, then open `leaderboard_wireframes.html` in your head by reading the source. These are low-fi wireframes for two screens in our app's leaderboard feature. Don't start coding yet — first, look around our codebase and tell me:
>
> 1. Where would these two screens live (routes, file locations)?
> 2. What existing components could I reuse (row, chip, tab bar, segmented control)?
> 3. What design tokens in our system map to the roles listed in the README (accent, warn, paper, etc.)?
> 4. Where does the leaderboard data come from today, and what's missing for this feature?
>
> Then propose a short implementation plan.

This forces Claude to ground the spec in your actual codebase before writing anything.

---

## 4. Iterate

Once the plan looks right, ask for the implementation in stages rather than all at once. A good sequence:

1. **Data layer first** — types and a mock data source matching the `GroupMember` / `Pick` shape in the README
2. **Screen A static** — render group members with the given sort, no interaction
3. **Screen A expansion** — add the tap-to-expand drawer with single-open behavior; pre-expand current user
4. **Screen B static** — the full field list with picked-row highlighting
5. **Screen B segmented control** — All / Picked by group / My picks
6. **Navigation** — wire "Full field ›" and the back chevron
7. **Live data** — swap mock source for real feed + polling
8. **Polish** — empty states, loading, error handling

At each stage, reference specific sections of the README:

> Now implement the row expansion behavior described under "Row expansion behavior — the key interaction" in the README. Use our existing `<Row />` and add a collapsible drawer that matches the styling rules there.

---

## 5. Keep the wireframe HTML around

Claude will do better if it can re-read the wireframe HTML for layout details the README doesn't spell out (exact spacing feel, column alignment, hierarchy of elements). Don't delete it after the first pass.

---

## Tips

- **Don't ask Claude to copy the wireframe's visual style.** The handwritten fonts, hatched borders, and paper texture are documentation decoration only. The README says this explicitly — reinforce it in your first prompt if Claude starts styling things with Caveat.
- **Semantic colors matter, exact hex doesn't.** Accent = "you / positive / picked", warn = "negative / CUT / under-par". Map those roles to your app's tokens rather than lifting `#4A6B4A` directly.
- **Pre-expanding the current user's row is a deliberate affordance** — don't let Claude quietly drop it because "users can just tap."
- **Single-open drawer behavior** is the interaction that makes this variant work. If your existing row component doesn't support it, consider a small controller component that manages `openId` state rather than per-row state.

---

## What's explicitly NOT in this handoff

- Any other screen in the app (create group, join, picks flow, etc.)
- Other leaderboard variants we explored and dropped
- Pre-lock leaderboard state, empty states, error states
- The tournament-detail-from-row tap-through
- The Filter sheet

If you need those, come back to the design source and I'll export them too.
