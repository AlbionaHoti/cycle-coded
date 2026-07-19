<p align="center">
  <strong>cycle-coded</strong>
</p>
<p align="center">
  Claude that speaks cycle, chart, and era language — and obeys it.
</p>
<p align="center">
  <em>Glossary-first. Runs on your computer. No cycle-coded server. Not medical advice.</em>
</p>

<p align="center">
  <a href="GLOSSARY.md">Glossary</a> ·
  <a href="INSTALL.md">Install</a> ·
  <a href="PRIVACY.md">Privacy</a> ·
  <a href="landing/index.html">Landing</a>
</p>

---

## What this is

Girls already run life in cycle, chart, and era language — *I’m luteal*, *mercury retrograde*, *building era*. That dialect is a **daily operating system**, not a joke.

**cycle-coded** makes agents obey it:

- say a word you already use online  
- tempo, risk, tone, and packaging switch with that word  
- one corporate voice forever is the bug  

It’s a **lexicon that reshapes answers** — not a wellness app, not a diagnosis tool.  
Walkthrough and girl-math are **moves inside the dialect**, not separate brands.

Cycle dates (if you import them) stay on **your** computer. No cycle-coded server, no account, no cloud sync. Details: [PRIVACY.md](PRIVACY.md).

---

## Install — Claude, Codex, ChatGPT, Gemini, Grok, Cursor

**One skill. Same rules. Everywhere.**

```bash
git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded
cd cycle-coded
bash install.sh          # links skill for Claude + Codex + Agent Skills
```

| Surface | How |
|---|---|
| **Claude Code** | `claude plugin marketplace add ./cycle-coded` → `claude plugin install cycle-coded@cycle-coded` → `/cycle-coded` |
| **Codex** | `codex plugin marketplace add AlbionaHoti/cycle-coded --ref main` → `codex plugin add cycle-coded@cycle-coded` → `$cycle-coded` |
| **skills.sh** | `npx skills add AlbionaHoti/cycle-coded --skill cycle-coded` |
| **ChatGPT web** | Paste [`instructions/UNIVERSAL.md`](instructions/UNIVERSAL.md) into custom / project instructions |
| **Gemini** | Paste `UNIVERSAL.md` or use repo [`GEMINI.md`](GEMINI.md) |
| **Grok** | Paste `UNIVERSAL.md` into custom instructions |
| **Cursor** | Repo ships [`.cursor/rules/cycle-coded.mdc`](.cursor/rules/cycle-coded.mdc) |
| **Any chat** | Paste `UNIVERSAL.md` as system prompt |

Full detail: **[INSTALL.md](INSTALL.md)**

### Your real phase (local only — Apple Health)

```bash
node mcp/import-health.mjs path/to/export.xml
node mcp/server.mjs get
node scripts/test-local.mjs    # paste packs for every UI → /tmp only
```

Then paste **only the header** (e.g. `follicular · day 12 · building`) into ChatGPT / Gemini / Grok — never the Health XML.

State: `~/.cycle-coded/` · [PRIVACY.md](PRIVACY.md) · [docs/EXPORTS.md](docs/EXPORTS.md)

---

## The glossary is the product

Full index: **[GLOSSARY.md](GLOSSARY.md)**

| Kind | Terms |
|---|---|
| **Cycle** | menstrual · follicular · ovulatory · luteal · pms |
| **Astro** | mercury-retrograde · full-moon · new-moon |
| **Eras** | building-era · villain-era · soft-life · protect-your-peace |
| **Moves** | walkthrough · girl-math · be-so-fr |

Every term has: policy, hard rules, forbidden phrases, before/after.

---

## What changes

<table>
<tr>
<td width="50%">

### Before (default agent)

> Great question! Your auth flow has several moving pieces. One approach would be a full session redesign. You might also want to consider dependency hygiene. Hope this helps!

</td>
<td width="50%">

### After (`luteal · day 23 · ruthless`)

> `luteal · day 23 · ruthless`
>
> Don’t redesign. Fix the null on `src/auth.ts:58`.
>
> 1. Early-return to `/login` if no session  
> 2. Run `npm test -- auth`  
>
> Rewrite is ego until three users complain.

</td>
</tr>
</table>

<table>
<tr>
<td width="50%">

### After (`ovulatory · walkthrough`)

> `ovulatory · day 14 · post it`
>
> Login feels instant — no “session expired” bounce.
>
> 1. Open `/login`  
> 2. Sign in once  
> 3. Wait 10 min → still in  
>
> Intentional: silent refresh.  
> Share: *fixed the bug that made the app feel broken when it wasn’t.*

</td>
<td width="50%">

### After (`mercury retrograde`)

> `mercury retrograde · reverse carefully`
>
> Don’t force-push. Don’t migrate prod cold.
>
> 1. Snapshot DB  
> 2. Expand-only on staging  
> 3. Deploy dual-read app  
> 4. Contract later  

</td>
</tr>
</table>

---

## How it works

```
you say a word that already exists online
        ↓
skill loads glossary policy
        ↓
optional MCP adds day/phase header
        ↓
answer tempo · risk · tone · artifact change
```

**Safety / protect modes win** when stacked with ambitious ones.

---

## Repo layout

```
GLOSSARY.md                 ← start here
glossary/                   ← every term = policy file
skills/cycle-coded/SKILL.md ← agent instructions
mcp/                        ← local-only phase + mode state + health import
landing/index.html          ← community face
docs/EXPORTS.md             ← Apple Health / app export guides
```

---

## Contribute a term

1. Copy `glossary/_TEMPLATE.md`
2. Write rules + before/after in **our** voice
3. Link it in `GLOSSARY.md`
4. Open a PR

The community owns the dialect.

---

## What this is not

- Not a medical device or cycle clinic  
- Not fertility or diagnosis advice  
- Not fortune-telling  
- Not “women should only work on certain days” ideology  

It’s **output policy + shared language** for people who already talk this way.

---

## License

MIT. Built for the girls who already had the words.
