import { cva, type VariantProps } from 'class-variance-authority'

// Class recipe shared by <Link>, <a>, and <button> so every action looks and
// moves the same way. Icons inside get a nudge on hover via `group`.
export const buttonVariants = cva(
  [
    'group inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap',
    'transition-all duration-300 ease-out select-none',
    'disabled:pointer-events-none disabled:opacity-60',
    '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-accent-foreground shadow-[0_0_0_0_hsl(var(--accent)/0.4)] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_hsl(var(--accent)/0.6)] active:translate-y-0 [&_svg]:group-hover:translate-x-0.5',
        secondary:
          'border border-foreground/20 bg-foreground/[0.03] text-foreground hover:-translate-y-0.5 hover:border-foreground/60 hover:bg-foreground/[0.07] active:translate-y-0',
        ghost:
          'text-muted-foreground hover:text-foreground [&_svg]:group-hover:translate-x-0.5 [&_svg]:group-hover:-translate-y-0.5',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-13 px-7 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
