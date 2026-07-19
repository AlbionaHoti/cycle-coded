import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

type Props = {
  text: string
  delay?: number
  className?: string
  as?: 'span' | 'p' | 'h1' | 'h2'
}

export function StaggeredFade({
  text,
  delay = 0.05,
  className = '',
  as = 'span',
}: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const Tag = as

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{
            delay: i * delay,
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </Tag>
  )
}
