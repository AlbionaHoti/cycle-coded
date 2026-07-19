import { useState } from 'react'

type Props = {
  label: string
  code: string
}

export function CopyBlock({ label, code }: Props) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{label}</span>
        <button
          type="button"
          className={`copy-btn${copied ? ' copied' : ''}`}
          onClick={onCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="code-pre">
        {code.split('\n').map((line, i) => {
          const isComment = line.trim().startsWith('#')
          const parts = line.split(/(\s+)/)
          return (
            <div key={i}>
              {isComment ? (
                <span className="opacity-45">{line || ' '}</span>
              ) : (
                parts.map((p, j) =>
                  j === 0 && p && !p.match(/^\s/) ? (
                    <span key={j} className="cmd">
                      {p}
                    </span>
                  ) : (
                    <span key={j}>{p}</span>
                  ),
                )
              )}
            </div>
          )
        })}
      </pre>
    </div>
  )
}
