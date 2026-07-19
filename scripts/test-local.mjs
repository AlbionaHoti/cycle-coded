#!/usr/bin/env node
/**
 * Dogfood cycle-coded against LOCAL state only (~/.cycle-coded).
 * Prints paste packs for every major chat surface.
 * Never uploads. Never writes into the git repo.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Load compute from mcp without starting stdio server long-term
const serverPath = path.join(ROOT, "mcp/server.mjs");
// Import may start nothing when used as module if CLI not set — load via dynamic import
const { computeCycle, buildHeader } = await import(pathToFileURL(serverPath).href);

const STATE_FILE =
  process.env.CYCLE_CODED_HOME
    ? path.join(process.env.CYCLE_CODED_HOME, "state.json")
    : path.join(os.homedir(), ".cycle-coded", "state.json");

function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    return { lastPeriodStart: null, avgCycleLength: 28, modes: {} };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

function loadGlossary(phase) {
  const file = path.join(ROOT, "glossary", `${phase}.md`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}

const state = loadState();
const cycle = computeCycle(state);
const header = buildHeader(state, cycle);
const glossary = cycle.phase ? loadGlossary(cycle.phase) : null;

const sampleQ =
  "My auth middleware returns 401 on refresh. Should I rewrite session handling or ship a small fix?";

console.log(`
╔══════════════════════════════════════════════════════════╗
║  cycle-coded · local dogfood                             ║
║  state: ${STATE_FILE.slice(0, 48).padEnd(48)}║
╚══════════════════════════════════════════════════════════╝
`);

console.log("YOUR LIVE MODE (from Apple Health import / local state)");
console.log("────────────────────────────────────────────────────────");
console.log(header);
console.log(
  cycle.configured
    ? `phase=${cycle.phase}  day=${cycle.dayInCycle}/${cycle.cycleLength}  confidence=${cycle.confidence}`
    : "not configured — run: node mcp/import-health.mjs …"
);
console.log("");

// Simulated policy check
const policyOk = Boolean(glossary && glossary.includes("## Rules"));
console.log("GLOSSARY LOAD");
console.log("────────────────────────────────────────────────────────");
console.log(
  policyOk
    ? `✓ glossary/${cycle.phase}.md loaded (${glossary.split("\n").length} lines)`
    : "✗ no glossary for phase"
);
console.log("");

console.log("SAMPLE REPLY SHAPE (what agents should do)");
console.log("────────────────────────────────────────────────────────");
if (cycle.phase === "follicular") {
  console.log(`${header}
Ship a 40-line guard first, then optional spike.

**Ambitious:** extract SessionStore + one test (90 min max)
**Safe:** early-return on missing session cookie only
**Kill criteria:** if spike > 2h, merge the guard and stop.

Next: open the middleware file and paste the 401 stack.`);
} else if (cycle.phase === "luteal") {
  console.log(`${header}
Don't redesign. Ship the small fix.

1. Find the null/missing cookie path
2. Early-return 401 → /login cleanly
3. One test for expired session

Rewrite is ego until this is green.
Next: paste the failing test name.`);
} else if (cycle.phase === "menstrual") {
  console.log(`${header}
One fix only: guard the missing session and return.

1. Patch that path
2. Run the single auth test

Enough for today if you want.`);
} else if (cycle.phase === "ovulatory") {
  console.log(`${header}
Login stays calm on refresh — no scary 401 bounce.

1. Reproduce: stay logged in 10 min
2. Ship the silent refresh guard
3. Screenshot the “still in” state

Share: fixed the bug that made auth feel broken when it wasn't.`);
} else {
  console.log(`${header}
Lead with the next action. Number steps. No fluff.`);
}
console.log("");

const universal = fs.readFileSync(
  path.join(ROOT, "instructions/UNIVERSAL.md"),
  "utf8"
);

const pasteSession = `Use cycle-coded mode.

My live header (from local CLI only — do not invent dates):
${header}

Question: ${sampleQ}
`;

const targets = [
  {
    name: "Claude Code",
    how: "plugin install OR ~/.claude/skills/cycle-coded · then /cycle-coded",
  },
  {
    name: "Codex (ChatGPT)",
    how: "plugin OR ~/.agents/skills/cycle-coded · $cycle-coded",
  },
  {
    name: "ChatGPT (web)",
    how: "Custom instructions / Project instructions ← UNIVERSAL.md + paste header",
  },
  {
    name: "Gemini (app / CLI)",
    how: "GEMINI.md in project OR paste UNIVERSAL.md + header",
  },
  {
    name: "Grok",
    how: "Custom instructions / paste UNIVERSAL.md + header each session",
  },
  {
    name: "Cursor",
    how: ".cursor/rules/cycle-coded.mdc · @ cycle-coded",
  },
  {
    name: "Any agent (skills.sh)",
    how: "npx skills add AlbionaHoti/cycle-coded --skill cycle-coded",
  },
];

console.log("WHERE TO TEST (same rules everywhere)");
console.log("────────────────────────────────────────────────────────");
for (const t of targets) {
  console.log(`• ${t.name}`);
  console.log(`  ${t.how}`);
}
console.log("");

console.log("PASTE PACK — session kickoff (all web UIs)");
console.log("────────────────────────────────────────────────────────");
console.log(pasteSession);

// Write paste packs only under /tmp — never the repo
const outDir = path.join(os.tmpdir(), "cycle-coded-dogfood");
fs.mkdirSync(outDir, { recursive: true, mode: 0o700 });
fs.writeFileSync(path.join(outDir, "HEADER.txt"), header + "\n", { mode: 0o600 });
fs.writeFileSync(path.join(outDir, "SESSION_PASTE.txt"), pasteSession, {
  mode: 0o600,
});
fs.writeFileSync(path.join(outDir, "UNIVERSAL.md"), universal, { mode: 0o600 });
fs.writeFileSync(
  path.join(outDir, "CUSTOM_INSTRUCTIONS.md"),
  universal +
    `\n\n---\n\n## My current mode (update from local CLI)\n\n${header}\n`,
  { mode: 0o600 }
);

console.log("WROTE LOCAL PASTE FILES (not in git)");
console.log("────────────────────────────────────────────────────────");
console.log(outDir);
console.log("  HEADER.txt");
console.log("  SESSION_PASTE.txt");
console.log("  UNIVERSAL.md");
console.log("  CUSTOM_INSTRUCTIONS.md  ← ChatGPT / Gemini / Grok custom instructions");
console.log("");
console.log("Privacy: nothing left this machine.");
