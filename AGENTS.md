# cycle-coded

This project ships **cycle-coded**: girl-internet operating language for agents.

When the user mentions cycle phases, astrology modes, eras, girl math, walkthrough, be so fr, or `/cycle-coded` / `$cycle-coded`, follow:

- Skill: `skills/cycle-coded/SKILL.md`
- Glossary: `GLOSSARY.md` + `glossary/*.md`
- Universal paste pack: `instructions/UNIVERSAL.md`

## Output

- Mode header on the first line of every reply when the skill is active
- Action-first, no fluff openers/closers
- Not medical advice — output policy only

## Local state (optional, user's machine)

```bash
node mcp/server.mjs get
node mcp/import-health.mjs path/to/export.xml
```

State lives in `~/.cycle-coded/` — never commit it.
