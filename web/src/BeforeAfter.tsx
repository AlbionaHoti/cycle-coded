/**
 * Before / after — relatable girl-week dynamics + install.
 */
import { useState } from 'react'
import { ArrowLeft, Check, Copy } from 'lucide-react'

const INSTALL_CMD = `git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded && cd cycle-coded && bash install.sh`

const PHASES = [
  {
    id: 'pms',
    title: 'PMS week',
    vibe: 'Truth only. Short fuse. Rest is often correct.',
    rest: 'Yes — protect the nervous system.',
    ship: 'Only the minimum that ends the pain.',
    sell: 'No. Not this week.',
    cut: 'Cut the yap. Answer → risk → next.',
    before:
      "I totally hear you — debugging can be so stressful! Let's explore a few possibilities together and maybe rethink the architecture…",
    after: `pms · short fuse

Null on line 42 when the cookie expires.
Fix: early-return to /login.
Next: add the guard. One test. Stop.`,
  },
  {
    id: 'menstrual',
    title: 'Bleed / bare minimum',
    vibe: 'Rest is the move. One thing. Then permission to stop.',
    rest: 'Yes — not laziness. Smart.',
    ship: 'Only if it is already almost done and tiny.',
    sell: 'No launches. No cold outreach.',
    cut: 'Cut the day short. Cut meetings.',
    before:
      'Here is a full sprint plan with five workstreams and a multi-day migration…',
    after: `menstrual · day 2 · bare minimum

Open the file. One patch. One test.

1. Fix that path
2. Run the single test

Enough for today if you want.`,
  },
  {
    id: 'follicular',
    title: 'Run / build week',
    vibe: 'The week a run sounds good. Start. Build. Brand experiments.',
    rest: 'Between deep sessions — so you can run again.',
    ship: 'Ugly MVPs and spikes with kill criteria.',
    sell: 'Soft tests — waitlist, landing, would you buy?',
    cut: 'Cut research spirals. Time-box.',
    before:
      'Here are twelve growth ideas and a phased multi-quarter roadmap…',
    after: `follicular · day 9 · building

Ship the ugly MVP people can touch this week.

**Ambitious:** landing + one path (90 min spike)
**Safe:** one form + link in bio
**Kill criteria:** if > 2h, ship the form.

Next: open the empty file.`,
  },
  {
    id: 'ovulatory',
    title: 'Launch / pitch / sell',
    vibe: 'Kick off. Demo. Soft-launch. Sell. Be seen.',
    rest: 'After the show — you spent social fuel.',
    ship: 'What can be seen. Package hard.',
    sell: 'YES — pitch, ask, share the link.',
    cut: 'Cut filler from the pitch. Not the launch.',
    before:
      'This PR updates middleware to improve session reliability across multi-tab scenarios…',
    after: `ovulatory · day 14 · post it

Login feels instant — no bounce on camera.

1. Sign in
2. Wait 10 min
3. Still in

Share: fixed the thing that made the app feel broken when it wasn't.`,
  },
  {
    id: 'luteal',
    title: 'Luteal / ruthless',
    vibe: 'You see every hole. Cut scope. Small fix. No hype.',
    rest: 'Protect it. No peak-performance theater.',
    ship: 'The 40-line fix. The deletion.',
    sell: 'Only if the offer is already honest and solid.',
    cut: 'CUT — features, meetings, promises.',
    before:
      'You might consider a full redesign of the session layer for long-term maintainability…',
    after: `luteal · day 23 · ruthless

Don't redesign. Ship the 40-line fix.

1. Guard missing session
2. One auth test
3. Stop.

Rewrite is ego until three users complain.`,
  },
]

export function BeforeAfter({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false)

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD)
    } catch {
      /* ignore */
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="min-h-screen bg-[#12030a] text-white overflow-y-auto">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <p
          className="text-pink-300/90 text-xs tracking-[0.2em] uppercase mb-3"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          before · after · the whole cycle
        </p>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-4"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          When to rest.
          <br />
          When to ship.
          <br />
          When to sell.
        </h1>
        <p
          className="text-white/65 text-sm sm:text-base max-w-xl mb-10 leading-relaxed"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          Not every Tuesday is the same. PMS wants truth. Bleed week wants rest.
          Building week wants the run. Peak week wants the pitch. Luteal wants the cut.
          Install once — the agent stops gaslighting your energy.
        </p>

        <div className="space-y-8 mb-12">
          {PHASES.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                <p
                  className="text-[11px] tracking-wide uppercase text-pink-200/90 mb-1"
                  style={{ fontFamily: 'ui-monospace, monospace' }}
                >
                  {p.title}
                </p>
                <p
                  className="text-sm text-white/80"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {p.vibe}
                </p>
                <div
                  className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] sm:text-[11px]"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  <div className="rounded-lg bg-black/30 px-2 py-1.5">
                    <span className="text-white/40 block">Rest</span>
                    <span className="text-white/85">{p.rest}</span>
                  </div>
                  <div className="rounded-lg bg-black/30 px-2 py-1.5">
                    <span className="text-white/40 block">Ship</span>
                    <span className="text-white/85">{p.ship}</span>
                  </div>
                  <div className="rounded-lg bg-black/30 px-2 py-1.5">
                    <span className="text-white/40 block">Sell</span>
                    <span className="text-white/85">{p.sell}</span>
                  </div>
                  <div className="rounded-lg bg-black/30 px-2 py-1.5">
                    <span className="text-white/40 block">Cut</span>
                    <span className="text-white/85">{p.cut}</span>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2">
                <div className="p-4 sm:p-5 bg-black/40 border-b md:border-b-0 md:border-r border-white/10">
                  <p className="text-[10px] tracking-widest uppercase text-white/35 mb-2">
                    before
                  </p>
                  <p
                    className="text-sm text-white/50 leading-relaxed"
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                  >
                    {p.before}
                  </p>
                </div>
                <div className="p-4 sm:p-5 bg-pink-500/10">
                  <p className="text-[10px] tracking-widest uppercase text-pink-300/80 mb-2">
                    after · cycle-coded
                  </p>
                  <pre
                    className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed m-0"
                    style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}
                  >
                    {p.after}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="liquid-glass-hero rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
            <span
              className="text-[11px] tracking-wide uppercase text-white/70"
              style={{ fontFamily: 'ui-monospace, monospace' }}
            >
              install · one command
            </span>
            <button
              type="button"
              onClick={copyInstall}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] text-white"
            >
              {copied ? (
                <>
                  <Check size={12} /> Copied
                </>
              ) : (
                <>
                  <Copy size={12} /> Copy
                </>
              )}
            </button>
          </div>
          <pre
            className="px-4 py-3.5 text-[11px] sm:text-xs text-white/95 whitespace-pre-wrap break-all m-0"
            style={{ fontFamily: 'ui-monospace, monospace' }}
          >
            <span className="text-white/50">$ </span>
            {INSTALL_CMD}
          </pre>
        </div>
        <p
          className="mt-4 text-white/45 text-xs"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          Then <code className="text-white/60">node mcp/server.mjs brief</code> —
          the terminal tells you rest / ship / sell / cut for this week.
        </p>
      </div>
    </div>
  )
}
