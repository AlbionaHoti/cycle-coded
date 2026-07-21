/**
 * cycle-coded CLI banner — cute pink only.
 * Pretty on TTY; JSON paths stay pipe-clean elsewhere.
 */

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

const BLUSH = "\x1b[38;5;225m";
const PINK = "\x1b[38;5;218m";
const ROSE = "\x1b[38;5;211m";
const HOT = "\x1b[38;5;205m";
const BERRY = "\x1b[38;5;198m";
const LILAC = "\x1b[38;5;183m";
const CREAM = "\x1b[38;5;255m";
const SOFT = "\x1b[38;5;250m";

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

/** Cute pink banner frame (not a corporate figlet wall) */
export function wordmark() {
  const shades = [BLUSH, PINK, ROSE, HOT, BERRY, HOT, ROSE, PINK];
  const lines = [
    "  ₊˚⊹♡ ₊˚⊹  ₊˚⊹♡ ₊˚⊹  ₊˚⊹♡ ₊˚⊹",
    "  ╭─────────────────────────────╮",
    "  │  ♡  c y c l e - c o d e d  │",
    "  │     cute agent modes  ♡    │",
    "  ╰─────────────────────────────╯",
    "  ₊˚⊹♡ ₊˚⊹  ₊˚⊹♡ ₊˚⊹  ₊˚⊹♡ ₊˚⊹",
  ];
  return lines
    .map((line, i) => c(shades[i % shades.length], line))
    .join("\n");
}

/** Soft pink moons — vibe first */
const PLATES = {
  menstrual: {
    color: SOFT,
    accent: PINK,
    label: "♡ bare minimum",
    sparkle: "     rest is productive too",
    art: [
      "           ˚  .·····.  ˚",
      "         .············.",
      "        ················",
      "        ·····  ♡  ······",
      "        ················",
      "         ··············",
      "           ˚  ······  ˚",
    ],
  },
  follicular: {
    color: PINK,
    accent: HOT,
    label: "♡ building",
    sparkle: "     rising · say yes to the fun version",
    art: [
      "           ˚  .····#@  ✦",
      "         .·······####@",
      "        ·········#####@",
      "        ····· ♡  ######@",
      "        ·········#####@",
      "         ········####@",
      "           ✦  ·····#@  ˚",
    ],
  },
  ovulatory: {
    color: HOT,
    accent: BERRY,
    label: "♡ post it",
    sparkle: "     main character energy",
    art: [
      "           ✦  @@@@@@@@  ✦",
      "         @@@@@@@@@@@@@@@@",
      "        @@@@@@@@@@@@@@@@@@",
      "        @@@@@  ♡  @@@@@@@@",
      "        @@@@@@@@@@@@@@@@@@",
      "         @@@@@@@@@@@@@@@@",
      "           ˚  @@@@@@@@  ˚",
    ],
  },
  luteal: {
    color: LILAC,
    accent: ROSE,
    label: "♡ ruthless",
    sparkle: "     cut the fluff · no yap",
    art: [
      "           ·  @@#···.  ✦",
      "         @@@##········.",
      "        @@@@##·········.",
      "        @@@  ♡  ##······.",
      "        @@@@##·········.",
      "         @@@##········.",
      "           ✦  @@#···.  ·",
    ],
  },
  default: {
    color: ROSE,
    accent: HOT,
    label: "♡ cycle",
    sparkle: "     you pick the vibe",
    art: [
      "           ˚  ··##@@··  ✦",
      "         ··###@@@@@@###·",
      "        ·##@@@@@@@@@@@@##·",
      "        ·##@@  ♡  @@@@##·",
      "        ·##@@@@@@@@@@@@##·",
      "         ··###@@@@@@###·",
      "           ✦  ··##@@··  ˚",
    ],
  },
};

export function phaseArt(phase) {
  const plate = PLATES[phase] || PLATES.default;
  return [
    ...plate.art.map((l) => c(plate.color, l)),
    c(BOLD + plate.accent, `     ${plate.label}`),
    c(SOFT, plate.sparkle),
  ].join("\n");
}

export function progressBar(day, total, width = 18) {
  if (!day || !total || total < 1) {
    return c(SOFT, "♡ " + "·".repeat(width));
  }
  const d = Math.max(1, Math.min(total, Number(day)));
  const filled = Math.round((d / total) * width);
  const hearts =
    "♥".repeat(Math.max(0, filled)) + "♡".repeat(Math.max(0, width - filled));
  return (
    c(HOT, hearts.slice(0, filled)) +
    c(PINK, hearts.slice(filled)) +
    c(SOFT, `  day ${d}/${total}`)
  );
}

