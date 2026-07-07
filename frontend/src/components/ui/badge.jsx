import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'border-primary/40 bg-primary/10 text-primary',
        secondary: 'border-ink-blue/40 bg-ink-blue/10 text-ink-blue',
        destructive: 'border-destructive/40 bg-destructive/10 text-destructive',
        outline: 'border-foreground/40 text-foreground',
        success: 'border-ink-green/40 bg-ink-green/12 text-ink-green',
        warning: 'border-ink-amber/40 bg-ink-amber/12 text-ink-amber',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
