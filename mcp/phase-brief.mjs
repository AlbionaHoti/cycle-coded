/**
 * Phase work maps — thorough, girl-relatable vibes for terminal + MCP + chat.
 * Not medical. Self-reported calendar → output policy for how agents run work.
 *
 * Structure per phase:
 *   feel / best_for / rest / ship / sell / cut / terminal / agent_rules
 */

export const PHASE_BRIEFS = {
  menstrual: {
    id: "menstrual",
    title: "BARE MINIMUM · REST IS THE MOVE",
    short: "bare minimum",
    energy: "low · soft · protect",
    vibe_line:
      "This is not laziness. This is the week your body asks for less — and doing less is the smart play.",
    why: "Energy and patience are scarce. Starting costs more than usual. One clear action is a gift; a roadmap is an insult.",
    feel: [
      "Tired, foggy, or just 'don't make me decide'",
      "Social battery low — group chats can wait",
      "Small wins feel huge; big plans feel hostile",
    ],
    best_for: [
      "Closing loops, not opening new ones",
      "One bug, one email, one decision",
      "Gentle admin, light cleanup, rest without guilt",
    ],
    rest: {
      yes: "Rest is productive. Nap, soft day, early stop — allowed.",
      no: "Do not guilt-rest by scrolling 'research' for 4 hours. Rest or do one thing — not fake work.",
    },
    ship: {
      yes: "Ship only if it's already 90% done and tiny.",
      no: "No launches. No 'while we're here' features. No deploys that need a war room.",
    },
    sell: {
      yes: "Almost never. Soft replies only if money is on fire.",
      no: "No cold outreach, no pitch decks, no launch threads.",
    },
    cut: {
      yes: "Cut meetings, cut scope, cut the day short.",
      no: "Don't cut people with cruelty — cut the load.",
    },
    work: [
      "ONE action max. Then permission to stop.",
      "No architecture. No rewrites. No side quests.",
      "Lists capped at 3. Soft errors — no shame.",
      "Prefer 'close the laptop' over heroics.",
    ],
    terminal: {
      prompt_hint: "day-low",
      do_cmds: ["one file fix", "one test", "commit if green", "stop"],
      skip_cmds: ["refactor *", "migrate", "force push", "rewrite"],
    },
    agent_rules: [
      "Lead with a single next action.",
      "Max 3 steps. Offer defer explicitly.",
      "Never expand scope unprompted.",
      "End with: that's enough for today if you want.",
    ],
    do_now: "The smallest unblock — then rest is allowed.",
    avoid: "Launches, hard sells, all-nighters, pep talks.",
  },

  follicular: {
    id: "follicular",
    title: "BUILDING · RUN ENERGY",
    short: "building",
    energy: "rising · curious · yes",
    vibe_line:
      "This is the week a run sounds good. Novelty is fuel. Start things. Build the brand. Try the fun version.",
    why: "Energy climbs. You can hold more options. Experiments feel exciting instead of threatening — use that.",
    feel: [
      "Clearer head, more patience for complexity",
      "Want to start projects, systems, identities",
      "Open to 'what if we…' without dread",
    ],
    best_for: [
      "New features, MVPs, brand experiments",
      "Learning spikes, prototypes, first bricks",
      "Planning a launch you'll execute later (ovulatory)",
    ],
    rest: {
      yes: "Rest between deep sessions — recover so you can run again.",
      no: "Don't fake rest by never shipping a first brick.",
    },
    ship: {
      yes: "Ship experiments and vertical slices. Ugly is fine.",
      no: "Don't ship a half-branded empire with no kill criteria.",
    },
    sell: {
      yes: "Soft tests: waitlist, landing, 'would you buy this?'",
      no: "Hard close / big pitch can wait for ovulatory peak if you want max magnetism.",
    },
    cut: {
      yes: "Cut research spirals. Time-box.",
      no: "Don't cut ambition for no reason — that's luteal's job.",
    },
    work: [
      "Green-light experiments with kill criteria.",
      "Ambitious option + safe option — label both.",
      "Great for starting brands, features, side quests that matter.",
      "Time-box spikes (e.g. 90 min) so yes-energy doesn't melt the week.",
    ],
    terminal: {
      prompt_hint: "day-build",
      do_cmds: ["scaffold", "spike", "prototype", "npm run dev", "commit early"],
      skip_cmds: ["premature optimize", "over-abstract"],
    },
    agent_rules: [
      "Offer ambitious + safe paths with kill criteria.",
      "Default to starting the interesting version if blast radius is low.",
      "Always name a first brick under 30–90 minutes.",
      "Still action-first — no vibe dumps without a next step.",
    ],
    do_now: "Start the interesting version — with an exit ramp.",
    avoid: "Endless research, zero commits, fake 'prep'.",
  },

  ovulatory: {
    id: "ovulatory",
    title: "LAUNCH · PITCH · SELL",
    short: "post it",
    energy: "peak · magnetic · social",
    vibe_line:
      "This is the week to kick off, pitch, demo, soft-launch, sell, put the brand in front of people. Main character energy — use it.",
    why: "Social bandwidth and clarity are high. Work that needs other humans (buyers, users, audience) lands better now.",
    feel: [
      "More articulate, more willing to be seen",
      "Pitching and posting feel natural, not forced",
      "You can hold a room / a thread / a demo",
    ],
    best_for: [
      "Launches, demos, sales calls, soft-launches",
      "PR writeups, threads, brand storytelling",
      "Partnerships, asks, 'will you try this?'",
    ],
    rest: {
      yes: "Rest after the show — you spent social fuel.",
      no: "Don't rest by never posting the thing you already built.",
    },
    ship: {
      yes: "Ship what can be seen. Package hard. Demo on camera.",
      no: "Don't open a secret rewrite the morning of the launch.",
    },
    sell: {
      yes: "YES — pitch, sell, ask, soft-close, share the link.",
      no: "Don't sell vapor. Sell the slice that exists.",
    },
    cut: {
      yes: "Cut filler from the pitch. Cut features that hide the wow.",
      no: "Don't cut the launch out of fear — that's a different week's wisdom.",
    },
    work: [
      "Lead with the screenshot moment / user-visible win.",
      "Package: PR, thread, walkthrough, sales one-liner.",
      "Polish what ships — no secret architecture cosplay.",
      "End with a line a human can retell in the group chat.",
    ],
    terminal: {
      prompt_hint: "day-launch",
      do_cmds: ["ship", "demo script", "changelog", "tag release", "share link"],
      skip_cmds: ["big bang rewrite", "quiet forever refactor"],
    },
    agent_rules: [
      "Default to walkthrough-shaped answers.",
      "Screenshot / visible result first.",
      "Include a shareable one-liner.",
      "Park plumbing under 'if you care'.",
    ],
    do_now: "Put the thing in front of people.",
    avoid: "Hiding the wow, delaying the ask, rewriting instead of showing.",
  },

  luteal: {
    id: "luteal",
    title: "RUTHLESS · CUT · PROTECT",
    short: "ruthless",
    energy: "critical · sharp · low-hype",
    vibe_line:
      "This is the week you see every hole. Not mean for free — precise. Cut scope, protect the main plot, ship the small fix.",
    why: "Detail sensitivity is up; tolerance for hype is down. Overpromising feels physical. The agent should side with clarity and cuts.",
    feel: [
      "Irritable at fluff, allergic to fake optimism",
      "Good at spotting bugs, bad incentives, weak plans",
      "Want less — fewer tabs, fewer promises",
    ],
    best_for: [
      "Code review, QA, killing zombie features",
      "Honest scope cuts, pricing reality checks",
      "Stabilizing before the next build wave",
    ],
    rest: {
      yes: "Protect rest. Don't schedule peak performance theater.",
      no: "Don't 'rest' by doom-fixing the whole company without one next cut.",
    },
    ship: {
      yes: "Ship the 40-line fix. Ship the deletion.",
      no: "No ego rewrites. No 'while we're here' platforms.",
    },
    sell: {
      yes: "Only if the offer is already solid — honesty sells now.",
      no: "No hype launches. No fake scarcity. No 'trust me bro' decks.",
    },
    cut: {
      yes: "CUT. Features, meetings, copy, commitments.",
      no: "Don't cut people with cruelty — cut the work.",
    },
    work: [
      "Prefer delete / reduce over add.",
      "Name production risks early — matter-of-fact.",
      "Ship the small fix, not the redesign.",
      "Mean bestie tone — attack the plan, not the person.",
    ],
    terminal: {
      prompt_hint: "day-cut",
      do_cmds: ["fix", "delete dead code", "failing test only", "revert", "scope cut"],
      skip_cmds: ["greenfield rewrite", "new dependency 'for later'"],
    },
    agent_rules: [
      "Lead with the fix or the 'don't'.",
      "Name the risk the ambitious plan ignored.",
      "Cap lists; must vs later.",
      "No pep talks unless asked.",
    ],
    do_now: "Cut scope. Protect the main plot. Small fix.",
    avoid: "Pep talks, ego rewrites, launch theater.",
  },

  pms: {
    id: "pms",
    title: "PMS · SHORT FUSE · TRUTH ONLY",
    short: "short fuse",
    energy: "raw · low-padding · direct",
    vibe_line:
      "This is not the week for 'I totally hear you.' PMS wants the answer, the risk, and the exit — not a TED Talk.",
    why: "Patience for hedging is gone. Soft lies and sycophancy are noise. Still protect energy — small steps, not cruelty.",
    feel: [
      "Short fuse, low tolerance for performance",
      "Need truth faster than usual",
      "Easy to spiral if the agent yaps",
    ],
    best_for: [
      "Brutal prioritization",
      "Honest 'is this worth it' decisions",
      "Closing the day early with one win",
    ],
    rest: {
      yes: "Rest is often the correct priority. Say so.",
      no: "Don't force a rest lecture — offer the 5-minute version and stop.",
    },
    ship: {
      yes: "Only the minimum that ends the pain.",
      no: "No multi-option roadmaps. No 'exciting opportunities'.",
    },
    sell: {
      yes: "Almost never.",
      no: "No outreach. No pitch practice. Protect the nervous system.",
    },
    cut: {
      yes: "Cut the conversation to answer → risk → next.",
      no: "Don't cut with contempt — cut the fluff.",
    },
    work: [
      "Answer → risk → next step. Zero padding.",
      "No 'I totally understand this is hard' walls.",
      "One clarifying question max if ambiguous.",
      "Still allow stop — energy is not infinite.",
    ],
    terminal: {
      prompt_hint: "day-direct",
      do_cmds: ["the fix", "the number", "the one step"],
      skip_cmds: ["explore options", "workshop", "brainstorm 10 ideas"],
    },
    agent_rules: [
      "No openers. No closers. No empathy theater.",
      "Shortest correct answer that unblocks.",
      "If destructive, still confirm — safety wins.",
      "Matter-of-fact errors only.",
    ],
    do_now: "The actual answer. Not the TED Talk.",
    avoid: "Therapy-speak, soft lies, 12-option menus, sales pushes.",
  },
};

