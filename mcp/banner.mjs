/**
 * Terminal presentation for cycle-coded CLI — cute pink edition.
 * Density moons + soft palette. Original art. Local only.
 */

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

// Cute pink stack (256-color)
const BLUSH = "\x1b[38;5;225m"; // almost white-pink
const PINK = "\x1b[38;5;218m";
const ROSE = "\x1b[38;5;211m";
const HOT = "\x1b[38;5;205m";
const BERRY = "\x1b[38;5;198m";
const LILAC = "\x1b[38;5;183m";
const CREAM = "\x1b[38;5;255m";
const MUTED = "\x1b[38;5;250m";
const SOFT = "\x1b[38;5;247m";

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

/** Pink gradient across logo lines */
function gradientLine(line, i, total) {
  const shades = [BLUSH, PINK, ROSE, HOT, BERRY, HOT];
  const code = shades[Math.min(i, shades.length - 1)];
  return c(code, line);
}

export function wordmark() {
  const logo = [
    " ██████╗██╗   ██╗ ██████╗██╗     ███████╗",
    "██╔════╝╚██╗ ██╔╝██╔════╝██║     ██╔════╝",
    "██║      ╚████╔╝ ██║     ██║     █████╗  ",
    "██║       ╚██╔╝  ██║     ██║     ██╔══╝  ",
    "╚██████╗   ██║   ╚██████╗███████╗███████╗",
    " ╚═════╝   ╚═╝    ╚═════╝╚══════╝╚══════╝",
  ];
  return [
    c(PINK, "  ˚₊· ͟͟͞͞➳❥  cute modes for agents"),
    ...logo.map((l, i) => gradientLine(l, i, logo.length)),
    c(LILAC, "  ✦ local only") + c(SOFT, "  ·  no cloud  ·  ") + c(PINK, "♡"),
  ].join("\n");
}

/**
 * Soft pink density moons — still readable as phases, cuter colors.
 */
const PLATES = {
  menstrual: {
    color: MUTED,
    accent: PINK,
    label: "♡ bare minimum",
    sparkle: "  · soft day · rest ok ·",
    art: [
      "         ✦    .·····.     ✦  ",
      "            .··········.     ",
      "          .··············.   ",
      "         ··················  ",
      "         ··················  ",
      "          ················   ",
      "            ············     ",
      "         ˚    ······     ˚   ",
    ],
  },
  follicular: {
    color: PINK,
    accent: HOT,
    label: "♡ building",
    sparkle: "  · rising · say yes ·",
    art: [
      "         ˚    .····#@    ✦   ",
      "            .·······###@     ",
      "          .·········####@    ",
      "         ···········#####@   ",
      "         ···········#####@   ",
      "          ··········####@    ",
      "            ········###@     ",
      "         ✦    ·····#@    ˚   ",
    ],
  },
  ovulatory: {
    color: HOT,
    accent: BERRY,
    label: "♡ post it",
    sparkle: "  · main character · shiny ·",
    art: [
      "         ✦    @@@@@@@@   ✦   ",
      "            @@@@@@@@@@@@@@   ",
      "          @@@@@@@@@@@@@@@@@@ ",
      "         @@@@@@@@@@@@@@@@@@@@",
      "         @@@@@@@@@@@@@@@@@@@@",
      "          @@@@@@@@@@@@@@@@@@ ",
      "            @@@@@@@@@@@@@@   ",
      "         ˚    @@@@@@@@   ˚   ",
    ],
  },
  luteal: {
    color: LILAC,
    accent: ROSE,
    label: "♡ ruthless",
    sparkle: "  · cut the fluff · no yap ·",
    art: [
      "         ·    @@#···.    ✦   ",
      "            @@@##······.     ",
      "          @@@@##········.    ",
      "         @@@@@##·········.   ",
      "         @@@@@##·········.   ",
      "          @@@@##········.    ",
      "            @@@##······.     ",
      "         ✦    @@#···.    ·   ",
    ],
  },
  default: {
    color: ROSE,
    accent: PINK,
    label: "♡ cycle",
    sparkle: "  · you decide the vibe ·",
    art: [
      "         ˚    ··##@@··   ✦   ",
      "            ··###@@@@###·    ",
      "          ·###@@@@@@@@###·   ",
      "         ·##@@@@@@@@@@@@##·  ",
      "         ·##@@@@@@@@@@@@##·  ",
      "          ·###@@@@@@@@###·   ",
      "            ··###@@@@###·    ",
      "         ✦    ··##@@··   ˚   ",
    ],
  },
};

