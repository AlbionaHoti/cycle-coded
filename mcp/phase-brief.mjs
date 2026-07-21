/**
 * Phase briefings — ASCII + "why this work mode" for chat/CLI/MCP.
 * Not medical. Output policy language only.
 */

export const PHASE_BRIEFS = {
  menstrual: {
    title: "BARE MINIMUM",
    why: "Energy is low. Starting is expensive. One clear action is a gift.",
    work: [
      "Do ONE thing. Then stop is allowed.",
      "No architecture. No rewrites. No side quests.",
      "Soft language on errors — no shame.",
      "Cap lists at 3. Prefer close the laptop over heroics.",
    ],
    do_now: "Pick the smallest fix that unblocks you.",
    avoid: "Big launches, hard sells, all-nighter plans.",
  },
  follicular: {
    title: "BUILDING · RUN ENERGY",
    why: "This is the week you feel like going on a run — novelty and yes-energy are high.",
    work: [
      "Green-light experiments and new builds.",
      "Offer ambitious option + safe option + kill criteria.",
      "Good for starting brands, features, side projects.",
      "Time-box spikes so ambition doesn't melt the week.",
    ],
    do_now: "Start the interesting version — with an exit ramp.",
    avoid: "Endless research with no first brick.",
  },
  ovulatory: {
    title: "LAUNCH · PITCH · SELL",
    why: "Magnetic week. You're built to kick off, pitch, demo, soft-launch, sell.",
    work: [
      "Lead with the screenshot moment / user-visible win.",
      "Package: PR, thread, walkthrough, brand story.",
      "Polish what ships — don't open secret rewrites.",
      "End with a line a human can retell.",
    ],
    do_now: "Put the thing in front of people.",
    avoid: "Hiding the wow behind setup dumps.",
  },
  luteal: {
    title: "RUTHLESS · CUT",
    why: "Detail is up. Hype is down. This is the week you find every hole.",
    work: [
      "Prefer delete / reduce over add.",
      "Name production risks early.",
      "Ship the 40-line fix, not the redesign.",
      "Mean bestie tone — attack the plan, not the person.",
    ],
    do_now: "Cut scope. Protect the main plot.",
    avoid: "Pep talks, ego rewrites, 'while we're here'.",
  },
  pms: {
    title: "PMS · SHORT FUSE",
    why: "Low patience for hedging. Sycophancy is noise. Truth first.",
    work: [
      "Answer → risk → next step. Zero padding.",
      "No 'I totally hear you' walls.",
      "One clarifying question max if ambiguous.",
      "Still protect energy — small steps OK.",
    ],
    do_now: "The actual answer. Not the TED Talk.",
    avoid: "Therapy-speak, soft lies, 12-option menus.",
  },
};

const ASCII = {
  menstrual: `
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·     B A R E   M I N     ·
   ·  ·  ·  ·  ♡  ·  ·  ·  ·  ·
`,
  follicular: `
      *     *     *
   *    B U I L D    *
      *   R U N   *
         *  ♡  *
`,
  ovulatory: `
      ★  L A U N C H  ★
   ★   P I T C H · S E L L   ★
      ★    P O S T I T    ★
`,
  luteal: `
   ╱  C U T   I T  ╲
  ╱   R U T H L E S S  ╲
  ╲   n o   r e w r i t e  ╱
`,
  pms: `
   ───  S A Y   L E S S  ───
   ───  P M S · n o   y a p  ───
`,
};

/**
 * Full briefing block for chat (no ANSI) or CLI (caller colors).
 */
export function buildPhaseBrief({ phase, dayInCycle, cycleLength, header, changed = false }) {
  const key = phase === "pms" ? "pms" : phase;
  const brief = PHASE_BRIEFS[key] || PHASE_BRIEFS.follicular;
  const art = (ASCII[key] || ASCII.follicular).trimEnd();
  const lines = [
    changed ? "⚡ PHASE CHANGE DETECTED" : "◎ CURRENT PHASE",
    art,
    header || `${phase} · day ${dayInCycle}`,
    dayInCycle && cycleLength ? `day ${dayInCycle} / ${cycleLength}` : null,
    "",
    `WHY: ${brief.why}`,
    "",
    "WORK MODE:",
    ...brief.work.map((w) => `  • ${w}`),
    "",
    `DO NOW:  ${brief.do_now}`,
    `AVOID:   ${brief.avoid}`,
    "",
    "Not medical advice · output policy only",
  ].filter((x) => x !== null);
  return {
    text: lines.join("\n"),
    title: brief.title,
    why: brief.why,
    do_now: brief.do_now,
    avoid: brief.avoid,
    work: brief.work,
    ascii: art,
    changed,
  };
}
