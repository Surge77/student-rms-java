import { cn } from '../../lib/utils'

/* Each grade is a rubber stamp, inked in the appropriate colour and pressed
   onto the page at a slight, hand-placed angle. */
const gradeStyles = {
  A_PLUS: 'border-ink-green/60 bg-ink-green/10 text-ink-green',
  A: 'border-ink-green/55 bg-ink-green/10 text-ink-green',
  B: 'border-ink-blue/55 bg-ink-blue/10 text-ink-blue',
  C: 'border-ink-amber/55 bg-ink-amber/10 text-ink-amber',
  D: 'border-ink-amber/60 bg-ink-amber/12 text-ink-amber',
  F: 'border-ink-red/60 bg-ink-red/10 text-ink-red',
}

const gradeLabels = {
  A_PLUS: 'A+',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  F: 'F',
}

export function GradeBadge({ grade, className }) {
  const style = gradeStyles[grade] ?? 'border-foreground/40 bg-muted text-muted-foreground'
  const label = gradeLabels[grade] ?? grade

  return (
    <span
      className={cn(
        'stamp min-w-[2.1rem] rounded-sm border-[1.5px] px-1.5 py-0.5 text-xs tabular-nums',
        style,
        className
      )}
      style={{ transform: 'rotate(-3deg)' }}
    >
      {label}
    </span>
  )
}
