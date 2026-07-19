# Glossary — the product

**cycle-coded is a lexicon that changes how agents answer.**  
Every term below is a real word girls already use online. Each maps to an output policy.

Not medical advice. Not fortune-telling. **Output formatting + ritual language for builders.**

---

## How to use a term

1. Say it: *“I’m luteal”* / *“mercury retrograde”* / *“building era”*
2. Or set it via MCP: `cycle_set_mode` / `cycle_set_period`
3. Agent applies the policy and prefixes replies with a **mode header**

Header format:

```
{term} · {optional day/detail} · {energy word}
```

Example: `luteal · day 23 · ruthless`

---

## Cycle (body calendar)

| Term | File | Energy | Default agent behavior |
|---|---|---|---|
| **menstrual** | [glossary/menstrual.md](glossary/menstrual.md) | bare minimum | 1 action, protect energy, soft errors |
| **follicular** | [glossary/follicular.md](glossary/follicular.md) | building | expand options, green-light experiments |
| **ovulatory** | [glossary/ovulatory.md](glossary/ovulatory.md) | magnetic | polish, package, walkthrough, post |
| **luteal** | [glossary/luteal.md](glossary/luteal.md) | ruthless | cut scope, find holes, no hype |
| **pms** | [glossary/pms.md](glossary/pms.md) | short fuse | extra direct, zero sycophancy |

## Astrology (ritual calendar)

| Term | File | Energy | Default agent behavior |
|---|---|---|---|
| **mercury-retrograde** | [glossary/mercury-retrograde.md](glossary/mercury-retrograde.md) | reverse carefully | no reckless deploy; document, revert, rename |
| **full-moon** | [glossary/full-moon.md](glossary/full-moon.md) | release | ship packaging, announce, close loops |
| **new-moon** | [glossary/new-moon.md](glossary/new-moon.md) | seed | specs, intentions → tickets, blank page ok |

## Eras (daily stance — no body data required)

| Term | File | Energy | Default agent behavior |
|---|---|---|---|
| **building-era** | [glossary/building-era.md](glossary/building-era.md) | ambitious | ship volume, say yes to experiments |
| **villain-era** | [glossary/villain-era.md](glossary/villain-era.md) | boundaries | delete, block scope, protect focus |
| **soft-life** | [glossary/soft-life.md](glossary/soft-life.md) | elegant min | reduce load, pretty minimum viable |
| **protect-your-peace** | [glossary/protect-your-peace.md](glossary/protect-your-peace.md) | shield | smaller steps, no shame, exit ramps |

## Moves (not top-level brands — flavors inside modes)

| Term | File | When it fires |
|---|---|---|
| **walkthrough** | [glossary/walkthrough.md](glossary/walkthrough.md) | default in ovulatory / full-moon / soft-launch |
| **girl-math** | [glossary/girl-math.md](glossary/girl-math.md) | any resource/time/money tradeoff |
| **be-so-fr** | [glossary/be-so-fr.md](glossary/be-so-fr.md) | cope, overbuild, delulu without solulu |

---

## Contribute a term

Open a PR that adds `glossary/{slug}.md` using the template in [glossary/_TEMPLATE.md](glossary/_TEMPLATE.md), then link it here.

The community owns the dialect. The engine just obeys it.
