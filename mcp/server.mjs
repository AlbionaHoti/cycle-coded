#!/usr/bin/env node
/**
 * cycle-coded MCP server — local-only mode state (stdio).
 * Zero dependencies. No network. No cloud. State under ~/.cycle-coded only.
 * Implements a minimal JSON-RPC MCP subset over stdio.
 *
 * Tools:
 *   cycle_set_period  — last period start + avg length
 *   cycle_get         — phase, day, confidence, active modes, header
 *   cycle_set_mode    — eras / astro / moves on|off
 *   cycle_clear       — wipe state
 *   cycle_header      — just the mode header string
 *   cycle_propose_notify — PREVIEW GATE (Router-style). Do not write yet.
 *   cycle_notify      — after user confirms: log + optional macOS banner
 *   cycle_notify_list — recent local notifications
 *
 * Not medical advice. Phase is a calendar estimate for output policy only.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { printStatus, printCleared, printHelp } from "./banner.mjs";
import {
  appendNotification,
  fireMacOSNotification,
  formatPreview,
  listNotifications,
  loadNotifyPrefs,
  saveNotifyPrefs,
} from "./notify.mjs";

/** Injected into MCP clients that honor initialize.instructions (Router pattern). */
export const CYCLE_MCP_INSTRUCTIONS = `
cycle-coded NOTIFY MODE (like Router "Sync this to Router?"):

WHEN TO PROPOSE (active mode — default):
At noteworthy moments in the conversation, call cycle_propose_notify with a short
oneliner (≤20 chars), 2–3 sentence summary, 1–5 tags, optional suggested_mode.
Then SHOW the preview block from the tool result to the user and ASK:

  "Notify cycle-coded?"

Do NOT call cycle_notify until the user explicitly confirms
(yes / notify / log it / 记一下 / 好 / go).

Noteworthy moments include:
- User names a phase/energy shift ("I'm luteal", "so ovulatory", "protect my peace")
- A ship / demo / hard cut decision that should be mode-tagged
- Wrapping a session with a real outcome
- User asks to remember energy/mode for later today

Skip: trivial edits, casual chat, secrets, raw Health export contents.

EXPRESS PATH:
If user says "notify" / "log this" / "cycle notify" — still call cycle_propose_notify
first (preview gate), then cycle_notify only after they confirm the preview
(or they say "skip preview" / "just notify" for that one write).

AFTER CONFIRM:
Call cycle_notify with the same oneliner/summary/tags. That writes a local log
under ~/.cycle-coded/ and may fire a macOS notification. Nothing leaves the machine.

Always prefer cycle_get for the live header before proposing.
`.trim();

const STATE_DIR = process.env.CYCLE_CODED_HOME || path.join(os.homedir(), ".cycle-coded");
const STATE_FILE = path.join(STATE_DIR, "state.json");

const DEFAULT_STATE = {
  lastPeriodStart: null, // YYYY-MM-DD
  avgCycleLength: 28,
  avgPeriodLength: 5,
  modes: {
    // eras / astro / moves — freeform flags
  },
  notes: [],
  updatedAt: null,
};

// Approximate phase windows as fractions of cycle (classic cycle-syncing meme calendar).
// Not clinical. Users can override by setting modes manually.
function phaseForDay(dayInCycle, cycleLen) {
  const p = dayInCycle / cycleLen;
  // Default period length ~5 days absolute
  if (dayInCycle <= 5) return { phase: "menstrual", energy: "bare minimum" };
  if (p < 0.45) return { phase: "follicular", energy: "building" };
  if (p < 0.55) return { phase: "ovulatory", energy: "post it" };
  return { phase: "luteal", energy: "ruthless" };
}

function parseDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function todayUTC() {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
}

function daysBetween(a, b) {
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}

