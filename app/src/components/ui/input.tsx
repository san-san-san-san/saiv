import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500",
          "bg-white/5 border border-white/10 backdrop-blur-sm",
          "hover:bg-white/8 hover:border-white/15",
          "focus:outline-none focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20",
          "transition-all duration-200",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