export function phaseArt(phase) {
  const plate = PLATES[phase] || PLATES.default;
  const lines = plate.art.map((l) => c(plate.color, l));
  return (
    lines.join("\n") +
    "\n" +
    c(BOLD + plate.accent, `  ${plate.label}`) +
    "\n" +
    c(SOFT, plate.sparkle)
  );
}

/** Cute pink progress heart-bar */
export function progressBar(day, total, width = 20) {
  if (!day || !total || total < 1) {
    return c(SOFT, "♡ " + "·".repeat(width));
  }
  const d = Math.max(1, Math.min(total, Number(day)));
  const filled = Math.round((d / total) * width);
  const bar =
    "♥".repeat(Math.max(0, filled)) + "♡".repeat(Math.max(0, width - filled));
  return (
    c(HOT, bar.slice(0, filled)) +
    c(PINK, bar.slice(filled)) +
    c(SOFT, `  day ${d}/${total}`)
  );
}

export function box(rows) {
  const width = Math.max(...rows.map((l) => stripAnsi(l).length), 36);
  const top = c(PINK, "╭" + "─".repeat(width + 2) + "╮");
  const bot = c(PINK, "╰" + "─".repeat(width + 2) + "╯");
  const mid = rows.map((l) => {
    return c(PINK, "│") + " " + padVisible(l, width) + " " + c(PINK, "│");
  });
  return [top, ...mid, bot].join("\n");
}

export function printStatus({ header, cycle, modes, statePath, extraLines = [] }) {
  const out = process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(phaseArt(cycle?.phase) + "\n\n");

  const lines = [];
  if (header) {
    lines.push(c(BOLD + CREAM, header) + " " + c(HOT, "♡"));
  }
  if (cycle?.configured) {
    lines.push(progressBar(cycle.dayInCycle, cycle.cycleLength));
    if (cycle.lastPeriodStart) {
      lines.push(c(SOFT, `anchor   ${cycle.lastPeriodStart}`));
    }
    if (cycle.energy) {
      lines.push(c(SOFT, `vibe     ${cycle.energy}`));
    }
  } else {
    lines.push(c(SOFT, "no anchor yet — import Health or set YYYY-MM-DD ♡"));
  }

  const modeKeys = Object.keys(modes || {}).filter((k) => modes[k]);
  if (modeKeys.length) {
    lines.push(c(LILAC, "modes    " + modeKeys.map((m) => `♡ ${m}`).join("  ")));
  }
  for (const e of extraLines) lines.push(c(SOFT, e));
  if (statePath) lines.push(c(DIM + SOFT, statePath));

  out.write(box(lines) + "\n");
  out.write(
    c(PINK, "  ♡ ") +
      c(SOFT, "not medical advice") +
      c(PINK, "  ·  ") +
      c(SOFT, "stays on your machine") +
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
      c(BOLD + CREAM, "import complete ♡"),
      c(SOFT, `${periodCount} cycles  ·  avg ${avg}d`),
      c(SOFT, `latest   ${lastStart}`),
      c(DIM + SOFT, statePath || ""),
    ]) + "\n"
  );
  out.write(c(PINK, "  ♡ local only · cute and private") + "\n");
}

export function printCleared() {
  const out = process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(
    box([
      c(BOLD + CREAM, "wiped clean ♡"),
      c(SOFT, "import again or: set YYYY-MM-DD"),
    ]) + "\n\n"
  );
}

export function printHelp() {
  const out = process.stdout.isTTY ? process.stdout : process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(c(HOT, "  ♡ commands") + "\n");
  out.write(c(SOFT, "    get                 pretty status") + "\n");
  out.write(c(SOFT, "    set YYYY-MM-DD [n]  set last start") + "\n");
  out.write(c(SOFT, "    clear               wipe local state") + "\n");
  out.write(c(SOFT, "    banner              art only") + "\n");
  out.write(c(SOFT, "    help") + "\n\n");
  out.write(c(HOT, "  ♡ import") + "\n");
  out.write(c(SOFT, "    node import-health.mjs path/to/export.xml") + "\n\n");
  out.write(c(PINK, "  TTY → pink art  ·  CYCLE_CODED_JSON=1 → raw json") + "\n\n");
}
