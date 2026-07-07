/** Engraved registrar's seal — concentric rings, a star, radial ticks.
    Used as the wordmark glyph and on the report-card / auth certificate. */
export function Seal({ className = 'h-9 w-9' }) {
  const ticks = Array.from({ length: 36 })
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="1" />
      {ticks.map((_, i) => {
        const a = (i / ticks.length) * Math.PI * 2
        const r1 = 42
        const r2 = i % 3 === 0 ? 36 : 38.5
        return (
          <line
            key={i}
            x1={50 + Math.cos(a) * r1}
            y1={50 + Math.sin(a) * r1}
            x2={50 + Math.cos(a) * r2}
            y2={50 + Math.sin(a) * r2}
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.7"
          />
        )
      })}
      {/* Five-point star at centre */}
      <path
        d={starPath(50, 50, 13, 5.5, 5)}
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  )
}

function starPath(cx, cy, outer, inner, points) {
  let d = ''
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
    d += `${i === 0 ? 'M' : 'L'}${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`
  }
  return d + 'Z'
}