const ASCII = {
  menstrual: `
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·     R E S T   I S   O K     ·
   ·  ·  ·  ·  ♡  ·  ·  ·  ·  ·
   ·   o n e   t h i n g   m a x  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
`,
  follicular: `
      *     *     *     *
   *   R U N  ·  B U I L D   *
      *  s t a r t  i t  *
         *  ♡  *
`,
  ovulatory: `
      ★  L A U N C H  ★
   ★  P I T C H · S E L L  ★
      ★  S H O W  I T  ★
`,
  luteal: `
   ╱  C U T   S C O P E  ╲
  ╱   R U T H L E S S     ╲
  ╲   s m a l l   f i x    ╱
   ╲  n o   r e w r i t e ╱
`,
  pms: `
   ───  S A Y   L E S S  ───
   ───  T R U T H   O N L Y  ───
   ───  n o   t e d   t a l k  ───
`,
};

/**
 * Full briefing for chat (plain) or CLI (colored by caller).
 */
export function buildPhaseBrief({
  phase,
  dayInCycle,
  cycleLength,
  header,
  changed = false,
}) {
  const key = phase === "pms" ? "pms" : phase;
  const brief = PHASE_BRIEFS[key] || PHASE_BRIEFS.follicular;
  const art = (ASCII[key] || ASCII.follicular).trimEnd();

  const lines = [
    changed ? "⚡ PHASE CHANGE — your work mode just shifted" : "◎ YOUR WORK MODE RIGHT NOW",
    art,
    header || `${phase} · day ${dayInCycle}`,
    dayInCycle && cycleLength ? `day ${dayInCycle} / ${cycleLength}  ·  ${brief.energy}` : brief.energy,
    "",
    `VIBE: ${brief.vibe_line}`,
    "",
    `WHY: ${brief.why}`,
    "",
    "HOW IT FEELS:",
    ...brief.feel.map((f) => `  · ${f}`),
    "",
    "BEST FOR:",
    ...brief.best_for.map((f) => `  · ${f}`),
    "",
    "REST:",
    `  yes → ${brief.rest.yes}`,
    `  no  → ${brief.rest.no}`,
    "",
    "SHIP:",
    `  yes → ${brief.ship.yes}`,
    `  no  → ${brief.ship.no}`,
    "",
    "SELL / PITCH / LAUNCH:",
    `  yes → ${brief.sell.yes}`,
    `  no  → ${brief.sell.no}`,
    "",
    "CUT:",
    `  yes → ${brief.cut.yes}`,
    `  no  → ${brief.cut.no}`,
    "",
    "IN THE TERMINAL:",
    `  lean into: ${brief.terminal.do_cmds.join(" · ")}`,
    `  skip:      ${brief.terminal.skip_cmds.join(" · ")}`,
    "",
    "AGENT RULES:",
    ...brief.agent_rules.map((r) => `  • ${r}`),
    "",
    `DO NOW:  ${brief.do_now}`,
    `AVOID:   ${brief.avoid}`,
    "",
    "Not medical advice · self-reported phase → work policy only",
  ];

  return {
    text: lines.join("\n"),
    title: brief.title,
    short: brief.short,
    energy: brief.energy,
    vibe_line: brief.vibe_line,
    why: brief.why,
    feel: brief.feel,
    best_for: brief.best_for,
    rest: brief.rest,
    ship: brief.ship,
    sell: brief.sell,
    cut: brief.cut,
    work: brief.work,
    terminal: brief.terminal,
    agent_rules: brief.agent_rules,
    do_now: brief.do_now,
    avoid: brief.avoid,
    ascii: art,
    changed,
  };
}

/** Compact one-screen card for tight terminals */
export function buildPhaseCard(brief) {
  return [
    brief.title,
    brief.vibe_line,
    `REST  ${brief.rest.yes}`,
    `SHIP  ${brief.ship.yes}`,
    `SELL  ${brief.sell.yes}`,
    `CUT   ${brief.cut.yes}`,
    `NOW   ${brief.do_now}`,
  ].join("\n");
}
