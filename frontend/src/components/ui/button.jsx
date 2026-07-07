import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-px',
  {
    variants: {
      variant: {
        // The inked authority button — oxblood with a pressed shadow.
        default:
          'bg-primary text-primary-foreground shadow-[2px_2px_0_0_hsl(var(--foreground)/0.85)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_hsl(var(--foreground)/0.85)] active:translate-x-0 active:translate-y-0 active:shadow-none',
        destructive:
          'bg-destructive text-destructive-foreground shadow-[2px_2px_0_0_hsl(var(--foreground)/0.85)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_hsl(var(--foreground)/0.85)] active:translate-x-0 active:translate-y-0 active:shadow-none',
        outline:
          'border border-foreground/40 bg-transparent hover:bg-foreground/[0.05] hover:border-foreground/70',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/70',
        ghost: 'hover:bg-foreground/[0.06] hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-sm px-3 text-xs',
        lg: 'h-10 rounded-sm px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
})
Button.displayName = 'Button'

export { Button, buttonVariants }