export function box(rows) {
  const width = Math.max(...rows.map((l) => stripAnsi(l).length), 34);
  const top = c(HOT, "  ╭" + "─".repeat(width + 2) + "╮");
  const bot = c(HOT, "  ╰" + "─".repeat(width + 2) + "╯");
  const mid = rows.map(
    (l) => c(PINK, "  │") + " " + padVisible(l, width) + " " + c(PINK, "│")
  );
  return [top, ...mid, bot].join("\n");
}

export function printStatus({ header, cycle, modes, statePath, extraLines = [] }) {
  const out = process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(phaseArt(cycle?.phase) + "\n\n");

  const lines = [];
  if (header) lines.push(c(BOLD + CREAM, header) + c(HOT, "  ♡"));
  if (cycle?.configured) {
    lines.push(progressBar(cycle.dayInCycle, cycle.cycleLength));
    if (cycle.lastPeriodStart) {
      lines.push(c(SOFT, `anchor  ${cycle.lastPeriodStart}`));
    }
    if (cycle.energy) lines.push(c(SOFT, `vibe    ${cycle.energy}`));
  } else {
    lines.push(c(SOFT, "no anchor yet — import or set YYYY-MM-DD ♡"));
  }

  const modeKeys = Object.keys(modes || {}).filter((k) => modes[k]);
  if (modeKeys.length) {
    lines.push(c(LILAC, "modes   " + modeKeys.map((m) => `♡${m}`).join(" ")));
  }
  for (const e of extraLines) lines.push(c(SOFT, e));
  if (statePath) lines.push(c(DIM + SOFT, statePath));

  out.write(box(lines) + "\n");
  out.write(
    c(PINK, "\n  ♡ ") +
      c(SOFT, "not medical advice · stays on your mac") +
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
      c(SOFT, `${periodCount} cycles · avg ${avg}d`),
      c(SOFT, `latest  ${lastStart}`),
      c(DIM + SOFT, statePath || ""),
    ]) + "\n"
  );
  out.write(c(PINK, "\n  ♡ local only · cute and private\n\n"));
}

export function printCleared() {
  const out = process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(
    box([
      c(BOLD + CREAM, "wiped clean ♡"),
      c(SOFT, "import again or set YYYY-MM-DD"),
    ]) + "\n\n"
  );
}

export function printHelp() {
  const out = process.stdout.isTTY ? process.stdout : process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n\n");
  out.write(c(HOT, "  ♡ commands\n"));
  out.write(
    c(SOFT, "    get | check | brief | set | clear | banner | notify-test | help\n\n")
  );
  out.write(c(HOT, "  ♡ import\n"));
  out.write(c(SOFT, "    node import-health.mjs path/to/export.xml\n\n"));
}

/** Big phase-change card for terminal — rest / ship / sell / cut */
export function printPhaseBrief(brief, { changed = false } = {}) {
  const out = process.stderr;
  out.write("\n");
  out.write(wordmark() + "\n");
  if (changed) {
    out.write(c(BERRY + BOLD, "\n  ⚡  P H A S E   C H A N G E  —  work mode shifted\n"));
  }
  out.write(c(HOT, brief.ascii || "") + "\n");

  const rows = [
    c(BOLD + CREAM, brief.title),
    c(SOFT, brief.vibe_line || brief.why),
    c(SOFT, "·".repeat(32)),
    c(HOT, "REST  ") + c(CREAM, brief.rest?.yes || ""),
    c(PINK, "SHIP  ") + c(CREAM, brief.ship?.yes || ""),
    c(BERRY, "SELL  ") + c(CREAM, brief.sell?.yes || ""),
    c(LILAC, "CUT   ") + c(CREAM, brief.cut?.yes || ""),
    c(SOFT, "·".repeat(32)),
    c(HOT, "NOW   ") + c(CREAM, brief.do_now),
    c(LILAC, "AVOID ") + c(SOFT, brief.avoid),
  ];

  if (brief.terminal?.do_cmds) {
    rows.push(
      c(SOFT, "·".repeat(32)),
      c(PINK, "TERM  ") + c(SOFT, brief.terminal.do_cmds.join(" · ")),
      c(SOFT, "skip  ") + c(DIM + SOFT, (brief.terminal.skip_cmds || []).join(" · "))
    );
  }

  out.write(box(rows) + "\n");

  if (brief.best_for?.length) {
    out.write(c(HOT, "  best for\n"));
    for (const b of brief.best_for) {
      out.write(c(CREAM, `    ♡ ${b}\n`));
    }
    out.write("\n");
  }

  out.write(c(DIM + SOFT, "  not medical advice · phase → work policy only\n\n"));
}
