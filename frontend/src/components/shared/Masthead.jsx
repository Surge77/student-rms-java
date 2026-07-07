/** Editorial page masthead: an index number, a Caslon title, ruled underline,
    and an optional right-aligned meta line + action. */
export function Masthead({ index, title, subtitle, meta, action }) {
  return (
    <header className="ink-rise mb-8">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {index && (
            <p className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-primary">
              № {index}
            </p>
          )}
          <h1 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
            {title}
          </h1>
        </div>
        {action && <div className="flex-shrink-0 pb-1">{action}</div>}
      </div>
      <div className="double-rule mt-3" />
      {(subtitle || meta) && (
        <div className="mt-2 flex items-center justify-between">
          {subtitle ? (
            <p className="text-[13px] italic text-muted-foreground">{subtitle}</p>
          ) : (
            <span />
          )}
          {meta && (
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {meta}
            </p>
          )}
        </div>
      )}
    </header>
  )
}
