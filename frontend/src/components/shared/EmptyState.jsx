import { cn } from '../../lib/utils'

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted/50">
        {Icon ? (
          <Icon className="h-6 w-6 text-muted-foreground" />
        ) : (
          <span className="text-2xl text-muted-foreground">—</span>
        )}
      </div>
      <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-4 max-w-xs text-sm text-muted-foreground">{description}</p>
      )}
      {action}
    </div>
  )
}
