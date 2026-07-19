/**
 * Terminal presentation for cycle-coded CLI.
 *
 * Visual language inspired by classic density-mapped moon ASCII
 * (e.g. public moon-phase CLI art traditions — original plates below,
 * not copied from any repo) and clean product CLIs (figlet wordmarks,
 * boxed status panels).
 *
 * Art is original for cycle-coded. No third-party art files vendored.
 * Human-facing only — keep machine JSON on stdout when not a TTY.
 */

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

// Soft product palette (256-color; falls back clean with NO_COLOR)
const PINK = "\x1b[38;5;218m";
const ROSE = "\x1b[38;5;204m";
const PLUM = "\x1b[38;5;176m";
const INK = "\x1b[38;5;255m";
const MUTED = "\x1b[38;5;245m";
const SLATE = "\x1b[38;5;240m";
const GOLD = "\x1b[38;5;222m";
const MINT = "\x1b[38;5;151m";
const STEEL = "\x1b[38;5;110m";
const ASH = "\x1b[38;5;250m";

function colorEnabled() {
  return (
    Boolean(process.stderr.isTTY || process.stdout.isTTY) &&
    !process.env.NO_COLOR &&
    process.env.TERM !== "dumb"
  );
}

function c(code, s) {
  if (!colorEnabled()) return s;
  return `${code}${s}${RESET}`;
}