export function computeCycle(state, now = todayUTC()) {
  const start = parseDate(state.lastPeriodStart);
  if (!start) {
    return {
      configured: false,
      phase: null,
      dayInCycle: null,
      cycleLength: state.avgCycleLength || 28,
      confidence: "none",
      message: "No period start set. Use cycle_set_period or say your phase explicitly.",
    };
  }
  const cycleLen = Math.max(21, Math.min(45, state.avgCycleLength || 28));
  let dayInCycle = (daysBetween(start, now) % cycleLen) + 1;
  if (dayInCycle <= 0) dayInCycle = 1;
  // If start is in the future, flag low confidence
  const future = daysBetween(start, now) < 0;
  const ageDays = daysBetween(start, now);
  const confidence =
    future ? "low" : ageDays > cycleLen * 3 ? "medium" : "high";
  const { phase, energy } = phaseForDay(dayInCycle, cycleLen);
  return {
    configured: true,
    phase,
    energy,
    dayInCycle,
    cycleLength: cycleLen,
    confidence: future ? "low" : confidence,
    lastPeriodStart: state.lastPeriodStart,
  };
}

export function buildHeader(state, cycle) {
  const parts = [];
  if (cycle?.configured && cycle.phase) {
    parts.push(`${cycle.phase} · day ${cycle.dayInCycle} · ${cycle.energy}`);
  }
  const modes = state.modes || {};
  for (const [k, v] of Object.entries(modes)) {
    if (!v) continue;
    const label = k.replace(/-/g, " ");
    parts.push(label);
  }
  if (parts.length === 0) return "cycle-coded · neutral · be so fr";
  return parts.join(" · ");
}

function loadState() {
  try {
    if (!fs.existsSync(STATE_FILE)) return { ...DEFAULT_STATE, modes: {} };
    const raw = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
    return {
      ...DEFAULT_STATE,
      ...raw,
      modes: { ...(raw.modes || {}) },
    };
  } catch {
    return { ...DEFAULT_STATE, modes: {} };
  }
}

function saveState(state) {
  fs.mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n", {
    mode: 0o600,
  });
}

const TOOLS = [
  {
    name: "cycle_set_period",
    description:
      "Set last period start date (YYYY-MM-DD) and optional average cycle length. Local only. Used to estimate phase for output policy — not medical advice.",
    inputSchema: {
      type: "object",
      properties: {
        last_period_start: {
          type: "string",
          description: "YYYY-MM-DD of first day of last period",
        },
        avg_cycle_length: {
          type: "number",
          description: "Average cycle length in days (default 28)",
        },
        avg_period_length: {
          type: "number",
          description: "Average period length in days (default 5)",
        },
      },
      required: ["last_period_start"],
    },
  },
  {
    name: "cycle_get",
    description:
      "Get current estimated phase, day in cycle, confidence, active modes, and mode header string.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "cycle_set_mode",
    description:
      "Enable or disable named modes: mercury-retrograde, full-moon, new-moon, building-era, villain-era, soft-life, protect-your-peace, pms, walkthrough, girl-math, be-so-fr, or any custom slug.",
    inputSchema: {
      type: "object",
      properties: {
        mode: { type: "string" },
        enabled: { type: "boolean" },
      },
      required: ["mode", "enabled"],
    },
  },
  {
    name: "cycle_header",
    description: "Return only the mode header line for the agent to prefix replies.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "cycle_clear",
    description: "Wipe all local cycle-coded state.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "cycle_propose_notify",
    description:
      "PREVIEW GATE (Router-style). Build a notification preview from the thread. " +
      "Show the returned preview to the user and ask 'Notify cycle-coded?'. " +
      "Do NOT write anything. Call cycle_notify only after explicit user confirmation.",
    inputSchema: {
      type: "object",
      properties: {
        oneliner: {
          type: "string",
          description: "≤20 char headline (e.g. 'Luteal cut', 'Demo energy')",
        },
        summary: {
          type: "string",
          description: "2–3 sentence summary of the noteworthy moment",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "1–5 tags (e.g. ovulatory, ship, demo)",
        },
        suggested_mode: {
          type: "string",
          description: "Optional mode slug to enable if user confirms",
        },
        kind: {
          type: "string",
          description: "phase-shift | ship | session-wrap | decision | other",
        },
      },
      required: ["oneliner", "summary"],
    },
  },
  {
    name: "cycle_notify",
    description:
      "AFTER USER CONFIRMS a cycle_propose_notify preview: append a local notification " +
      "and optionally fire a macOS Notification Center banner. Local only — no network. " +
      "Never call this without prior user confirmation unless preview_mode is never.",
    inputSchema: {
      type: "object",
      properties: {
        oneliner: { type: "string" },
        summary: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
        suggested_mode: { type: "string" },
        kind: { type: "string" },
        macos_banner: {
          type: "boolean",
          description: "Override prefs: show macOS banner (default true on darwin)",
        },
        confirmed: {
          type: "boolean",
          description: "Must be true — agent affirms user confirmed the preview",
        },
      },
      required: ["oneliner", "summary", "confirmed"],
    },
  },
  {
    name: "cycle_notify_list",
    description: "List recent local cycle-coded notifications (newest first).",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max rows (default 10)" },
      },
    },
  },
];

