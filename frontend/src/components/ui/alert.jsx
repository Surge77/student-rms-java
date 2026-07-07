import { WarningCircle as AlertCircle } from '@phosphor-icons/react'
import { cn } from '../../lib/utils'

/** Examiner's correction note — red margin tick + inked text. */
function Alert({ message, className }) {
  if (!message) return null
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 border-l-2 border-destructive bg-destructive/[0.07] px-3.5 py-2.5 text-sm text-destructive',
        className
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" weight="fill" />
      <span>{message}</span>
    </div>
  )
}

export { Alert }
