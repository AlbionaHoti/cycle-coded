# Notify gate (Router-style)

Same product pattern as Teleport Router's **"Sync this to Router?"**:

1. Agent notices a noteworthy moment in the thread  
2. Calls **`cycle_propose_notify`** → gets a **preview** (oneliner / summary / tags)  
3. Shows preview and asks **Notify cycle-coded?**  
4. Only after **yes** → **`cycle_notify`** with `confirmed: true`  
5. Writes **local** log + optional **macOS** banner  

Nothing is uploaded. Log: `~/.cycle-coded/notifications.jsonl`

## CLI test (right now)

```bash
node mcp/server.mjs notify-test   # propose → confirm → banner
node mcp/server.mjs notify-list
```

## MCP tools

| Tool | When |
|---|---|
| `cycle_propose_notify` | Before ask — preview only |
| `cycle_notify` | After user yes — log + banner |
| `cycle_notify_list` | Read recent |

## Agent instructions

Injected on MCP `initialize` as `instructions` (clients that honor it).  
Also documented in `skills/cycle-coded/SKILL.md`.

## Example preview (from live dogfood)

```
── cycle-coded notify preview ──
Oneliner: Demo energy
Summary: Live dogfood: ovulatory/post-it mode — …
Tags: ovulatory, dogfood, docs
Header: ovulatory · day 13 · post it
Suggested mode: walkthrough
───────────────────────────────
Reply yes / "notify" / "log it" to confirm.
```
