import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive/20 text-red-400 border-destructive/30',
        outline: 'border-border text-foreground',
        success: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
        warning: 'border-yellow-500/30 bg-yellow-500/15 text-yellow-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
