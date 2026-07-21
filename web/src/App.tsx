import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, useProgress, Html } from '@react-three/drei'
import { Check, Copy } from 'lucide-react'
import { TrainScene } from './components/TrainScene'

const INSTALL_CMD = `git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded && cd cycle-coded && bash install.sh`

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div
        className="text-white/80 text-sm tracking-widest uppercase"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        {progress.toFixed(0)}%
      </div>
    </Html>
  )
}

function Hud() {
  const [copied, setCopied] = useState(false)

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
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      {/* top brand */}
      <header className="pointer-events-auto flex items-center justify-between px-5 sm:px-8 pt-6 sm:pt-8">
        <a
          href="https://github.com/AlbionaHoti/cycle-coded"
          className="text-white italic text-xl sm:text-2xl drop-shadow-lg"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          cycle-coded
        </a>
        <span
          className="text-white/70 text-[10px] sm:text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          scroll to fly
        </span>
      </header>

      {/* center title — minimal */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p
          className="liquid-glass-hero rounded-full px-5 py-2 mb-5 text-white text-sm sm:text-base font-medium tracking-wide pointer-events-auto"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          Agents that finally speak phase — local only ♡
        </p>
        <h1
          className="text-white text-4xl sm:text-5xl md:text-7xl leading-[1.08] max-w-3xl drop-shadow-2xl mb-8"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Agents that know
          <br />
          what day it is
        </h1>

        {/* single transparent install */}
        <div className="pointer-events-auto w-full max-w-xl mx-auto">
          <div className="liquid-glass-hero rounded-2xl overflow-hidden text-left border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10">
              <span
                className="text-[11px] tracking-wide uppercase text-white/75"
                style={{ fontFamily: 'ui-monospace, monospace' }}
              >
                install · one command
              </span>
              <button
                type="button"
                onClick={copyInstall}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 px-3 py-1 text-[11px] text-white transition-colors"
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
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
            >
              <span className="text-white/50">$ </span>
              {INSTALL_CMD}
            </pre>
          </div>
        </div>
      </div>

      <footer
        className="pb-6 sm:pb-8 text-center text-white/45 text-[10px] sm:text-xs tracking-wide"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        scroll · one image · local only · not medical advice
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#12030a]">
      <Hud />

      <Canvas
        className="absolute inset-0"
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 2.4], fov: 45, near: 0.1, far: 50 }}
      >
        <color attach="background" args={['#12030a']} />
        <fogExp2 attach="fog" args={['#1a0812', 0.03]} />
        <ambientLight intensity={0.9} />

        <Suspense fallback={<Loader />}>
          {/* pages=3 → extra scroll height for fly-through */}
          <ScrollControls pages={2.4} damping={0.18}>
            <TrainScene />
            {/* empty scroll spacer (HUD is DOM, not Scroll html) */}
            <Scroll />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}
