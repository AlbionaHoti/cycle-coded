#!/usr/bin/env node
/**
 * Local import of cycle data into ~/.cycle-coded/state.json
 *
 * Supports:
 *   - Apple Health export.xml (HKCategoryTypeIdentifierMenstrualFlow)
 *   - Simple CSV with period_start column
 *
 * LOCAL ONLY — does not open network connections or upload files.
 * Writes only to ~/.cycle-coded/ (or CYCLE_CODED_HOME). Not medical advice.
 *
 * Usage:
 *   node import-health.mjs path/to/export.xml
 *   node import-health.mjs --csv periods.csv
 *   node import-health.mjs --dry-run path/to/export.xml
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import { createReadStream } from "node:fs";
import { pathToFileURL } from "node:url";
import { printImportDone, wordmark } from "./banner.mjs";

const STATE_DIR = process.env.CYCLE_CODED_HOME || path.join(os.homedir(), ".cycle-coded");
const STATE_FILE = path.join(STATE_DIR, "state.json");

const FLOW_TYPES = new Set([
  "HKCategoryTypeIdentifierMenstrualFlow",
  // Some exports use the shorter form in attributes
  "MenstrualFlow",
]);

function usage() {
  console.log(`Usage:
  node import-health.mjs <export.xml>
  node import-health.mjs --csv <periods.csv>
  node import-health.mjs --dry-run <export.xml>

CSV format:
  period_start
  2026-07-01
  2026-07-29
`);
}

function parseAppleDate(s) {
  // "2026-07-01 08:00:00 +0200" or ISO
  if (!s) return null;
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function dayNumber(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86400000;
}

function isoFromDayNumber(n) {
  const dt = new Date(n * 86400000);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Group consecutive flow days; first day of each streak = period start */
export function periodStartsFromFlowDays(flowDaysIso) {
  const uniq = [...new Set(flowDaysIso.filter(Boolean))].sort();
  if (uniq.length === 0) return [];
  const nums = uniq.map(dayNumber);
  const starts = [nums[0]];
  for (let i = 1; i < nums.length; i++) {
    // gap > 1 day ⇒ new period (allow 1-day gap for missed log)
    if (nums[i] - nums[i - 1] > 2) starts.push(nums[i]);
  }
  return starts.map(isoFromDayNumber);
}

export function averageCycleLength(startsIso) {
  if (!startsIso || startsIso.length < 2) return null;
  const nums = startsIso.map(dayNumber).sort((a, b) => a - b);
  const gaps = [];
  for (let i = 1; i < nums.length; i++) {
    const g = nums[i] - nums[i - 1];
    // ignore absurd gaps (missed logging / pregnancy / etc.)
    if (g >= 18 && g <= 45) gaps.push(g);
  }
  if (gaps.length === 0) return null;
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  return Math.round(avg);
}

export function reviewSummary(starts, avgLen) {
  const last = starts[starts.length - 1] || null;
  const prev = starts.length >= 2 ? starts[starts.length - 2] : null;
  let lastGap = null;
  if (last && prev) lastGap = dayNumber(last) - dayNumber(prev);
  return {
    periodCount: starts.length,
    lastPeriodStart: last,
    previousPeriodStart: prev,
    lastCycleLengthDays: lastGap,
    averageCycleLength: avgLen,
    recentStarts: starts.slice(-8),
  };
}

async function extractFlowDaysFromXml(xmlPath) {
  const days = [];
  const stream = createReadStream(xmlPath, { encoding: "utf8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let lineNo = 0;
  let hits = 0;
  for await (const line of rl) {
    lineNo++;
    if (lineNo % 500000 === 0) {
      process.stderr.write(`…scanned ${lineNo} lines, ${hits} flow samples\n`);
    }
    if (!line.includes("MenstrualFlow") && !line.includes("menstrualFlow")) {
      continue;
    }
    // Record type=...MenstrualFlow... startDate="..."
    if (!line.includes("HKCategoryTypeIdentifierMenstrualFlow") && !line.includes('type="HKCategoryTypeIdentifierMenstrualFlow"')) {
      // still allow looser match if type attr order differs
      if (!/type="[^"]*MenstrualFlow/.test(line)) continue;
    }
    const dm = line.match(/startDate="([^"]+)"/);
    const iso = parseAppleDate(dm?.[1]);
    if (iso) {
      days.push(iso);
      hits++;
    }
  }
  return { days, linesScanned: lineNo, samples: hits };
}

