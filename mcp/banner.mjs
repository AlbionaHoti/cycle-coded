/**
 * Terminal ASCII art for cycle-coded CLI.
 * Human-facing only — keep machine JSON on stdout when not a TTY.
 */

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const PINK = "\x1b[38;5;218m";
const ROSE = "\x1b[38;5;204m";
const CREAM = "\x1b[38;5;255m";
const MUTED = "\x1b[38;5;246m";

function colorEnabled() {
  return Boolean(process.stderr.isTTY || process.stdout.isTTY) && !process.env.NO_COLOR;
}

function c(code, s) {
  if (!colorEnabled()) return s;
  return `${code}${s}${RESET}`;
}

/** Wordmark */
export function wordmark() {
  return [
    c(PINK, "   ╭──────────────────────────────────────╮"),
    c(PINK, "   │") +
      c(BOLD + CREAM, "   c y c l e - c o d e d   ") +
      c(ROSE, "✦") +
      c(PINK, "        │"),
    c(PINK, "   │") +
      c(MUTED, "   local · glossary · no cloud      ") +
      c(PINK, "│"),
    c(PINK, "   ╰──────────────────────────────────────╯"),
  ].join("\n");
}

const PHASE_ART = {
  menstrual: [
    "        ·  ·  ·",
    "     ·   low power   ·",
    "        bare min",
    "          ___",
    "         (   )",
    "          ‾‾‾",
  ],
  follicular: [
    "          *",
    "       *  |  *",
    "     *   /|\\   *",
    "        building",
    "         /   \\",
  ],
  ovulatory: [
    "       \\  ★  /",
    "        \\ | /",
    "      —  (•)  —",
    "        / | \\",
    "       /  post  \\",
  ],
  luteal: [
    "        ╱╲",
    "       ╱  ╲   ruthless",
    "      ╱_  _╲",
    "        ||",
    "       cut it",
  ],
  default: [
    "          ✦",
    "       ·  │  ·",
    "      ────┼────",
    "       ·  │  ·",
    "          ✦",
  ],
};

export function phaseArt(phase) {
  const lines = PHASE_ART[phase] || PHASE_ART.default;
  return lines.map((l) => c(ROSE, l)).join("\n");
}

export function box(lines) {
  const width = Math.max(...lines.map((l) => stripAnsi(l).length), 28);
  const top = c(PINK, "┌" + "─".repeat(width + 2) + "┐");
  const bot = c(PINK, "└" + "─".repeat(width + 2) + "┘");
  const mid = lines.map((l) => {
    const pad = width - stripAnsi(l).length;
    return (
      c(PINK, "│") +
      " " +
      l +
      " ".repeat(Math.max(0, pad)) +
      " " +
      c(PINK, "│")
    );
  });
  return [top, ...mid, bot].join("\n");
}

function stripAnsi(s) {
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}

/**
 * Pretty status for `get` / after import.
 * Writes to stderr so stdout can stay JSON for pipes.
 */
export function printStatus({ header, cycle, modes, statePath, extraLines = [] }) {
  const out = process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(phaseArt(cycle?.phase) + "\n\n");

  const lines = [];
  if (header) lines.push(c(BOLD + CREAM, header));
  if (cycle?.configured) {
    lines.push(c(MUTED, `day ${cycle.dayInCycle} / ${cycle.cycleLength}  ·  ${cycle.confidence} confidence`));
    if (cycle.lastPeriodStart) {
      lines.push(c(MUTED, `last start  ${cycle.lastPeriodStart}`));
    }
  } else {
    lines.push(c(MUTED, "no period start set — say a mode or: set YYYY-MM-DD"));
  }
  const modeKeys = Object.keys(modes || {}).filter((k) => modes[k]);
  if (modeKeys.length) {
    lines.push(c(MUTED, "modes  " + modeKeys.join(", ")));
  }
  for (const e of extraLines) lines.push(c(MUTED, e));
  if (statePath) lines.push(c(DIM, statePath));

  out.write(box(lines) + "\n");
  out.write(c(MUTED, "  not medical advice · data stays on this machine") + "\n\n");
}

export function printImportDone({ periodCount, lastStart, avg, statePath }) {
  const out = process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(phaseArt("default") + "\n\n");
  out.write(
    box([
      c(BOLD + CREAM, "import complete ✦"),
      c(MUTED, `${periodCount} periods  ·  avg ${avg}d`),
      c(MUTED, `last start  ${lastStart}`),
      c(DIM, statePath || ""),
    ]) + "\n"
  );
  out.write(c(MUTED, "  local only · not medical advice") + "\n");
}

export function printCleared() {
  const out = process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(c(MUTED, "   state wiped · ~/.cycle-coded gone") + "\n");
  out.write(c(MUTED, "   re-import or: set YYYY-MM-DD") + "\n\n");
}

export function printHelp() {
  const out = process.stdout.isTTY ? process.stdout : process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(`  ${c(BOLD, "usage")}\n`);
  out.write(`    node server.mjs get\n`);
  out.write(`    node server.mjs set YYYY-MM-DD [avgLength]\n`);
  out.write(`    node server.mjs clear\n`);
  out.write(`    node import-health.mjs path/to/export.xml\n`);
  out.write(`    node import-health.mjs --csv periods.csv\n\n`);
  out.write(`  ${c(MUTED, "pretty art when terminal is interactive; JSON on stdout for pipes")}\n\n`);
}
