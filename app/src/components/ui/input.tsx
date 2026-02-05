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
          "flex h-11 w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400",
          "bg-white/80 border border-gray-200 backdrop-blur-sm",
          "hover:bg-white hover:border-gray-300",
          "focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          "transition-all duration-200",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-700",
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
