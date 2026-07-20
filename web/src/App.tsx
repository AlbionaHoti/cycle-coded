import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'
import { ArrowUpRight, Heart } from 'lucide-react'
import { Reveal } from './components/Reveal'
import { CopyBlock } from './components/CopyBlock'
import { ScrollWorld } from './components/ScrollWorld'
import { CinematicHero } from './components/CinematicHero'

const JOKES = [
  {
    q: 'What Claude thinks you asked',
    a: 'A TED Talk about auth middleware, three side quests, and "hope this helps!"',
  },
  {
    q: 'What you actually needed',
    a: 'luteal · day 23 · ruthless\n\nDon\'t redesign. Fix line 58.\nNext: run the one test.',
  },
  {
    q: 'The inner joke',
    a: 'Girls already speak in phases. The agent just finally learned the dialect.',
  },
]

export default function App() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })
  const orbY = useTransform(smooth, [0, 1], [0, 220])
  const orbY2 = useTransform(smooth, [0, 1], [0, -160])
  const progressW = useTransform(smooth, [0, 1], ['0%', '100%'])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream text-ink">
      <motion.div
        className="fixed left-0 top-0 z-[60] h-[2px] bg-gradient-to-r from-rose via-hot to-berry"
        style={{ width: progressW }}
      />

      {/* CINEMATIC HERO — Lumora-style video stack */}
      <CinematicHero />

      {/* rest of page */}
      <div className="relative">
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <motion.div
            style={{ y: orbY }}
            className="float-orb absolute -left-24 top-[100vh] h-[420px] w-[420px] rounded-full bg-rose/30 blur-3xl"
          />
          <motion.div
            style={{ y: orbY2 }}
            className="float-orb-slow absolute -right-16 top-[140vh] h-[380px] w-[380px] rounded-full bg-hot/20 blur-3xl"
          />
        </div>

        <section
          id="joke"
          className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-14 py-24 md:py-32"
        >
          <Reveal>
            <p className="font-mono text-[11px] tracking-brand uppercase text-hot mb-4">
              the inner joke
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl text-ink max-w-3xl mb-6 leading-[1.05]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Not productivity. A dialect.
            </h2>
            <p className="text-ink/60 max-w-xl text-lg mb-14" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Girls already say <em className="text-hot not-italic">I&apos;m so luteal</em> in the
              group chat. cycle-coded is when Claude stops pretending it doesn&apos;t know what that
              means.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {JOKES.map((j, i) => (
              <Reveal key={j.q} delay={i * 0.1}>
                <div className="h-full rounded-3xl p-6 md:p-8 bg-white/70 border border-hot/10 shadow-[0_20px_50px_rgba(255,77,154,0.08)] backdrop-blur-sm">
                  <p className="font-mono text-[10px] tracking-brand uppercase text-hot mb-3">
                    {String(i + 1).padStart(2, '0')} — {j.q}
                  </p>
                  <pre className="font-mono text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">
                    {j.a}
                  </pre>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-12">
            <div className="liquid-glass-dark rounded-3xl p-8 md:p-12 text-white">
              <p className="font-mono text-[10px] tracking-brand uppercase text-rose mb-4">
                punchline
              </p>
              <p
                className="text-3xl sm:text-4xl md:text-5xl leading-tight max-w-3xl"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Mercury said no force-push.
                <br />
                <span className="text-rose">Luteal said no rewrite.</span>
                <br />
                Follicular said ship the spike.
              </p>
            </div>
          </Reveal>
        </section>

        <div className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-14 pt-8 pb-4">
          <Reveal>
            <p className="font-mono text-[11px] tracking-brand uppercase text-hot mb-3">
              fly the cycle
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl text-ink max-w-2xl mb-2"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Scroll = time. Four rooms. No cuts.
            </h2>
            <p className="text-ink/50 text-sm max-w-lg mb-6" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Scroll-scrub flight through the phases — same idea as continuous scroll-world
              landings.
            </p>
          </Reveal>
        </div>
        <ScrollWorld />

        <section className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-14 py-16">
          <Reveal className="flex flex-wrap gap-3 justify-center">
            {['mercury retrograde', 'building era', 'villain era', 'girl math', 'walkthrough'].map(
              (t) => (
                <span
                  key={t}
                  className="font-mono text-[11px] tracking-wide uppercase rounded-full border border-hot/20 bg-white/60 px-4 py-2 text-ink/70"
                >
                  + {t}
                </span>
              ),
            )}
          </Reveal>
        </section>

        <section className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-14 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-5">
            <Reveal>
              <div className="rounded-3xl bg-ink text-white/50 p-7 md:p-9 h-full">
                <p className="font-mono text-[10px] tracking-brand uppercase mb-4 text-white/30">
                  before · default agent
                </p>
                <p className="text-sm leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  Great question! Your auth flow has several moving pieces. One approach would be a
                  full session redesign. Hope this helps!
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="rounded-3xl bg-gradient-to-br from-hot to-berry text-white p-7 md:p-9 h-full shadow-[0_24px_60px_rgba(255,77,154,0.35)]">
                <p className="font-mono text-[10px] tracking-brand uppercase mb-4 text-white/80 flex items-center gap-2">
                  <Heart size={12} fill="currentColor" /> after · luteal
                </p>
                <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {`luteal · day 23 · ruthless

Don't redesign. Fix the null on src/auth.ts:58.

1. Early-return to /login if no session
2. Run npm test -- auth

Rewrite is ego until three users complain.`}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="install"
          className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-14 py-24 md:py-32"
        >
          <Reveal>
            <p className="font-mono text-[11px] tracking-brand uppercase text-hot mb-4">
              install in one breath
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl text-ink mb-4"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Claude, Codex, ChatGPT, Gemini, Grok…
            </h2>
            <p
              className="text-ink/55 max-w-xl mb-12"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              Skill everywhere. Cycle data stays on your Mac. Paste only the header into web chats.
            </p>
          </Reveal>

          <div className="space-y-5 max-w-3xl">
            <Reveal>
              <CopyBlock
                label="bash · one command · every agent"
                code={`git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded && cd cycle-coded && bash install.sh`}
              />
            </Reveal>
            <Reveal delay={0.06}>
              <p
                className="text-sm text-ink/50"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                That installs Claude + Codex + Cursor hooks and writes{' '}
                <code className="text-hot">instructions/ONE_PROMPT.md</code> for
                ChatGPT / Gemini / Grok. Optional phase:{' '}
                <code className="text-hot">node mcp/server.mjs get</code>
              </p>
            </Reveal>
          </div>
        </section>

        <section
          id="privacy"
          className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-14 pb-24"
        >
          <Reveal>
            <div className="rounded-3xl border border-hot/15 bg-white/60 backdrop-blur p-8 md:p-12">
              <p className="font-mono text-[10px] tracking-brand uppercase text-hot mb-3">
                runs on your computer
              </p>
              <h3
                className="text-3xl md:text-4xl text-ink mb-4"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                No cycle-coded server. No account. No phone-home.
              </h3>
              <p
                className="text-ink/60 max-w-2xl leading-relaxed mb-6"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                Health imports write to <code className="text-hot">~/.cycle-coded/</code> on your
                machine only. Not medical advice. Not fortune-telling.
              </p>
              <a
                href="https://github.com/AlbionaHoti/cycle-coded/blob/main/PRIVACY.md"
                className="inline-flex items-center gap-2 text-hot text-sm font-medium hover:gap-3 transition-all"
              >
                Read the privacy guarantee <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>

          <footer className="mt-16 flex flex-col sm:flex-row justify-between gap-4 text-ink/40 text-sm font-mono">
            <p>♡ cycle-coded · MIT · not medical advice</p>
            <p>built for the girls who already had the words</p>
          </footer>
        </section>
      </div>
    </div>
  )
}
