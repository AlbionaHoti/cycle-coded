/**
 * Before / after page — harry-check install CTA + phase contrast.
 * Route: /#before-after or ?view=before-after
 */
import { useState } from 'react'
import { ArrowLeft, Check, Copy } from 'lucide-react'

const INSTALL_CMD = `git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded && cd cycle-coded && bash install.sh`

const PAIRS = [
  {
    label: 'Same bug. PMS week.',
    before:
      'Great question! Debugging can be stressful — let\'s explore a few possibilities together and maybe rethink the whole auth architecture…',
    after: `pms · short fuse

Null on line 42 when the cookie expires.
Fix: early-return to /login.
Next: add the guard and re-run the one test.`,
  },
  {
    label: 'Same bug. Luteal week.',
    before:
      'You might consider a full redesign of the session layer with a new store and dependency refresh for long-term maintainability…',
    after: `luteal · day 23 · ruthless

Don't redesign. Ship the 40-line fix.

1. Guard missing session
2. One auth test
3. Stop.

Rewrite is ego until three users complain.`,
  },
  {
    label: 'Same week you want to run / launch / sell.',
    before:
      'Here are twelve growth ideas and a phased multi-quarter roadmap for your brand…',
    after: `follicular · day 9 · building
(+ ovulatory when it's pitch day)

Ship the ugly MVP people can buy this week.

**Ambitious:** landing + one checkout path (90 min spike)
**Safe:** one Typeform + link in bio
**Kill criteria:** if spike > 2h, ship the form.

Next: open the empty landing file.`,
  },
  {
    label: 'Demo / soft-launch day.',
    before:
      'This PR updates middleware to improve session reliability across multi-tab scenarios…',
    after: `ovulatory · day 14 · post it

Login feels instant — no "session expired" bounce on camera.

1. /login → sign in
2. Wait 10 min
3. Still in

Share: fixed the thing that made the app feel broken when it wasn't.`,
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
          before · after
        </p>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-4"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Same question.
          <br />
          Different week.
        </h1>
        <p
          className="text-white/65 text-sm sm:text-base max-w-xl mb-10 leading-relaxed"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          PMS wants truth, not therapy-speak. Luteal wants the cut. Follicular wants the run —
          launch, pitch, sell, brand. Install once; the agent stops treating every Tuesday the same.
        </p>

        <div className="space-y-8 mb-12">
          {PAIRS.map((p) => (
            <div key={p.label} className="rounded-2xl border border-white/10 overflow-hidden">
              <div
                className="px-4 py-2 text-[11px] tracking-wide uppercase text-pink-200/80 bg-white/5"
                style={{ fontFamily: 'ui-monospace, monospace' }}
              >
                {p.label}
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

        {/* Install — one-sentence + harry concrete CTA */}
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
          Then say &ldquo;I&apos;m luteal&rdquo; or paste your header from{' '}
          <code className="text-white/60">node mcp/server.mjs get</code>.
        </p>
      </div>
    </div>
  )
}