function toolResult(obj) {
  return {
    content: [{ type: "text", text: JSON.stringify(obj, null, 2) }],
  };
}

function handleTool(name, args = {}) {
  let state = loadState();

  if (name === "cycle_set_period") {
    const iso = args.last_period_start;
    if (!parseDate(iso)) {
      return toolResult({
        ok: false,
        error: "last_period_start must be YYYY-MM-DD",
      });
    }
    state.lastPeriodStart = iso;
    if (args.avg_cycle_length) state.avgCycleLength = Number(args.avg_cycle_length);
    if (args.avg_period_length) state.avgPeriodLength = Number(args.avg_period_length);
    saveState(state);
    const cycle = computeCycle(state);
    return toolResult({
      ok: true,
      privacy: "stored only in " + STATE_FILE,
      cycle,
      header: buildHeader(state, cycle),
      disclaimer: "Output policy only. Not medical advice.",
    });
  }

  if (name === "cycle_get") {
    const cycle = computeCycle(state);
    return toolResult({
      ok: true,
      cycle,
      modes: state.modes,
      header: buildHeader(state, cycle),
      statePath: STATE_FILE,
      disclaimer: "Output policy only. Not medical advice.",
    });
  }

  if (name === "cycle_set_mode") {
    const mode = String(args.mode || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
    if (!mode) return toolResult({ ok: false, error: "mode required" });
    if (args.enabled) state.modes[mode] = true;
    else delete state.modes[mode];
    saveState(state);
    const cycle = computeCycle(state);
    return toolResult({
      ok: true,
      modes: state.modes,
      header: buildHeader(state, cycle),
    });
  }

  if (name === "cycle_header") {
    const cycle = computeCycle(state);
    return toolResult({ header: buildHeader(state, cycle), cycle });
  }

  if (name === "cycle_clear") {
    try {
      if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE);
    } catch {
      /* ignore */
    }
    return toolResult({ ok: true, cleared: true, path: STATE_FILE });
  }

  if (name === "cycle_propose_notify") {
    const cycle = computeCycle(state);
    const header = buildHeader(state, cycle);
    const prefs = loadNotifyPrefs();
    const oneliner = String(args.oneliner || "").slice(0, 40);
    const summary = String(args.summary || "");
    const tags = Array.isArray(args.tags) ? args.tags.slice(0, 5) : [];
    const suggested_mode = args.suggested_mode
      ? String(args.suggested_mode).trim().toLowerCase().replace(/\s+/g, "-")
      : null;
    const kind = args.kind || "other";
    const preview = formatPreview({
      oneliner,
      summary,
      tags,
      header,
      suggested_mode,
      kind,
    });
    return toolResult({
      ok: true,
      status: "awaiting_confirmation",
      notify_mode: prefs.notify_mode,
      preview_mode: prefs.preview_mode,
      preview,
      draft: { oneliner, summary, tags, suggested_mode, kind, header },
      agent_instruction:
        "Show `preview` to the user and ask 'Notify cycle-coded?'. " +
        "Only call cycle_notify after explicit yes. Do not write yet.",
    });
  }

  if (name === "cycle_notify") {
    if (args.confirmed !== true) {
      return toolResult({
        ok: false,
        error: "confirmed must be true. Use cycle_propose_notify first and wait for the user.",
      });
    }
    const cycle = computeCycle(state);
    const header = buildHeader(state, cycle);
    const prefs = loadNotifyPrefs();
    const oneliner = String(args.oneliner || "").slice(0, 40);
    const summary = String(args.summary || "");
    const tags = Array.isArray(args.tags) ? args.tags.slice(0, 5) : [];
    const suggested_mode = args.suggested_mode
      ? String(args.suggested_mode).trim().toLowerCase().replace(/\s+/g, "-")
      : null;
    const kind = args.kind || "other";

    if (suggested_mode) {
      state.modes = state.modes || {};
      state.modes[suggested_mode] = true;
      saveState(state);
    }

    const entry = appendNotification({
      oneliner,
      summary,
      tags,
      kind,
      suggested_mode,
      header: buildHeader(loadState(), computeCycle(loadState())),
      phase: cycle.phase,
      dayInCycle: cycle.dayInCycle,
    });

    const wantBanner =
      args.macos_banner !== undefined ? Boolean(args.macos_banner) : prefs.macos_banner;
    let banner = { ok: false, skipped: true };
    if (wantBanner) {
      banner = fireMacOSNotification({
        title: "cycle-coded",
        subtitle: oneliner || header,
        body: summary.slice(0, 180),
      });
    }

    return toolResult({
      ok: true,
      status: "logged",
      entry,
      macos_banner: banner,
      header: buildHeader(loadState(), computeCycle(loadState())),
      privacy: "local only under ~/.cycle-coded/",
      agent_instruction: "Tell the user notification was logged (+ banner if ok). Show oneliner + id.",
    });
  }

  if (name === "cycle_notify_list") {
    const limit = Math.min(50, Math.max(1, Number(args.limit) || 10));
    return toolResult({
      ok: true,
      prefs: loadNotifyPrefs(),
      notifications: listNotifications(limit),
    });
  }

  return toolResult({ ok: false, error: `unknown tool: ${name}` });
}

