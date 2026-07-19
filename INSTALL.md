# Install cycle-coded

Glossary-first Claude / Codex plugin + optional local MCP.

## Claude Code

```bash
git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded
claude plugin marketplace add ./cycle-coded
claude plugin install cycle-coded@cycle-coded
```

Open Claude Code → `/cycle-coded`

Or natural language:

- “I’m luteal — ruthless.”
- “Mercury retrograde. Don’t let me deploy dumb.”
- “Ovulatory walkthrough for this PR.”

Disable: `claude plugin disable cycle-coded`

## Codex

```bash
codex plugin marketplace add AlbionaHoti/cycle-coded --ref main
codex plugin add cycle-coded@cycle-coded
```

Use `$cycle-coded` or name a glossary term.

## Always-on

`~/.claude/CLAUDE.md`:

```markdown
## Output style
Always follow cycle-coded: mode headers, glossary policies for cycle/astro/era terms, action-first, no fluff closers. Not medical advice.
```

## MCP (phase state)

```bash
node /path/to/cycle-coded/mcp/server.mjs set YYYY-MM-DD 28
node /path/to/cycle-coded/mcp/server.mjs get
```

## Import cycle history (Apple Health etc.)

```bash
# Health app → profile → Export All Health Data → AirDrop zip → unzip
node /path/to/cycle-coded/mcp/import-health.mjs /path/to/export.xml
node /path/to/cycle-coded/mcp/server.mjs get
```

Step-by-step for Health, Flo, Clue, CSV: [docs/EXPORTS.md](docs/EXPORTS.md)

Claude MCP config:

```json
{
  "mcpServers": {
    "cycle-coded": {
      "command": "node",
      "args": ["/path/to/cycle-coded/mcp/server.mjs"]
    }
  }
}
```

Privacy: [PRIVACY.md](PRIVACY.md)

## Verify

```bash
claude plugin list
node --test mcp/test.mjs
```

## Update

```bash
cd ./cycle-coded && git pull
```

## Uninstall

```bash
claude plugin uninstall cycle-coded
claude plugin marketplace remove cycle-coded
rm -rf ~/.cycle-coded   # optional: wipe local state
```

## Troubleshooting

**`/cycle-coded` missing** — restart Claude Code; plugins load at startup.

**Still yapping** — new session; add always-on CLAUDE.md block; re-invoke with an explicit term (*luteal*).

**Phase feels wrong** — set period start via MCP, or override by saying the phase out loud (explicit phrase wins).

**Want a new word** — PR a file in `glossary/` using `_TEMPLATE.md`.
