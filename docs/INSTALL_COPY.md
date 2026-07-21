# Install copy (skill-backed)

Audited against skills in this workspace:

| Skill | Path | Use |
|---|---|---|
| **harry-check** | `.agents/skills/harry-check` | Every line visual / falsifiable / only-you |
| **one-sentence** | `.agents/skills/one-sentence` | Mom + billboard test |
| **pitch** | `.agents/skills/pitch` | Frame for install CTA |
| **direct-response-check** | (user agents) | Slippery slide to Copy |
| **copy-audit** | `.claude/skills/copy-audit` | Full suite before ship |

## One-sentence (ship)

> **cycle-coded makes your agent answer like the week you're actually in — PMS, luteal cut, or launch-and-sell.**

## Install CTA (ship)

```
git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded && cd cycle-coded && bash install.sh
```

Supporting line (not the hero):

> Then say "I'm luteal" — or paste the header from `node mcp/server.mjs get`.

## Harry-check on install lines

| Line | V | F | D | Verdict |
|---|---|---|---|---|
| "One skill. Same rules. Everywhere." | weak | ok | weak | rewrite |
| "Makes Claude, Codex, ChatGPT speak PMS / luteal / launch weeks differently." | yes | yes | yes | **ship** |
| "Local-first privacy architecture" | no | meh | no | **kill** from hero |
| "Luteal cuts. Follicular ships." | yes | yes | yes | **ship** |

## Before/after page

`/#before-after` on the site — same question, PMS / luteal / run-launch / demo.
