# Contributing

## Add a glossary term

1. Copy `glossary/_TEMPLATE.md` → `glossary/{slug}.md`
2. Fill: definition, policy, hard rules, forbidden, before/after, triggers
3. Link the term in `GLOSSARY.md`
4. Open a PR with title: `glossary: add {slug}`

### Bar for merge

- Real usage online (not invented corporate jargon)
- Actionable agent rules (not vibes only)
- Before/after that would screenshot well
- No medical claims, no fertility advice, no “women can’t code on X day” framing

## Code (MCP)

```bash
node --test mcp/test.mjs
```

Keep the server **zero-dependency** unless there’s a strong reason.

## Tone

Bold, girly, professional under the hood. Mean-bestie is fine. Cruelty toward people is not. Attack bad plans, not the reader.
