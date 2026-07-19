# cycle-coded MCP

Local-first mode state for the [cycle-coded](../README.md) skill.

**Not medical advice.** Phase is a calendar estimate used only so agents can format answers.

## State location

`~/.cycle-coded/state.json` (mode `0600`, directory `0700`)

Override with `CYCLE_CODED_HOME`.

## CLI

```bash
node server.mjs set 2026-07-01 28   # last period start, avg length
node server.mjs get                 # ASCII banner + header (TTY)
node server.mjs banner              # art only
node server.mjs clear
node server.mjs help
```

In an interactive terminal, `get` / `set` / import print **ASCII art** + mode box (stderr) and a copy-paste header on stdout.

Pipes stay machine-readable:

```bash
node server.mjs get | jq .          # force non-pretty? use:
CYCLE_CODED_JSON=1 node server.mjs get
```

## Import from Apple Health or CSV

```bash
# Apple Health export.xml (after unzip) — streams; safe for large files
node import-health.mjs ~/Downloads/apple_health_export/apple_health_export/export.xml

# dry-run (no write)
node import-health.mjs --dry-run path/to/export.xml

# simple CSV
node import-health.mjs --csv periods.csv
```

Guides for exporting from Health / Flo / Clue: [../docs/EXPORTS.md](../docs/EXPORTS.md)

```bash
node --test import-health.test.mjs
```

## Claude Desktop / Claude Code MCP config

```json
{
  "mcpServers": {
    "cycle-coded": {
      "command": "node",
      "args": ["/absolute/path/to/cycle-coded/mcp/server.mjs"]
    }
  }
}
```

## Tools

| Tool | Purpose |
|---|---|
| `cycle_set_period` | last period start + avg length |
| `cycle_get` | phase, day, confidence, modes, header |
| `cycle_set_mode` | toggle era/astro/move flags |
| `cycle_header` | header string only |
| `cycle_clear` | wipe local state |

## Tests

```bash
node --test test.mjs
```