// --- minimal MCP stdio ---

function send(msg) {
  const body = JSON.stringify(msg);
  process.stdout.write(`Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n\r\n${body}`);
}

// Also accept newline-delimited JSON (some hosts use that)
function handleMessage(msg) {
  if (!msg || typeof msg !== "object") return;

  if (msg.method === "initialize") {
    send({
      jsonrpc: "2.0",
      id: msg.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "cycle-coded", version: "0.2.0" },
        instructions: CYCLE_MCP_INSTRUCTIONS,
      },
    });
    return;
  }

  if (msg.method === "notifications/initialized" || msg.method === "initialized") {
    return;
  }

  if (msg.method === "tools/list") {
    send({
      jsonrpc: "2.0",
      id: msg.id,
      result: { tools: TOOLS },
    });
    return;
  }

  if (msg.method === "tools/call") {
    const name = msg.params?.name;
    const args = msg.params?.arguments || {};
    try {
      const result = handleTool(name, args);
      send({ jsonrpc: "2.0", id: msg.id, result });
    } catch (e) {
      send({
        jsonrpc: "2.0",
        id: msg.id,
        error: { code: -32000, message: String(e?.message || e) },
      });
    }
    return;
  }

  if (msg.method === "ping") {
    send({ jsonrpc: "2.0", id: msg.id, result: {} });
    return;
  }

  if (msg.id !== undefined) {
    send({
      jsonrpc: "2.0",
      id: msg.id,
      error: { code: -32601, message: `Method not found: ${msg.method}` },
    });
  }
}

