import * as React from "react"
import { cn } from "@/lib/utils"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  success?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, success = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex min-h-16 w-full min-w-0 rounded-xl border-0 bg-muted px-3 py-2 text-sm md:text-lg shadow-xs transition-[color,box-shadow] outline-none field-sizing-content disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          success && "bg-success-foreground ring-success ring-3 transition-all focus-visible:ring-success",
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
export type { TextareaProps }