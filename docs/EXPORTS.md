# Bring your cycle data in (export guides)

**Everything below runs on your computer.**  
cycle-coded does **not** send Health exports, period dates, or `state.json` to our servers — we don’t run a data server for this.

**cycle-coded never logs into Flo, Clue, or Apple for you.**  
You export → you run a local script → state stays in `~/.cycle-coded/` on **your** disk.

See [PRIVACY.md](../PRIVACY.md) for the full guarantee and the Claude-chat caveat.

Not medical advice. We only need **period start dates** (and optional length) so the agent can pick a phase header.

---

## What we need (minimum)

| Field | Why |
|---|---|
| Last period **start** (first bleed day) | Phase math |
| Average cycle length (optional) | Better phase windows; default 28 |
| History of starts (optional) | Compute avg length from your real cycles |

Symptoms, BBT, mucus, sexual activity, mood: **not required** for v1 modes. Nice later for “reviews,” never required for install.

---

## Option A — Apple Health (best if you already log there)

You said the data lives here. Two paths:

### A1. Full Health export → automatic import (recommended)

Apple’s built-in “Export All Health Data” is heavy (can be GBs) but includes every menstrual flow sample.

**On iPhone**

1. Open **Health**
2. Tap your **profile picture** (top right)
3. Scroll → **Export All Health Data**
4. Confirm → wait (can take a while)
5. Share the `Export.zip` to your Mac (AirDrop / Files)

**On Mac**

```bash
# unzip wherever you saved it
unzip ~/Downloads/Export.zip -d ~/Downloads/apple_health_export

# import (local only — never uploads)
node /path/to/cycle-coded/mcp/import-health.mjs \
  ~/Downloads/apple_health_export/apple_health_export/export.xml
```

If the folder layout differs, point at whatever file is named `export.xml` / `Export.xml`.

The importer:

- scans for `HKCategoryTypeIdentifierMenstrualFlow` (and related bleed types)
- groups consecutive flow days into periods
- writes period starts + computed average cycle length into `~/.cycle-coded/state.json`
- prints a short review summary (local stdout only)

See [PRIVACY.md](../PRIVACY.md).

### A2. Cycle History PDF (manual / light)

Health → **Browse** → **Cycle Tracking** → **Cycle History** → **Export PDF**.

Useful for your own reviews with a clinician. For cycle-coded, open the PDF and either:

- copy the latest start date into:

```bash
node mcp/server.mjs set YYYY-MM-DD 28
```

- or make a tiny CSV (Option D) and import that

We do **not** parse the PDF in v1 (layout changes; XML is reliable).

### A3. What Apple stores that we read

| HealthKit type | Use |
|---|---|
| `HKCategoryTypeIdentifierMenstrualFlow` | Primary — flow days → period starts |
| `HKCategoryTypeIdentifierIntermenstrualBleeding` | Optional context; not used as period start by default |
| Ovulation test / cervical mucus / BBT | Ignored in v1 (future “rich review” mode) |

---

## Option B — Flo

1. Flo → **Profile / More** → **Settings**
2. Look for **Download my data** / **Export** / privacy export (wording varies by version and region)
3. Prefer CSV/JSON if offered; otherwise use Apple Health if Flo was writing to Health

If Flo syncs to Apple Health (common when permitted):

- Settings → allow Health write for Cycle Tracking / Menstrual Flow  
- Then use **Option A**

Manual fallback: note last start date → `node mcp/server.mjs set …`

---

## Option C — Clue, Natural Cycles, Stardust, other apps

Same pattern:

1. In-app **export / download my data**
2. If the app **writes to Apple Health**, use Option A (one pipeline for everything)
3. Else export CSV → Option D

**Tip for multi-app chaos:** pick **Apple Health as the hub**. Turn on write permissions from your tracker → one export feeds cycle-coded.

---

## Option D — Simple CSV (any app, any spreadsheet)

Create `periods.csv`:

```csv
period_start
2025-11-03
2025-12-01
2025-12-30
2026-01-27
2026-02-24
2026-03-25
2026-04-22
2026-05-20
2026-06-17
2026-07-15
```

Import:

```bash
node mcp/import-health.mjs --csv periods.csv
```

Optional column `cycle_length` is ignored per row; average is computed from gaps between starts.

---

## Option E — Just type it (valid!)

```bash
node mcp/server.mjs set 2026-07-15 28
node mcp/server.mjs get
```

Or in chat with the skill: *“Last period started July 15, avg 28 days — set cycle-coded.”*

---

## After import — “cycle review” with the agent

```bash
node mcp/server.mjs get
```

Then in Claude:

> `/cycle-coded`  
> Here’s my cycle state (paste `get` JSON). Give me this week’s mode header and how we should work Mon–Sun.

Or ask for a **review** without medical claims:

> Summarize my last 6 cycle lengths from this data. Flag irregular gaps as “worth a human check,” not as diagnosis. Then set this week’s agent mode.

---

## Integrations roadmap (honest)

| Integration | v1 | Later |
|---|---|---|
| Apple Health XML import | ✅ local script | streaming improvements |
| CSV of period starts | ✅ | — |
| Flo/Clue direct API | ❌ no OAuth in v1 | only if they expose user-owned export APIs and we stay local-first |
| Live HealthKit on Mac | ❌ needs app + permissions | optional native helper |
| Google Fit / Samsung | ❌ | CSV or Health Connect export guides |
| Auto-sync every morning | ❌ | LaunchAgent calling import on a folder you drop into |

**Principle:** dead exports you control > live cloud tokens we could abuse.

---

## Troubleshooting

**Import finds 0 periods**  
- Confirm Cycle Tracking logs exist in Health  
- Confirm the XML path is the real `export.xml` (not only `export_cda.xml`)  
- Re-export after opening Cycle Tracking once (forces recent samples to sync)

**Export.zip is huge / slow**  
- That’s normal. Importer streams line-by-line and only keeps menstrual-related rows.

**Phase feels wrong after import**  
- Check last start: `node mcp/server.mjs get`  
- Override: `node mcp/server.mjs set YYYY-MM-DD`  
- Or say the phase in chat (*I’m luteal*) — explicit phrase wins

**Privacy anxiety**  
- Delete the unzipped export after import  
- `node mcp/server.mjs clear` wipes cycle-coded state  
- Never commit `export.xml` or `~/.cycle-coded/` to git
