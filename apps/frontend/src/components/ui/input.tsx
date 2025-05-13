import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, iconLeft, iconRight, success = false, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full max-w-[32rem]">
        {iconLeft && (
          <div className={cn(
            "absolute left-3 flex items-center pointer-events-none text-muted-foreground",
            success && "text-success transition-colors"
          )}>
            {iconLeft}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          data-slot="input"
          className={cn(
            "file:text-foreground max-w-[32rem] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-13 w-full min-w-0 rounded-xl border-3 bg-muted px-3 py-1 text-sm md:text-lg shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            success && "bg-success-foreground border-success transition-colors focus-visible:border-success focus-visible:ring-success/15",
            iconLeft && "pl-12",
            iconRight && "pr-12",
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 flex items-center text-muted-foreground">
            {iconRight}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
export type { InputProps }