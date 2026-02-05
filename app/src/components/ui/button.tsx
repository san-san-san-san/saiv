import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_40px_rgba(147,51,234,0.5)] hover:shadow-[0_0_50px_rgba(147,51,234,0.6)] hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-red-600/80 hover:bg-red-500 text-white shadow-[0_4px_14px_-3px_rgba(239,68,68,0.4)] hover:shadow-[0_8px_20px_-4px_rgba(239,68,68,0.5)] hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 text-slate-200",
        secondary:
          "bg-white/5 text-slate-200 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/15 hover:text-white",
        ghost:
          "text-slate-400 hover:text-white hover:bg-white/5",
        link:
          "text-purple-400 underline-offset-4 hover:underline hover:text-purple-300",
        white:
          "bg-white text-purple-600 border-0 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
