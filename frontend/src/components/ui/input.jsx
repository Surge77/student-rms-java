import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

/** Underlined ledger field — reads like a line to be filled in on a form. */
const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-none border-0 border-b border-foreground/30 bg-transparent px-1 py-1 text-sm text-foreground transition-colors duration-150 placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
