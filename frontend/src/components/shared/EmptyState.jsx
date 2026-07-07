import { cn } from '../../lib/utils'

/** A blank page in the ledger — nothing recorded here yet. */
export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        'sheet flex flex-col items-center justify-center rounded-sm px-6 py-16 text-center',
        className
      )}
    >
      <div className="engraved mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-card">
        {Icon ? (
          <Icon className="h-6 w-6 text-muted-foreground" weight="duotone" />
        ) : (
          <span className="font-display text-2xl text-muted-foreground">—</span>
        )}
      </div>
      <h3 className="font-display text-xl text-foreground">{title}</h3>
      {description && (
        <p className="mb-5 mt-1 max-w-xs text-sm italic text-muted-foreground">{description}</p>
      )}
      {action}
    </div>
  )
}