// CLI helpers: node server.mjs get | clear | set 2026-07-01 28
const cli = process.argv[2];
// CLI works without a TTY (scripts/automation). MCP stdio starts only when no CLI verb.
if (cli && !cli.startsWith("-")) {
  const pretty = Boolean(process.stdout.isTTY) && process.env.CYCLE_CODED_JSON !== "1";

  if (cli === "help" || cli === "--help" || cli === "-h") {
    printHelp();
    process.exit(0);
  }

  if (cli === "get") {
    const state = loadState();
    const cycle = computeCycle(state);
    const header = buildHeader(state, cycle);
    const payload = { cycle, modes: state.modes, header, statePath: STATE_FILE };
    if (pretty) {
      printStatus({
        header,
        cycle,
        modes: state.modes,
        statePath: STATE_FILE,
      });
      // still print compact header on stdout for copy-paste
      console.log(header);
    } else {
      console.log(JSON.stringify(payload, null, 2));
    }
    process.exit(0);
  }

  if (cli === "clear") {
    const result = handleTool("cycle_clear");
    if (pretty) {
      printCleared();
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    process.exit(0);
  }

  if (cli === "set" && process.argv[3]) {
    handleTool("cycle_set_period", {
      last_period_start: process.argv[3],
      avg_cycle_length: process.argv[4] ? Number(process.argv[4]) : 28,
    });
    const state = loadState();
    const cycle = computeCycle(state);
    const header = buildHeader(state, cycle);
    if (pretty) {
      printStatus({ header, cycle, modes: state.modes, statePath: STATE_FILE });
      console.log(header);
    } else {
      console.log(
        JSON.stringify({ ok: true, cycle, modes: state.modes, header }, null, 2)
      );
    }
    process.exit(0);
  }

  if (cli === "banner") {
    const state = loadState();
    const cycle = computeCycle(state);
    printStatus({
      header: buildHeader(state, cycle),
      cycle,
      modes: state.modes,
      statePath: STATE_FILE,
    });
    process.exit(0);
  }

  if (cli === "test-phase") {
    const s = { ...DEFAULT_STATE, lastPeriodStart: "2026-07-01", avgCycleLength: 28, modes: {} };
    console.log(computeCycle(s, parseDate("2026-07-02")));
    console.log(computeCycle(s, parseDate("2026-07-10")));
    console.log(computeCycle(s, parseDate("2026-07-15")));
    console.log(computeCycle(s, parseDate("2026-07-25")));
    process.exit(0);
  }

  if (cli === "notify-test") {
    // End-to-end local test of Router-style preview → confirm → macOS banner
    const cycle = computeCycle(loadState());
    const header = buildHeader(loadState(), cycle);
    const draft = {
      oneliner: "Demo energy",
      summary:
        "Live dogfood: ovulatory/post-it mode — document before/after and ship the install one-liner. Local Health state only.",
      tags: ["ovulatory", "dogfood", "docs"],
      suggested_mode: "walkthrough",
      kind: "session-wrap",
    };
    const propose = handleTool("cycle_propose_notify", draft);
    const proposeBody = JSON.parse(propose.content[0].text);
    console.error("\n=== STEP 1: propose (no write) ===\n");
    console.error(proposeBody.preview);
    console.error("\n=== STEP 2: simulate user YES → cycle_notify ===\n");
    const done = handleTool("cycle_notify", {
      ...draft,
      confirmed: true,
      macos_banner: true,
    });
    console.log(done.content[0].text);
    console.error("\n=== STEP 3: list ===\n");
    console.log(JSON.parse(handleTool("cycle_notify_list", { limit: 3 }).content[0].text));
    process.exit(0);
  }

  if (cli === "notify-list") {
    console.log(JSON.stringify(JSON.parse(handleTool("cycle_notify_list", { limit: 15 }).content[0].text), null, 2));
    process.exit(0);
  }

  console.error(`unknown command: ${cli}`);
  printHelp();
  process.exit(1);
}

// Stdio MCP only when this file is the entrypoint (not when imported by tests)
const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain && !cli) {
  let buffer = Buffer.alloc(0);

  process.stdin.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    while (true) {
      const headerEnd = buffer.indexOf("\r\n\r\n");
      if (headerEnd !== -1) {
        const header = buffer.slice(0, headerEnd).toString("utf8");
        const match = /Content-Length:\s*(\d+)/i.exec(header);
        if (match) {
          const len = parseInt(match[1], 10);
          const total = headerEnd + 4 + len;
          if (buffer.length < total) break;
          const body = buffer.slice(headerEnd + 4, total).toString("utf8");
          buffer = buffer.slice(total);
          try {
            handleMessage(JSON.parse(body));
          } catch {
            /* ignore */
          }
          continue;
        }
      }

      const nl = buffer.indexOf("\n");
      if (nl === -1) break;
      const line = buffer.slice(0, nl).toString("utf8").trim();
      buffer = buffer.slice(nl + 1);
      if (!line || line.startsWith("Content-Length")) continue;
      try {
        handleMessage(JSON.parse(line));
      } catch {
        /* ignore */
      }
    }
  });

  process.stdin.on("end", () => process.exit(0));
}