function stripAnsi(s) {
  return String(s).replace(/\x1b\[[0-9;]*m/g, "");
}

function padVisible(s, width) {
  const n = stripAnsi(s).length;
  return s + " ".repeat(Math.max(0, width - n));
}

/** Compact professional wordmark (not cartoon) */
export function wordmark() {
  // Big mark is CYCLE only — "coded" lives in the package name, not the banner.
  const logo = [
    " ██████╗██╗   ██╗ ██████╗██╗     ███████╗",
    "██╔════╝╚██╗ ██╔╝██╔════╝██║     ██╔════╝",
    "██║      ╚████╔╝ ██║     ██║     █████╗  ",
    "██║       ╚██╔╝  ██║     ██║     ██╔══╝  ",
    "╚██████╗   ██║   ╚██████╗███████╗███████╗",
    " ╚═════╝   ╚═╝    ╚═════╝╚══════╝╚══════╝",
  ];
  return [
    ...logo.map((l) => c(ROSE, l)),
    c(SLATE, "  agent modes  ·  local only"),
  ].join("\n");
}

/**
 * Density moons — classic @#%:·. plate language.
 * Mapped to cycle energy, not lunar calendar claims.
 */
const PLATES = {
  // menstrual — dark / bare minimum
  menstrual: {
    color: ASH,
    label: "BARE MINIMUM",
    art: [
      "            .·····.        ",
      "         .··········.      ",
      "       .··············.    ",
      "      ··················   ",
      "      ··················   ",
      "       ················    ",
      "         ············      ",
      "            ······         ",
    ],
  },
  // follicular — waxing light / building
  follicular: {
    color: MINT,
    label: "BUILDING",
    art: [
      "            .····#@        ",
      "         .·······###@      ",
      "       .·········####@     ",
      "      ···········#####@    ",
      "      ···········#####@    ",
      "       ··········####@     ",
      "         ········###@      ",
      "            ·····#@        ",
    ],
  },
  // ovulatory — full / post it
  ovulatory: {
    color: GOLD,
    label: "POST IT",
    art: [
      "            @@@@@@@@       ",
      "         @@@@@@@@@@@@@@    ",
      "       @@@@@@@@@@@@@@@@@@  ",
      "      @@@@@@@@@@@@@@@@@@@@ ",
      "      @@@@@@@@@@@@@@@@@@@@ ",
      "       @@@@@@@@@@@@@@@@@@  ",
      "         @@@@@@@@@@@@@@    ",
      "            @@@@@@@@       ",
    ],
  },
  // luteal — waning hard light / ruthless
  luteal: {
    color: STEEL,
    label: "RUTHLESS",
    art: [
      "            @@#···.        ",
      "         @@@##······.      ",
      "       @@@@##········.     ",
      "      @@@@@##·········.    ",
      "      @@@@@##·········.    ",
      "       @@@@##········.     ",
      "         @@@##······.      ",
      "            @@#···.        ",
    ],
  },
  // default / import / unknown
  default: {
    color: PLUM,
    label: "CYCLE",
    art: [
      "            ··##@@··       ",
      "         ··###@@@@###·     ",
      "       ·###@@@@@@@@###·    ",
      "      ·##@@@@@@@@@@@@##·   ",
      "      ·##@@@@@@@@@@@@##·   ",
      "       ·###@@@@@@@@###·    ",
      "         ··###@@@@###·     ",
      "            ··##@@··       ",
    ],
  },
};

export function phaseArt(phase) {
  const plate = PLATES[phase] || PLATES.default;
  const lines = plate.art.map((l) => c(plate.color, l));
  const tag = c(DIM + MUTED, `  ${plate.label}`);
  return lines.join("\n") + "\n" + tag;
}

/** Day-in-cycle progress (editorial, not medical) */
export function progressBar(day, total, width = 22) {
  if (!day || !total || total < 1) {
    return c(SLATE, "[" + "·".repeat(width) + "]");
  }
  const d = Math.max(1, Math.min(total, Number(day)));
  const filled = Math.round((d / total) * width);
  const bar =
    "█".repeat(Math.max(0, filled)) + "░".repeat(Math.max(0, width - filled));
  return (
    c(ROSE, "[") +
    c(PINK, bar.slice(0, filled)) +
    c(SLATE, bar.slice(filled)) +
    c(ROSE, "]") +
    c(MUTED, `  ${d}/${total}`)
  );
}

export function box(rows) {
  const width = Math.max(...rows.map((l) => stripAnsi(l).length), 36);
  const top = c(SLATE, "╭" + "─".repeat(width + 2) + "╮");
  const bot = c(SLATE, "╰" + "─".repeat(width + 2) + "╯");
  const mid = rows.map((l) => {
    return (
      c(SLATE, "│") +
      " " +
      padVisible(l, width) +
      " " +
      c(SLATE, "│")
    );
  });
  return [top, ...mid, bot].join("\n");
}

/**
 * Pretty status for get / set.
 * stderr so stdout can stay pipe-friendly.
 */
export function printStatus({ header, cycle, modes, statePath, extraLines = [] }) {
  const out = process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(phaseArt(cycle?.phase) + "\n\n");

  const lines = [];
  if (header) {
    lines.push(c(BOLD + INK, header));
  }
  if (cycle?.configured) {
    lines.push(
      progressBar(cycle.dayInCycle, cycle.cycleLength) +
        c(MUTED, `  ·  ${cycle.confidence || "—"}`)
    );
    if (cycle.lastPeriodStart) {
      lines.push(c(MUTED, `anchor   ${cycle.lastPeriodStart}`));
    }
    if (cycle.energy) {
      lines.push(c(MUTED, `energy   ${cycle.energy}`));
    }
  } else {
    lines.push(c(MUTED, "no anchor set — import Health or: set YYYY-MM-DD"));
  }

  const modeKeys = Object.keys(modes || {}).filter((k) => modes[k]);
  if (modeKeys.length) {
    lines.push(c(PLUM, "modes    " + modeKeys.join(" · ")));
  }
  for (const e of extraLines) lines.push(c(MUTED, e));
  if (statePath) lines.push(c(DIM + SLATE, statePath));

  out.write(box(lines) + "\n");
  out.write(
    c(DIM + MUTED, "  not medical advice  ·  data never leaves this machine") +
      "\n\n"
  );
}

export function printImportDone({ periodCount, lastStart, avg, statePath }) {
  const out = process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(phaseArt("default") + "\n\n");
  out.write(
    box([
      c(BOLD + INK, "import complete"),
      c(MUTED, `${periodCount} cycles read  ·  avg length ${avg}d`),
      c(MUTED, `latest anchor   ${lastStart}`),
      c(DIM + SLATE, statePath || ""),
    ]) + "\n"
  );
  out.write(c(DIM + MUTED, "  local only  ·  not medical advice") + "\n");
}

export function printCleared() {
  const out = process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(
    box([
      c(BOLD + INK, "state cleared"),
      c(MUTED, "re-import Health or: set YYYY-MM-DD"),
    ]) + "\n\n"
  );
}

export function printHelp() {
  const out = process.stdout.isTTY ? process.stdout : process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(c(BOLD + INK, "  commands") + "\n");
  out.write(c(MUTED, "    get                 show mode + art") + "\n");
  out.write(c(MUTED, "    set YYYY-MM-DD [n]  set last period start") + "\n");
  out.write(c(MUTED, "    clear               wipe local state") + "\n");
  out.write(c(MUTED, "    banner              art only") + "\n");
  out.write(c(MUTED, "    help") + "\n\n");
  out.write(c(BOLD + INK, "  import") + "\n");
  out.write(c(MUTED, "    node import-health.mjs path/to/export.xml") + "\n");
  out.write(c(MUTED, "    node import-health.mjs --csv periods.csv") + "\n\n");
  out.write(
    c(SLATE, "  TTY → art  ·  pipe/JSON → CYCLE_CODED_JSON=1") + "\n\n"
  );
}
