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
          "flex h-11 sm:h-10 w-full rounded-md border border-input/50 bg-background/60 backdrop-blur-sm px-4 py-2 text-sm font-mono transition-all duration-300 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/50 placeholder:font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:bg-background/80 hover:border-primary/30 hover:bg-background/70 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation shadow-sm focus-visible:shadow-lg focus-visible:shadow-primary/20",
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

