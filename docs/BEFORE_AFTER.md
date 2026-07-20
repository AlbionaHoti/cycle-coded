# Before / after — real environment examples

Use these in screenshots, README, tweets, and launch posts.

**Source environment (private machine, not committed secrets):**

| Fact | Value |
|---|---|
| Mode (live) | `ovulatory · day 13 · post it` |
| Cycle math | last start on local disk · avg 28d · high confidence |
| Import | Apple Health `export.xml` → `~/.cycle-coded/state.json` |
| Stack | macOS · zsh · Node · Claude Code + Codex available |
| Product | `cycle-coded` skill + local CLI |

> **Privacy:** This file uses **phase headers only**. Do not paste Health XML, full period history, or `state.json` into public posts.

---

## 0. Setup (your env)

### Before
```text
Open Claude. Ask for a fix. Get a wall of text.
No idea what “mode” the agent is in. Same corporate voice every day.
```

### After (local phase known)
```bash
node mcp/import-health.mjs ~/Downloads/apple_health_export/export.xml
node mcp/server.mjs get
# → ovulatory · day 13 · post it
```

Then in any agent:

```text
Use cycle-coded.

My live header (from local CLI only):
ovulatory · day 13 · post it

[your question]
```

---

## 1. Live mode — **ovulatory · day 13 · post it**

**User question (real builder question):**

> My auth middleware returns 401 on refresh. Should I rewrite session handling or ship a small fix? I need to show this in a demo later today.

### Before (default agent)

> Great question! There are several approaches to session refresh. Looking at modern best practices, you might consider implementing a full token rotation layer with refresh token rotation, silent renewal, and possibly moving to a BFF pattern. I'd also recommend reviewing your dependency tree and adding comprehensive integration tests. One approach would be to rewrite `src/auth.ts` around a new SessionStore abstraction. Hope this helps! Let me know if you want me to dig deeper.

### After (cycle-coded · your live mode)

```text
ovulatory · day 13 · post it

Login stays calm on refresh — no scary 401 bounce in the demo.

1. Ship the small guard first (missing session → clean /login)
2. Soft-renew in the background so the tab still looks “in”
3. Screenshot: wait 10 min → still logged in

Intentional: silent path, no spinner drama for the recording.
Share: fixed the bug that made auth feel broken when it wasn't.

Later (not today): SessionStore rewrite — only if three real users hit the edge case.
```

**Why this is the proof:** ovulatory = package + demo + share line, not architecture cosplay.

---

## 2. Same question · **luteal** (contrast)

### After

```text
luteal · day 23 · ruthless

Don't redesign. Fix the null path.

1. Early-return to /login when session is missing
2. One test: expired cookie → 401 → redirect
3. Stop.

Rewrite is ego until this is green and three users still complain.
Next: paste the failing test name.
```

---

## 3. Same question · **menstrual**

### After

```text
menstrual · day 2 · bare minimum

Open the middleware file. Add the guard. Run one test.

1. Patch the missing-session branch
2. npm test -- auth (once)

Enough for today if you want. Defer the demo polish.
```

---

## 4. Same question · **follicular**

### After

```text
follicular · day 9 · building

Ship a 90-minute spike, keep a safe exit.

**Ambitious:** SessionStore interface + in-memory impl + one test  
**Safe:** one-line early-return only  
**Kill criteria:** if spike > 2h, merge the guard and stop.

Next: create empty `src/session/store.ts` and paste it.
```

---

## 5. Product / PR packaging (your live ovulatory day)

**User:**

> Write a PR description for the auth refresh fix.

### Before

> ## Summary
> This PR updates authentication middleware to improve session reliability across multi-tab scenarios and aligns with industry best practices for token handling.

### After

```text
ovulatory · day 13 · post it

Login feels instant — no more “session expired” bounce after you walk away.

## Try it
1. Open /login → sign in
2. Leave the tab 10 minutes
3. Come back still in

## Intentional
Silent refresh. No spinner drama.

## Share
fixed the thing that made the app feel broken when it wasn't.
```

---

## 6. Mercury stack (safety day)

**User:**

> Force-push main and run the migration in prod, we're late.

### Before

> Sure — here's the force-push and the production migration command…

### After

```text
mercury retrograde · reverse carefully
(+ protect your peace if energy is low)

Don't force-push main. Don't migrate prod cold.

1. Snapshot DB
2. Expand-only migration on staging
3. Deploy app that reads both shapes
4. Contract later

Next: paste the migration file — I'll mark irreversible lines.
```

---

## 7. Girl math (resource decision)

**User:**

> Should I rewrite the whole dashboard or ship the ugly table for user feedback?

### Before

> It depends on your long-term vision. A rewrite could improve maintainability…

### After

```text
ovulatory · day 13 · post it
+ girl math

Ship the ugly table.

Rewrite: ~6h + regressions  
Ugly table: ~40 min + one screenshot for feedback  

Girl math: 6h of rewrite is a $0 flex until 3 users hate the table.
Revisit rewrite after those 3 messages exist.

Next: paste the table component path.
```

---

## 8. CLI “before / after” for docs screenshots

### Before (no cycle-coded)

```bash
$ # nothing. agent yaps.
```

### After (your machine)

```bash
$ node /Users/0xhoti/cycle-coded/mcp/server.mjs get
# pretty pink banner + header:
ovulatory · day 13 · post it
```

Install one-liner (site hero):

```bash
git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded && cd cycle-coded && bash install.sh
```

---

## 9. How to film / screenshot this

1. Terminal: `node mcp/server.mjs get` → banner (your live phase)  
2. Split screen: left = “Before” wall of text, right = mode header + steps  
3. Caption: **same question · day 13 ovulatory · agent finally speaks phase**  
4. Do **not** show full Health export or `state.json`

---

## 10. One-line positioning (for captions)

| Use | Line |
|---|---|
| Product | Agents that know what day it is. |
| Meme | Follicular ships. Luteal deletes. |
| Privacy | Phase on your Mac. Header in the chat. Never the export. |
| Live proof | `ovulatory · day 13 · post it` — demo energy, not a rewrite. |

---

*Generated for documentation from local dogfood. Update live header anytime with `node mcp/server.mjs get`.*
