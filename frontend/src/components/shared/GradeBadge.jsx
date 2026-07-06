import { cn } from '../../lib/utils'

const gradeStyles = {
  A_PLUS: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
  A: 'border-green-500/40 bg-green-500/15 text-green-400',
  B: 'border-blue-500/40 bg-blue-500/15 text-blue-400',
  C: 'border-yellow-500/40 bg-yellow-500/15 text-yellow-400',
  D: 'border-orange-500/40 bg-orange-500/15 text-orange-400',
  F: 'border-red-500/40 bg-red-500/15 text-red-400',
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
  const style = gradeStyles[grade] ?? 'border-border bg-muted text-muted-foreground'
  const label = gradeLabels[grade] ?? grade

  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-2 py-0.5 text-xs font-bold tabular-nums',
        style,
        className
      )}
    >
      {label}
    </span>
  )
}
