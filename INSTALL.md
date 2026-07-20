# Install — one command

**One skill. Same rules. Everywhere.**

## The only command you need

```bash
git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded && cd cycle-coded && bash install.sh
```

Or from anywhere (no prior clone):

```bash
curl -fsSL https://raw.githubusercontent.com/AlbionaHoti/cycle-coded/main/scripts/bootstrap.sh | bash
```

That single script:

1. Links the skill for **Claude Code**, **Codex**, and **Agent Skills** (`~/.claude/skills`, `~/.agents/skills`)
2. Best-effort installs **Claude / Codex / skills.sh** plugins if those CLIs exist
3. Writes **`instructions/ONE_PROMPT.md`** — paste into **ChatGPT / Gemini / Grok** custom instructions
4. Hooks **Cursor** rules when `~/.cursor` exists

## After install

| Surface | Say / do |
|---|---|
| Claude Code | `/cycle-coded` or *I'm luteal* |
| Codex | `$cycle-coded` |
| Cursor | Open the repo |
| ChatGPT / Gemini / Grok | Paste `instructions/ONE_PROMPT.md` once as system/custom instructions |

Optional live phase (local only):

```bash
node mcp/server.mjs get
# paste only the header line into a web chat
```

## Details

- Privacy: [PRIVACY.md](PRIVACY.md)
- Health export: [docs/EXPORTS.md](docs/EXPORTS.md)
- Notify gate: [docs/NOTIFY.md](docs/NOTIFY.md)
