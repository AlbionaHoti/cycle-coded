import { useEffect, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'
import { ArrowUpRight, Heart } from 'lucide-react'
import { StaggeredFade } from './components/StaggeredFade'
import { Reveal } from './components/Reveal'
import { CopyBlock } from './components/CopyBlock'

const NAV = [
  { label: 'THE JOKE', href: '#joke' },
  { label: 'PHASES', href: '#phases' },
  { label: 'INSTALL', href: '#install' },
]

const PHASES = [
  {
    id: 'menstrual',
    tag: 'day 1–5',
    title: 'bare minimum',
    line: 'One action. Permission to stop. Laptop optional.',
    header: 'menstrual · day 2 · bare minimum',
    vibe: 'soft power-save',
  },
  {
    id: 'follicular',
    tag: 'day 6–13',
    title: 'building',
    line: 'Say yes to the fun version. Kill criteria required.',
    header: 'follicular · day 12 · building',
    vibe: 'green lights',
  },
  {
    id: 'ovulatory',
    tag: 'day 14–16',
    title: 'post it',
    line: 'Walkthrough mode. Screenshot first. Share line last.',
    header: 'ovulatory · day 14 · post it',
    vibe: 'main character',
  },
  {
    id: 'luteal',
    tag: 'day 17–28',
    title: 'ruthless',
    line: "Don't redesign. Ship the 40-line fix. Find the hole.",
    header: 'luteal · day 23 · ruthless',
    vibe: 'mean bestie',
  },
]

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuClosing, setMenuClosing] = useState(false)
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })
  const orbY = useTransform(smooth, [0, 1], [0, 220])
  const orbY2 = useTransform(smooth, [0, 1], [0, -160])
  const progressW = useTransform(smooth, [0, 1], ['0%', '100%'])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  function handleCloseMenu() {
    setMenuClosing(true)
    window.setTimeout(() => {
      setMenuOpen(false)
      setMenuClosing(false)
    }, 550)
  }

  function toggleMenu() {
    if (menuOpen && !menuClosing) handleCloseMenu()
    else if (!menuClosing) setMenuOpen(true)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream text-ink">
      {/* scroll progress — organic heartline */}
      <motion.div
        className="fixed left-0 top-0 z-[60] h-[2px] bg-gradient-to-r from-rose via-hot to-berry"
        style={{ width: progressW }}
      />

      {/* floating orbs — parallax on scroll (atelier organic feel) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          style={{ y: orbY }}
          className="float-orb absolute -left-24 top-20 h-[420px] w-[420px] rounded-full bg-rose/40 blur-3xl"
        />
        <motion.div
          style={{ y: orbY2 }}
          className="float-orb-slow absolute -right-16 top-[40%] h-[380px] w-[380px] rounded-full bg-hot/25 blur-3xl"
        />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-blush/50 blur-3xl" />
      </div>

      {/* NAV */}
      <header className="relative z-50 px-4 sm:px-6 md:px-10 lg:px-14 py-5">
        <nav className="hidden lg:flex items-center justify-between w-full animate-slide-down">
          <a
            href="#"
            className="text-hot text-[11px] tracking-brand uppercase font-medium font-mono"
          >
            ♡ cycle-coded
          </a>
          <div className="flex items-center gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-ink/60 hover:text-hot text-[10px] tracking-brand uppercase transition-colors duration-300"
              >
                {n.label}
              </a>
            ))}
          </div>
          <a
            href="https://github.com/AlbionaHoti/cycle-coded"
            className="liquid-glass rounded-full px-4 py-2 flex items-center gap-2 text-ink text-[10px] tracking-brand uppercase group"
          >
            Star on GitHub
            <ArrowUpRight
              size={12}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
        </nav>

        <nav className="flex lg:hidden items-center justify-between w-full animate-slide-down relative z-50">
          <a href="#" className="text-hot text-[11px] tracking-brand uppercase font-mono font-medium">
            ♡ cycle-coded
          </a>
          <button
            type="button"
            aria-label="Menu"
            onClick={toggleMenu}
            className={`flex flex-col items-center justify-center gap-[5px] w-10 h-10 ${
              menuOpen && !menuClosing ? 'hamburger-open' : ''
            }`}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={`menu-overlay ${menuOpen ? 'is-open' : ''} ${
          menuClosing ? 'is-closing' : ''
        }`}
      >
        <div className="flex flex-col items-center justify-center flex-1 px-8">
          <span className="menu-line" />
          {NAV.map((n) => (
            <div key={n.href} className="w-full max-w-sm">
              <a
                href={n.href}
                onClick={handleCloseMenu}
                className="menu-item block text-center text-xl sm:text-2xl tracking-[0.25em] uppercase text-white py-6 sm:py-8 hover:text-white/70"
              >
                {n.label}
              </a>
              <span className="menu-line" />
            </div>
          ))}
          <a
            href="https://github.com/AlbionaHoti/cycle-coded"
            onClick={handleCloseMenu}
            className="menu-item mt-4 flex items-center gap-3 text-white text-xl tracking-[0.25em] uppercase py-6"
          >
            STAR ON GITHUB <ArrowUpRight size={18} />
          </a>
        </div>
      </div>

      {/* HERO */}
      <section className="relative z-10 min-h-[88vh] flex flex-col px-4 sm:px-6 md:px-10 lg:px-14 pb-16">
        <div className="flex-1" />
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 md:mb-10 gap-4">
          <div>
            <p className="hero-heading text-[7vw] sm:text-[5vw] md:text-[3.2vw] text-ink/80 mb-3 md:mb-5">
              <StaggeredFade text="Claude that knows" delay={0.04} />
            </p>
            <h1 className="hero-heading text-[16vw] sm:text-[14vw] md:text-[10vw] lg:text-[9vw] text-hot leading-none">
              <StaggeredFade text="WHAT DAY" delay={0.05} />
            </h1>
          </div>
          <div className="text-left md:text-right">
            <p className="hero-heading text-[16vw] sm:text-[14vw] md:text-[10vw] lg:text-[9vw] text-ink leading-none mb-2">
              <StaggeredFade text="it is" delay={0.06} />
            </p>
            <p className="hero-heading text-[12vw] sm:text-[10vw] md:text-[6vw] text-rose leading-none">
              <StaggeredFade text="♡" delay={0.1} />
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6 border-t border-hot/15">
          <div className="flex items-start gap-5 md:gap-10 max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl liquid-glass flex items-center justify-center flex-shrink-0 text-2xl"
            >
              ♡
            </motion.div>
            <div className="hidden sm:flex gap-8 md:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-[11px] md:text-[12px] tracking-brand uppercase text-ink mb-1.5">
                  01 — the meme
                </p>
                <p className="text-[10px] md:text-[11px] uppercase tracking-wide text-ink/65 leading-relaxed max-w-[240px]">
                  Follicular you ships. Luteal you deletes. The agent finally got the group chat.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-[11px] md:text-[12px] tracking-brand uppercase text-ink mb-1.5">
                  02 — the product
                </p>
                <p className="text-[10px] md:text-[11px] uppercase tracking-wide text-ink/65 leading-relaxed max-w-[240px]">
                  A skill + local CLI. Not a wellness app. Not a cloud. Just output that matches the vibe.
                </p>
              </motion.div>
            </div>
          </div>

          <motion.a
            href="#install"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass rounded-full px-6 py-3 md:px-8 md:py-4 flex items-center gap-3 text-ink text-[10px] md:text-xs tracking-[0.2em] uppercase group"
          >
            Install the joke
            <ArrowUpRight
              size={14}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </motion.a>
        </div>
      </section>

      {/* THE JOKE */}
      <section id="joke" className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-14 py-24 md:py-32">
        <Reveal>
          <p className="font-mono text-[11px] tracking-brand uppercase text-hot mb-4">
            the inner joke
          </p>
          <h2 className="hero-heading text-4xl sm:text-5xl md:text-6xl text-ink max-w-3xl mb-6">
            Not productivity. A dialect.
          </h2>
          <p className="text-ink/60 max-w-xl text-lg mb-14">
            Girls already say <em className="text-hot not-italic">I&apos;m so luteal</em> in the group chat.
            cycle-coded is when Claude stops pretending it doesn&apos;t know what that means.
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
            <p className="hero-heading text-3xl sm:text-4xl md:text-5xl leading-tight max-w-3xl">
              Mercury said no force-push.
              <br />
              <span className="text-rose">Luteal said no rewrite.</span>
              <br />
              Follicular said ship the spike.
            </p>
          </div>
        </Reveal>
      </section>

      {/* PHASES */}
      <section id="phases" className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-14 py-24 md:py-32">
        <Reveal>
          <p className="font-mono text-[11px] tracking-brand uppercase text-hot mb-4">
            four moods. one agent.
          </p>
          <h2 className="hero-heading text-4xl sm:text-5xl md:text-6xl text-ink mb-4">
            Pick a phase. Change the answer.
          </h2>
          <p className="text-ink/55 max-w-lg mb-14">
            Same coding question. Four correct answers. That&apos;s the meme — and the product.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5">
          {PHASES.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <article className="group relative overflow-hidden rounded-3xl border border-hot/10 bg-gradient-to-br from-white to-blush/40 p-7 md:p-9 hover:border-hot/30 transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[10px] tracking-brand uppercase text-hot">
                    {p.tag}
                  </span>
                  <span className="font-mono text-[10px] tracking-wide uppercase text-ink/40">
                    {p.vibe}
                  </span>
                </div>
                <h3 className="hero-heading text-4xl md:text-5xl text-ink mb-3 group-hover:text-hot transition-colors">
                  {p.title}
                </h3>
                <p className="text-ink/60 mb-6 leading-relaxed">{p.line}</p>
                <code className="inline-block font-mono text-xs text-berry bg-hot/10 rounded-full px-3 py-1.5">
                  {p.header}
                </code>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-wrap gap-3">
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

      {/* BEFORE / AFTER */}
      <section className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-14 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-5">
          <Reveal>
            <div className="rounded-3xl bg-ink text-white/50 p-7 md:p-9 h-full">
              <p className="font-mono text-[10px] tracking-brand uppercase mb-4 text-white/30">
                before · default agent
              </p>
              <p className="text-sm leading-relaxed">
                Great question! Your auth flow has several moving pieces. One approach would be a full
                session redesign. You might also want to consider dependency hygiene. Hope this helps!
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

      {/* INSTALL */}
      <section id="install" className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-14 py-24 md:py-32">
        <Reveal>
          <p className="font-mono text-[11px] tracking-brand uppercase text-hot mb-4">
            install in one breath
          </p>
          <h2 className="hero-heading text-4xl sm:text-5xl md:text-6xl text-ink mb-4">
            Works on Claude, Codex, ChatGPT, Gemini, Grok…
          </h2>
          <p className="text-ink/55 max-w-xl mb-12">
            Skill everywhere. Your cycle data stays on your Mac. Paste only the header into web chats —
            never the Health export.
          </p>
        </Reveal>

        <div className="space-y-5 max-w-3xl">
          <Reveal>
            <CopyBlock
              label="bash · all agents"
              code={`git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded
cd cycle-coded
bash install.sh`}
            />
          </Reveal>
          <Reveal delay={0.06}>
            <CopyBlock
              label="bash · Claude Code"
              code={`claude plugin marketplace add ./cycle-coded
claude plugin install cycle-coded@cycle-coded
# then: /cycle-coded  or  say "i'm luteal"`}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <CopyBlock
              label="bash · Codex"
              code={`codex plugin marketplace add AlbionaHoti/cycle-coded --ref main
codex plugin add cycle-coded@cycle-coded`}
            />
          </Reveal>
          <Reveal delay={0.14}>
            <CopyBlock
              label="bash · local phase (your Health data)"
              code={`node mcp/import-health.mjs path/to/export.xml
node mcp/server.mjs get
# paste only the header into any chat`}
            />
          </Reveal>
        </div>
      </section>

      {/* PRIVACY + FOOTER */}
      <section className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-14 pb-24">
        <Reveal>
          <div className="rounded-3xl border border-hot/15 bg-white/60 backdrop-blur p-8 md:p-12">
            <p className="font-mono text-[10px] tracking-brand uppercase text-hot mb-3">
              runs on your computer
            </p>
            <h3 className="hero-heading text-3xl md:text-4xl text-ink mb-4">
              No cycle-coded server. No account. No phone-home.
            </h3>
            <p className="text-ink/60 max-w-2xl leading-relaxed mb-6">
              Health imports write to <code className="text-hot">~/.cycle-coded/</code> on your machine
              only. Not medical advice. Not fortune-telling. Just output policy with a pink banner.
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
  )
}
