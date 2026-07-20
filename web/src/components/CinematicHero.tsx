import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, Copy, Menu, X } from 'lucide-react'

/** Single command — install.sh wires Claude, Codex, Cursor, skills.sh, ONE_PROMPT */
const INSTALL_CMD = `git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded && cd cycle-coded && bash install.sh`

const VIDEOS = [
  {
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4',
    label: 'Golden Hour',
    phase: 'follicular',
  },
  {
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4',
    label: 'Still Water',
    phase: 'menstrual',
  },
  {
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4',
    label: 'Deep Woods',
    phase: 'luteal',
  },
  {
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4',
    label: 'Quiet Dawn',
    phase: 'ovulatory',
  },
]

const OVERLAY =
  'https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png'

const NAV = [
  { label: 'The Joke', href: '#joke' },
  { label: 'Fly the Cycle', href: '#world' },
  { label: 'Install', href: '#install' },
  { label: 'Privacy', href: '#privacy' },
]

const ease = 'cubic-bezier(0.4, 0, 0.2, 1)'

export function CinematicHero() {
  const [activeVideo, setActiveVideo] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const isDark = activeVideo === 2 // Deep Woods / luteal
  const ink = isDark ? '#182C41' : '#ffffff'
  const inkSoft = isDark ? 'rgba(24, 44, 65, 0.75)' : 'rgba(255,255,255,0.85)'

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = INSTALL_CMD
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  function switchVideo(i: number) {
    if (i === activeVideo || isTransitioning) return
    setIsTransitioning(true)
    setActiveVideo(i)
    window.setTimeout(() => setIsTransitioning(false), 1000)
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video stack */}
      {VIDEOS.map((v, i) => (
        <video
          key={v.src}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === activeVideo ? 'opacity-100' : 'opacity-0'
          }`}
          src={v.src}
          autoPlay
          muted
          loop
          playsInline
        />
      ))}

      {/* Soft vignette */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

      {/* Transparent PNG overlay + train-bob */}
      <img
        src={OVERLAY}
        alt=""
        aria-hidden
        className="absolute inset-0 z-[1] w-full h-full object-cover pointer-events-none train-bob opacity-90 mix-blend-soft-light"
      />

      {/* Content */}
      <div className="relative z-[2] flex flex-col h-full px-4 sm:px-6 md:px-10 lg:px-14 py-5 sm:py-6">
        {/* Nav */}
        <nav className="flex items-center justify-between w-full">
          <a
            href="#"
            className="text-white italic text-xl sm:text-2xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            cycle-coded
          </a>

          {/* Desktop pill */}
          <div className="hidden md:flex items-center gap-1 liquid-glass-hero rounded-full pl-5 pr-1.5 py-1.5">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="px-3 py-2 text-sm text-white/90 hover:text-white transition-colors duration-300"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {n.label}
              </a>
            ))}
            <a
              href="https://github.com/AlbionaHoti/cycle-coded"
              className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-white text-black text-sm font-medium px-4 py-2 hover:bg-white/90 transition-colors"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              Get Started
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden relative w-11 h-11 liquid-glass-hero rounded-full flex items-center justify-center"
          >
            <Menu
              size={20}
              className={`absolute text-white transition-all duration-300 ${
                menuOpen ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'
              }`}
            />
            <X
              size={20}
              className={`absolute text-white transition-all duration-300 ${
                menuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'
              }`}
            />
          </button>
        </nav>

        {/* Mobile overlay */}
        <div
          className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${
            menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
          style={{ transitionTimingFunction: ease }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8">
            {NAV.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="text-white text-3xl py-2 transition-all duration-500"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  transitionTimingFunction: ease,
                  transitionDelay: menuOpen ? `${100 + i * 50}ms` : '0ms',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(1rem)',
                }}
              >
                {n.label}
              </a>
            ))}
            <a
              href="https://github.com/AlbionaHoti/cycle-coded"
              onClick={() => setMenuOpen(false)}
              className="mt-8 rounded-full bg-white text-black text-base font-medium px-8 py-3.5 transition-all duration-500"
              style={{
                fontFamily: 'system-ui, sans-serif',
                transitionTimingFunction: ease,
                transitionDelay: menuOpen ? '300ms' : '0ms',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'scale(1)' : 'scale(0.92)',
              }}
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Hero center */}
        <div className="flex-1 flex flex-col items-center justify-center text-center pt-6 pb-4">
          <div
            className="liquid-glass-hero rounded-full px-5 sm:px-6 py-2 sm:py-2.5 mb-6 sm:mb-8 transition-colors duration-700"
            style={{ color: ink, fontFamily: 'system-ui, sans-serif' }}
          >
            <span className="text-sm sm:text-base md:text-lg font-medium tracking-wide opacity-95">
              Agents that finally speak phase — local only ♡
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] max-w-4xl mb-5 sm:mb-6 transition-colors duration-700"
            style={{ fontFamily: "'Instrument Serif', serif", color: ink }}
          >
            Agents that know
            <br />
            what day it is
          </h1>

          <p
            className="max-w-xl text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 transition-colors duration-700 px-2"
            style={{ fontFamily: 'system-ui, sans-serif', color: inkSoft }}
          >
            Follicular you ships. Luteal you deletes. Mercury said no force-push.
            One skill — a dialect, not a wellness app.
          </p>

          {/* One install command — transparent glass on the video */}
          <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8 px-1">
            <div className="liquid-glass-hero rounded-2xl overflow-hidden text-left shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10">
                <span
                  className="text-[11px] sm:text-xs tracking-wide uppercase opacity-80"
                  style={{ fontFamily: 'ui-monospace, monospace', color: ink }}
                >
                  install · one command
                </span>
                <button
                  type="button"
                  onClick={copyInstall}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 px-3 py-1 text-[11px] sm:text-xs text-white transition-colors"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
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
                className="px-4 py-3.5 sm:py-4 text-[11px] sm:text-[13px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all m-0"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  color: ink,
                }}
              >
                <span className="opacity-70">$ </span>
                {INSTALL_CMD}
              </pre>
            </div>
            <p
              className="mt-3 text-[11px] sm:text-xs opacity-70 transition-colors duration-700"
              style={{ fontFamily: 'system-ui, sans-serif', color: ink }}
            >
              one command → Claude · Codex · Cursor · skills · web ONE_PROMPT.md
            </p>
          </div>

          {/* Video / phase switcher */}
          <div
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 transition-colors duration-700"
            style={{ fontFamily: 'system-ui, sans-serif', color: ink }}
          >
            {VIDEOS.map((v, i) => (
              <button
                key={v.label}
                type="button"
                onClick={() => switchVideo(i)}
                className={`text-xs sm:text-sm pb-1 border-b-2 transition-all duration-300 ${
                  i === activeVideo
                    ? 'opacity-100 border-current font-medium'
                    : 'opacity-50 border-transparent hover:opacity-80'
                }`}
              >
                <span className="block leading-tight">{v.label}</span>
                <span className="block text-[10px] opacity-60 mt-0.5 capitalize">
                  {v.phase}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom stats — always light on video */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/70 text-xs sm:text-sm pb-2"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          <span>4 Phase Modes</span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span>Claude · Codex · ChatGPT · Gemini · Grok</span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span>Local-First · No Cloud</span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span>Not Medical Advice ♡</span>
        </div>
      </div>
    </section>
  )
}
