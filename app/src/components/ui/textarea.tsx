import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400",
          "bg-white/80 border border-gray-200 backdrop-blur-sm",
          "hover:bg-white hover:border-gray-300",
          "focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          "transition-all duration-200",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
