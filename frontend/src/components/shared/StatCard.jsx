import { cn } from '../../lib/utils'

/** Ledger record card: an index number, a big Caslon figure, a ruled footer. */
export function StatCard({ title, value, icon: Icon, description, index, className }) {
  return (
    <div className={cn('sheet group relative overflow-hidden rounded-sm p-5', className)}>
      {/* Corner index tab */}
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {index ? `№ ${index}` : ''}
        </span>
        {Icon && (
          <Icon
            className="h-4 w-4 text-primary/70 transition-colors group-hover:text-primary"
            weight="duotone"
          />
        )}
      </div>
      <p className="font-display text-4xl leading-none text-foreground">{value}</p>
      <div className="mt-4 border-t border-border pt-2.5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/80">
          {title}
        </p>
        {description && (
          <p className="mt-0.5 text-[13px] italic text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}