function extractStartsFromCsv(csvPath) {
  const text = fs.readFileSync(csvPath, "utf8");
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  const header = lines[0].toLowerCase();
  let startIdx = 0;
  let dataLines = lines;
  if (header.includes("period") || header.includes("start") || header.includes("date")) {
    const cols = lines[0].split(/[,;\t]/).map((c) => c.trim().toLowerCase());
    startIdx = cols.findIndex((c) => c.includes("start") || c === "date" || c === "period_start");
    if (startIdx < 0) startIdx = 0;
    dataLines = lines.slice(1);
  }
  const starts = [];
  for (const line of dataLines) {
    const cols = line.split(/[,;\t]/);
    const iso = parseAppleDate(cols[startIdx]?.trim() || cols[0]);
    if (iso) starts.push(iso);
  }
  return [...new Set(starts)].sort();
}

function loadState() {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      return {
        lastPeriodStart: null,
        avgCycleLength: 28,
        avgPeriodLength: 5,
        modes: {},
        notes: [],
        periodHistory: [],
        importMeta: null,
        updatedAt: null,
      };
    }
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return {
      lastPeriodStart: null,
      avgCycleLength: 28,
      modes: {},
      periodHistory: [],
    };
  }
}

function saveState(state) {
  fs.mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n", { mode: 0o600 });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    usage();
    process.exit(args.length === 0 ? 1 : 0);
  }

  const dryRun = args.includes("--dry-run");
  const csvIdx = args.indexOf("--csv");
  let starts = [];
  let source = null;
  let meta = {};

  if (csvIdx !== -1) {
    const csvPath = args[csvIdx + 1];
    if (!csvPath || !fs.existsSync(csvPath)) {
      console.error("CSV path missing or not found");
      process.exit(1);
    }
    starts = extractStartsFromCsv(csvPath);
    source = "csv";
    meta = { path: path.resolve(csvPath) };
  } else {
    const xmlPath = args.find((a) => !a.startsWith("--"));
    if (!xmlPath || !fs.existsSync(xmlPath)) {
      console.error("export.xml path missing or not found");
      usage();
      process.exit(1);
    }
    process.stderr.write(`Scanning ${xmlPath} (local only)…\n`);
    const { days, linesScanned, samples } = await extractFlowDaysFromXml(xmlPath);
    starts = periodStartsFromFlowDays(days);
    source = "apple-health-xml";
    meta = {
      path: path.resolve(xmlPath),
      linesScanned,
      flowSamples: samples,
      uniqueFlowDays: [...new Set(days)].length,
    };
  }

  const avg = averageCycleLength(starts) || 28;
  const summary = reviewSummary(starts, avg);

  const out = {
    ok: true,
    source,
    meta,
    summary,
    disclaimer: "Output policy only. Not medical advice. Data stayed on this machine.",
  };

  const pretty = Boolean(process.stderr.isTTY) && process.env.CYCLE_CODED_JSON !== "1";

  if (pretty) {
    process.stderr.write("\n" + wordmark() + "\n");
    process.stderr.write(
      dryRun ? "\n   dry-run · nothing written\n" : "\n   import · local only\n"
    );
  }

  // machine-readable on stdout (pipes / scripts)
  console.log(JSON.stringify(out, null, 2));

  if (starts.length === 0) {
    console.error("\nNo period starts found. See docs/EXPORTS.md");
    process.exit(2);
  }

  if (dryRun) {
    if (pretty) {
      process.stderr.write(
        `\n   would write ${summary.periodCount} periods · last ${summary.lastPeriodStart} · avg ${avg}d\n\n`
      );
    } else {
      console.error("\n--dry-run: state not written");
    }
    return;
  }

  const state = loadState();
  state.lastPeriodStart = summary.lastPeriodStart;
  state.avgCycleLength = avg;
  state.periodHistory = starts.slice(-24);
  state.importMeta = {
    source,
    importedAt: new Date().toISOString(),
    path: meta.path,
    periodCount: starts.length,
  };
  saveState(state);

  if (pretty) {
    printImportDone({
      periodCount: summary.periodCount,
      lastStart: summary.lastPeriodStart,
      avg,
      statePath: STATE_FILE,
    });
    process.stderr.write("   next: node server.mjs get\n\n");
  } else {
    console.error(`\nWrote ${STATE_FILE}`);
    console.error(`Header seed: last start ${state.lastPeriodStart}, avg ${state.avgCycleLength}d`);
    console.error(`Verify: node server.mjs get`);
  }
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
