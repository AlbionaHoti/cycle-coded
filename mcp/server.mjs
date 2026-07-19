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
 *
 * Not medical advice. Phase is a calendar estimate for output policy only.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

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
        serverInfo: { name: "cycle-coded", version: "0.1.0" },
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
  if (cli === "get") {
    const state = loadState();
    const cycle = computeCycle(state);
    console.log(JSON.stringify({ cycle, modes: state.modes, header: buildHeader(state, cycle) }, null, 2));
    process.exit(0);
  }
  if (cli === "clear") {
    console.log(JSON.stringify(handleTool("cycle_clear"), null, 2));
    process.exit(0);
  }
  if (cli === "set" && process.argv[3]) {
    console.log(
      JSON.stringify(
        handleTool("cycle_set_period", {
          last_period_start: process.argv[3],
          avg_cycle_length: process.argv[4] ? Number(process.argv[4]) : 28,
        }),
        null,
        2
      )
    );
    process.exit(0);
  }
  if (cli === "test-phase") {
    // quick self-check without full test runner
    const s = { ...DEFAULT_STATE, lastPeriodStart: "2026-07-01", avgCycleLength: 28, modes: {} };
    console.log(computeCycle(s, parseDate("2026-07-02")));
    console.log(computeCycle(s, parseDate("2026-07-10")));
    console.log(computeCycle(s, parseDate("2026-07-15")));
    console.log(computeCycle(s, parseDate("2026-07-25")));
    process.exit(0);
  }
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
