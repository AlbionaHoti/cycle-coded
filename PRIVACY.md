# Privacy — runs on **your** computer

**cycle-coded does not run a backend for your cycle data.**  
There is no cycle-coded server, account, cloud sync, analytics, or phone-home.

You install code from GitHub. It runs as processes **on your machine**. Period dates and Health exports stay in files **you** control.

```
┌─────────────────────────────────────────────────────────┐
│  YOUR COMPUTER                                          │
│                                                         │
│  Apple Health export.xml  ──►  import-health.mjs        │
│                                    │                    │
│                                    ▼                    │
│                           ~/.cycle-coded/state.json     │
│                                    │                    │
│                         MCP server.mjs (stdio only)     │
│                                    │                    │
│                         Claude Code / Codex (local)     │
└─────────────────────────────────────────────────────────┘
         │
         │  cycle-coded never opens this pipe for your data
         ✗  no cycle-coded.com API
         ✗  no our database
         ✗  no telemetry
```

## Guarantee (what we mean)

| Claim | Reality |
|---|---|
| No cycle-coded cloud | Correct — we don’t operate one for this project |
| No upload of Health XML | Correct — importer only reads local paths |
| No analytics SDK | Correct — zero dependencies that phone home |
| Data never leaves your Mac | **True for cycle-coded code.** See “Claude chat” below |
| Open and auditable | Yes — read `mcp/server.mjs` and `mcp/import-health.mjs` |

### How to verify yourself (2 minutes)

```bash
# 1) No network libraries in the MCP package
grep -R -nE 'fetch\(|https?\.(get|request)|axios|telemetry|analytics' mcp/ || echo "clean"

# 2) State is only under your home dir
ls -la ~/.cycle-coded/

# 3) Process does not listen on a public port (stdio MCP only)
#    It talks to Claude through stdin/stdout on your machine.
```

If someone publishes a fork that adds a server URL, **don’t use that fork** for health data.

## What is stored (local only)

| Data | Where | Leaves your machine via cycle-coded? |
|---|---|---|
| Last period start, avg length | `~/.cycle-coded/state.json` | **No** |
| Period start history (import) | same file | **No** |
| Active modes (era, astro) | same file | **No** |
| Import metadata (file path, counts) | same file | **No** |
| Apple Health `export.xml` | wherever **you** saved it | **No** (we only read it) |

Permissions: directory `0700`, state file `0600` when we write it.

Override location: `CYCLE_CODED_HOME=/some/path` (still local).

## Apple Health / Flo / Clue exports

1. **You** export on your phone (AirDrop / cable / Files).
2. **You** run `node mcp/import-health.mjs …` on your computer.
3. Script reads the file → writes `~/.cycle-coded/` → exits.
4. No OAuth. No “Sign in with Flo.” No third-party health API.

After import you can delete the unzipped export so only the small state file remains.

## The one honest caveat: chat with Claude / Codex

cycle-coded **does not** upload your `state.json`.

But if you (or the agent) **paste** dates, phase, or Health snippets into a chat with Claude, Codex, Cursor, etc., that text is handled under **that product’s** privacy policy (e.g. Anthropic, OpenAI). That path existed before cycle-coded.

**Safer habits**

- Prefer MCP so the model can call `cycle_get` locally without you pasting a full export.
- Don’t paste entire `export.xml` into chat.
- For screenshots/posts: use `luteal · day 23`, not real calendar dates.
- You can still use **era modes only** (`building-era`, `villain-era`) with **zero** body data.

## What we will not do in this project

- Host cycle data on a public or private server we run  
- Require an account to use phase modes  
- Sell or share cycle data  
- Bundle analytics “just to improve the product” without a loud, optional, separate opt-in (default remains off / absent)

If a future optional cloud feature ever appears, it will be **opt-in, separate package, off by default** — not silent.

## What this is not

- Not a medical device  
- Not diagnosis or fertility advice  
- Not fortune-telling  

Phase math is a **local calendar estimate** for agent output style only.

## Wipe everything

```bash
node mcp/server.mjs clear
# or
rm -rf ~/.cycle-coded
```

MCP tool: `cycle_clear`.

Also delete any Health export zip/xml you no longer need.

## Screenshots & community

Strip personal dates before posting. Prefer mode headers without your real calendar.
