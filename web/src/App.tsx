import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, Copy, Menu, X } from 'lucide-react'

/**
 * Single-screen landing: cinematic train view + what cycle-coded is + one install.
 * Reverts to video + train-window overlay (not WebGL plane).
 */

const INSTALL_CMD = `git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded && cd cycle-coded && bash install.sh`

/** Soft exterior light — feels like looking out a train window */
const VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4'

/** Local train-frame overlay (looking outside) */
const TRAIN_FRAME = '/train-window.png'

const ease = 'cubic-bezier(0.4, 0, 0.2, 1)'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

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

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Exterior through the window */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Soft grade */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/55 via-black/15 to-black/35 pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-pink-500/10 mix-blend-soft-light pointer-events-none" />

      {/* Train frame — looking outside */}
      <img
        src={TRAIN_FRAME}
        alt=""
        aria-hidden
        className="absolute inset-0 z-[2] w-full h-full object-cover pointer-events-none train-bob"
      />

      {/* Content */}
      <div className="relative z-[3] flex flex-col h-full px-4 sm:px-6 md:px-10 lg:px-14 py-5 sm:py-6">
        <nav className="flex items-center justify-between w-full">
          <a
            href="https://github.com/AlbionaHoti/cycle-coded"
            className="text-white italic text-xl sm:text-2xl drop-shadow-md"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            cycle-coded
          </a>

          <div className="hidden md:flex items-center gap-1 liquid-glass-hero rounded-full pl-5 pr-1.5 py-1.5">
            <a
              href="https://github.com/AlbionaHoti/cycle-coded"
              className="px-3 py-2 text-sm text-white/90 hover:text-white transition-colors"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              GitHub
            </a>
            <a
              href="https://github.com/AlbionaHoti/cycle-coded/blob/main/INSTALL.md"
              className="px-3 py-2 text-sm text-white/90 hover:text-white transition-colors"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              Docs
            </a>
            <a
              href="https://github.com/AlbionaHoti/cycle-coded"
              className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-white text-black text-sm font-medium px-4 py-2 hover:bg-white/90 transition-colors"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              Star
              <ArrowUpRight size={14} />
            </a>
          </div>

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

        {/* Mobile menu */}
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8">
            <a
              href="https://github.com/AlbionaHoti/cycle-coded"
              className="text-white text-3xl"
              style={{ fontFamily: "'Instrument Serif', serif" }}
              onClick={() => setMenuOpen(false)}
            >
              GitHub
            </a>
            <a
              href="https://github.com/AlbionaHoti/cycle-coded/blob/main/INSTALL.md"
              className="text-white text-3xl"
              style={{ fontFamily: "'Instrument Serif', serif" }}
              onClick={() => setMenuOpen(false)}
            >
              Docs
            </a>
          </div>
        </div>

        {/* Hero — what it is (girl dynamics, not product jargon) */}
        <div className="flex-1 flex flex-col items-center justify-center text-center pt-4 pb-4">
          <p
            className="liquid-glass-hero rounded-full px-5 sm:px-6 py-2 sm:py-2.5 mb-5 sm:mb-6 text-white text-sm sm:text-base md:text-lg font-medium tracking-wide"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            Your agent finally gets the week you&apos;re actually in
          </p>

          <h1
            className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.08] max-w-4xl mb-4 sm:mb-5 drop-shadow-2xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            cycle-coded
          </h1>

          <p
            className="max-w-xl text-white/90 text-base sm:text-lg md:text-xl leading-snug mb-5 sm:mb-6 px-3"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            PMS is not &ldquo;be nicer.&rdquo; Luteal is not &ldquo;push through.&rdquo;
            <br className="hidden sm:block" />
            Some weeks you&apos;re built to run, launch, pitch, sell, brand.
            <br className="hidden sm:block" />
            Some weeks you&apos;re built to cut, protect, and say no.
          </p>
          <p
            className="max-w-lg text-white/70 text-xs sm:text-sm leading-relaxed mb-8 sm:mb-10 px-3"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            Same question. Different day. Different correct answer.
            A skill so Claude, Codex, ChatGPT, Gemini, Grok stop talking like every Tuesday is the same.
            Your cycle data stays on your machine.
          </p>

          {/* One install */}
          <div className="w-full max-w-xl mx-auto px-1">
            <div className="liquid-glass-hero rounded-2xl overflow-hidden text-left shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10">
                <span
                  className="text-[11px] sm:text-xs tracking-wide uppercase text-white/75"
                  style={{ fontFamily: 'ui-monospace, monospace' }}
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
                className="px-4 py-3.5 text-[11px] sm:text-[12px] leading-relaxed text-white/95 overflow-x-auto whitespace-pre-wrap break-all m-0"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                }}
              >
                <span className="text-white/50">$ </span>
                {INSTALL_CMD}
              </pre>
            </div>
            <p
              className="mt-3 text-[11px] sm:text-xs text-white/55"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              then <code className="text-white/75">/cycle-coded</code> or paste{' '}
              <code className="text-white/75">ONE_PROMPT.md</code> · not medical advice
            </p>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-white/55 text-xs sm:text-sm pb-1"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          <span>phase modes</span>
          <span className="opacity-40">·</span>
          <span>local-first</span>
          <span className="opacity-40">·</span>
          <span>no cloud</span>
        </div>
      </div>
    </section>
  )
}
