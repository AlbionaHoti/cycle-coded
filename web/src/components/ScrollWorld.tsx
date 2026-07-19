/**
 * Scroll-scrubbed "fly through the cycle" — pattern inspired by
 * https://github.com/oso95/scroll-world (scroll drives time, scene chain,
 * mid-scene linger, route dots, crossfade seams). Original art/content for cycle-coded.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useScroll, useSpring, useTransform, motion } from 'framer-motion'

type Scene = {
  id: string
  label: string
  eyebrow: string
  title: string
  body: string
  header: string
  accent: string
  plate: string[]
}

const SCENES: Scene[] = [
  {
    id: 'menstrual',
    label: 'Bare min',
    eyebrow: '01 — power save',
    title: 'Bare minimum.',
    body: 'One action. Permission to stop. The laptop is optional and that is the point.',
    header: 'menstrual · day 2 · bare minimum',
    accent: '#c4a0b0',
    plate: [
      '         ˚  .·····.  ˚',
      '       .············.',
      '      ·····  ♡  ·····',
      '       ·············',
      '         ˚  ······  ˚',
    ],
  },
  {
    id: 'follicular',
    label: 'Building',
    eyebrow: '02 — green lights',
    title: 'Say yes.',
    body: 'Ambitious option + safe option + kill criteria. Follicular you ships the fun version.',
    header: 'follicular · day 12 · building',
    accent: '#ff9ec8',
    plate: [
      '         ˚  .····#@  ✦',
      '       .·······####@',
      '      ····· ♡  #####@',
      '       ········####@',
      '         ✦  ·····#@  ˚',
    ],
  },
  {
    id: 'ovulatory',
    label: 'Post it',
    eyebrow: '03 — main character',
    title: 'Make it land.',
    body: 'Walkthrough first. Screenshot moment. One line a group chat can retell.',
    header: 'ovulatory · day 14 · post it',
    accent: '#ff4d9a',
    plate: [
      '         ✦  @@@@@@@@  ✦',
      '       @@@@@@@@@@@@@@@@',
      '      @@@@@  ♡  @@@@@@@',
      '       @@@@@@@@@@@@@@@@',
      '         ˚  @@@@@@@@  ˚',
    ],
  },
  {
    id: 'luteal',
    label: 'Ruthless',
    eyebrow: '04 — mean bestie',
    title: "Don't redesign.",
    body: 'Cut scope. Name the hole. Ship the 40-line fix. Rewrite is ego until users complain.',
    header: 'luteal · day 23 · ruthless',
    accent: '#b794f6',
    plate: [
      '         ·  @@#···.  ✦',
      '       @@@##········.',
      '      @@@  ♡  ##·····',
      '       @@@##········.',
      '         ✦  @@#···.  ·',
    ],
  },
]

function clamp(x: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, x))
}

function smooth(x: number) {
  x = clamp(x)
  return x * x * (3 - 2 * x)
}

/** Mid-scene linger (scroll-world style) */
function lingerEase(x: number, L = 0.45) {
  L = clamp(L)
  const c = x - 0.5
  return (1 - L) * x + L * (4 * c * c * c + 0.5)
}

const VH_PER_SCENE = 1.45 // scroll height per scene in viewport units

