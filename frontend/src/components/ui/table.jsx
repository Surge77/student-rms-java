import { cn } from '../../lib/utils'

/** Ledger table: engraved frame, ruled rows, small-caps header. */
function Table({ className, ...props }) {
  return (
    <div className="sheet relative w-full overflow-auto rounded-sm">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      className={cn('border-b-[3px] border-double border-foreground/50 bg-muted/40', className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      className={cn(
        '[&_tr:last-child]:border-0 [&_tr:nth-child(even)]:bg-foreground/[0.025]',
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        'border-b border-border transition-colors hover:bg-primary/[0.05]',
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        'h-11 px-4 text-left align-middle font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }) {
  return (
    <td className={cn('px-4 py-3 align-middle text-foreground', className)} {...props} />
  )
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
