# Install cycle-coded — every agent

One skill. Same rules. **Claude, Codex, ChatGPT, Gemini, Grok, Cursor, anything that takes a system prompt.**

Your cycle dates stay on **your** computer (`~/.cycle-coded/`). Never required for install.

---

## Quick: skill links on this machine

```bash
git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded
cd cycle-coded
bash install.sh
```

That symlinks the skill into:

- `~/.agents/skills/cycle-coded` (Codex / open Agent Skills)
- `~/.claude/skills/cycle-coded` (Claude Code)
- project `.agents/skills/cycle-coded`

---

## By product

### Claude Code

```bash
claude plugin marketplace add /path/to/cycle-coded
claude plugin install cycle-coded@cycle-coded
```

Then: `/cycle-coded` or say *I'm luteal*.

Always-on: add to `~/.claude/CLAUDE.md`:

```markdown
Follow cycle-coded skill. Mode headers. Not medical advice.
```

### Codex (ChatGPT desktop / CLI)

```bash
codex plugin marketplace add AlbionaHoti/cycle-coded --ref main
codex plugin add cycle-coded@cycle-coded
```

Or after `bash install.sh`, skill is in `~/.agents/skills/cycle-coded`.

In Codex: `$cycle-coded` or natural language.

Project-level: open this repo (has `AGENTS.md`).

### skills.sh (multi-agent installer)

```bash
npx skills add AlbionaHoti/cycle-coded --skill cycle-coded
# optional: target agents
npx skills add AlbionaHoti/cycle-coded --skill cycle-coded -a claude-code -a codex
```

### ChatGPT (web / Projects)

1. Open **Custom instructions** or a **Project** instruction file  
2. Paste all of [`instructions/UNIVERSAL.md`](instructions/UNIVERSAL.md)  
3. Optional: paste your live header from local CLI (below)  
4. Start a chat: *use cycle-coded — I'm follicular*

### Gemini (app / Advanced / CLI)

- **App:** paste `instructions/UNIVERSAL.md` into custom instructions / Gem instructions  
- **CLI / project:** copy `GEMINI.md` into the project root (or merge into existing)  
- Paste live header from CLI when you want real phase

### Grok (xAI / grok.com / Grok Build)

- Paste `instructions/UNIVERSAL.md` into custom instructions / system prompt  
- Or attach the file at session start  
- Paste live header from CLI for real phase

### Cursor

Repo already includes `.cursor/rules/cycle-coded.mdc`.

Open this repo in Cursor, or copy that file into your project’s `.cursor/rules/`.

### Any other model (Copilot Chat, open-source UIs, …)

Paste `instructions/UNIVERSAL.md` as system / developer message.  
Same output contract.

---

## Your real cycle data (local only)

```bash
# after Apple Health export — see docs/EXPORTS.md
node mcp/import-health.mjs ~/Downloads/apple_health_export/export.xml

# pretty banner + header
node mcp/server.mjs get

# dogfood pack for every chat UI (writes only to /tmp)
node scripts/test-local.mjs
```

Then paste **only the header line** into ChatGPT / Gemini / Grok — not the Health XML.

---

## Optional MCP (Claude Desktop / agents that speak MCP)

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

MCP is optional. Skill + pasted header works everywhere.

---

## Verify

```bash
bash install.sh
node mcp/server.mjs get
node scripts/test-local.mjs
node --test mcp/test.mjs
```

---

## Privacy

See [PRIVACY.md](PRIVACY.md). No cycle-coded server. State in `~/.cycle-coded/` only.