export function ScrollWorld() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [localP, setLocalP] = useState(0)
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const spring = useSpring(scrollYProgress, {
    stiffness: reduce ? 400 : 90,
    damping: reduce ? 50 : 28,
  })

  // parallax depth on the active plate
  const plateScale = useTransform(spring, (v) => {
    const n = SCENES.length
    const raw = v * n
    const local = raw - Math.floor(raw)
    const eased = lingerEase(local)
    return 1.02 + eased * 0.12
  })

  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      const n = SCENES.length
      const raw = clamp(v, 0, 0.9999) * n
      const idx = Math.min(n - 1, Math.floor(raw))
      const local = lingerEase(raw - idx)
      setActive(idx)
      setLocalP(local)
    })
    return () => unsub()
  }, [spring])

  const trackHeight = useMemo(() => `${SCENES.length * VH_PER_SCENE * 100}vh`, [])

  function jumpTo(i: number) {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const top = window.scrollY + rect.top
    const h = el.offsetHeight - window.innerHeight
    const t = (i + 0.5) / SCENES.length
    window.scrollTo({ top: top + h * t, behavior: reduce ? 'auto' : 'smooth' })
  }

  const scene = SCENES[active]

  return (
    <section id="world" className="relative z-10">
      <div ref={trackRef} style={{ height: trackHeight }} className="relative">
        {/* sticky stage — scroll-world pattern */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* atmosphere */}
          <div
            className="absolute inset-0 transition-colors duration-700"
            style={{
              background: `radial-gradient(70% 50% at 70% 30%, ${scene.accent}33, transparent 70%), linear-gradient(180deg, #fff5f9 0%, #ffe8f2 50%, #fff0f6 100%)`,
            }}
          />
          <div className="absolute inset-0 opacity-40">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-hot/30"
                style={{
                  width: 4 + (i % 3) * 3,
                  height: 4 + (i % 3) * 3,
                  left: `${8 + ((i * 17) % 84)}%`,
                  top: `${10 + ((i * 23) % 70)}%`,
                  opacity: 0.2 + (i % 5) * 0.1,
                }}
              />
            ))}
          </div>

          {/* top bar */}
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 md:px-12 py-5">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink/50">
              scroll to fly the cycle
            </p>
            <p className="font-mono text-[10px] tracking-[0.12em] text-ink/40">
              {String(active + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
            </p>
          </div>

          {/* route dots — right rail */}
          <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-5">
            <div className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-hot/20" />
            {SCENES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => jumpTo(i)}
                className="relative z-10 group flex items-center justify-center w-4 h-4"
                aria-label={s.label}
              >
                <i
                  className={`block rounded-full transition-all duration-300 ${
                    i === active
                      ? 'w-3 h-3 scale-125 shadow-[0_0_0_4px_rgba(255,77,154,0.2)]'
                      : 'w-2 h-2 opacity-40 group-hover:opacity-80'
                  }`}
                  style={{ background: i === active ? s.accent : '#ff9ec8' }}
                />
                <span className="absolute right-6 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-white/90 border border-hot/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          {/* stage content */}
          <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-6 sm:px-10 md:px-16 lg:px-24">
            {/* plate / "camera subject" */}
            <motion.div
              className="flex-shrink-0 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px]"
              style={{ scale: reduce ? 1 : plateScale }}
            >
              <div
                className="rounded-[2rem] p-8 md:p-10 border shadow-[0_30px_80px_rgba(255,77,154,0.15)] backdrop-blur-md transition-colors duration-500"
                style={{
                  borderColor: `${scene.accent}44`,
                  background: `linear-gradient(160deg, #fff 0%, ${scene.accent}22 100%)`,
                }}
              >
                <pre
                  className="font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed text-center select-none"
                  style={{ color: scene.accent }}
                >
                  {scene.plate.join('\n')}
                </pre>
                <p className="mt-6 text-center font-mono text-[10px] tracking-widest uppercase text-ink/40">
                  {scene.header}
                </p>
              </div>
            </motion.div>

            {/* copy — peaks mid-scene (scroll-world copy opacity curve) */}
            <div className="w-full max-w-md md:max-w-lg">
              {SCENES.map((s, i) => {
                // opacity peaks at mid local progress for active, fades for others
                let op = 0
                if (i === active) {
                  op = smooth(1 - Math.abs(localP - 0.5) / 0.5)
                  if (i === 0 && localP < 0.35) op = Math.max(op, smooth(1 - localP / 0.35))
                  if (i === SCENES.length - 1 && localP > 0.5)
                    op = Math.max(op, smooth((localP - 0.35) / 0.5))
                }
                return (
                  <div
                    key={s.id}
                    className="absolute md:relative md:absolute md:inset-y-0 md:flex md:items-center pointer-events-none"
                    style={{
                      opacity: op,
                      transform: reduce
                        ? undefined
                        : `translateY(${(0.5 - (i === active ? localP : 0.5)) * 24}px)`,
                      transition: 'opacity 0.05s linear',
                      // only active block takes space on mobile
                      position: i === active ? 'relative' : 'absolute',
                      visibility: op < 0.02 ? 'hidden' : 'visible',
                    }}
                  >
                    <div className="pointer-events-auto">
                      <p
                        className="font-mono text-[11px] tracking-[0.16em] uppercase mb-3"
                        style={{ color: s.accent }}
                      >
                        {s.eyebrow}
                      </p>
                      <h2 className="hero-heading text-4xl sm:text-5xl md:text-6xl text-ink leading-[0.95] mb-4">
                        {s.title}
                      </h2>
                      <p className="text-ink/60 text-base md:text-lg leading-relaxed max-w-md mb-5">
                        {s.body}
                      </p>
                      <code
                        className="inline-block font-mono text-xs rounded-full px-3 py-1.5"
                        style={{
                          color: s.accent,
                          background: `${s.accent}18`,
                        }}
                      >
                        {s.header}
                      </code>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* bottom progress for this world */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-hot/10">
            <motion.div
              className="h-full origin-left"
              style={{
                scaleX: spring,
                background: scene.accent,
              }}
            />
          </div>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/35 flex flex-col items-center gap-2">
            scroll
            <span className="block w-5 h-8 rounded-full border border-ink/20 relative">
              <span
                className="absolute left-1/2 -translate-x-1/2 top-1.5 w-1 h-1.5 rounded-full bg-hot animate-bounce"
              />
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
