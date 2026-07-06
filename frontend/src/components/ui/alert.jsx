import { WarningCircle as AlertCircle } from '@phosphor-icons/react'
import { cn } from '../../lib/utils'

function Alert({ message, className }) {
  if (!message) return null
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-red-400',
        className
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export { Alert }
