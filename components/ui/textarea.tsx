import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-md border border-input/50 bg-background/60 backdrop-blur-sm px-4 py-2 text-sm font-mono transition-all duration-300 ring-offset-background placeholder:text-muted-foreground/50 placeholder:font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:bg-background/80 hover:border-primary/30 hover:bg-background/70 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation resize-y shadow-sm focus-visible:shadow-lg focus-visible:shadow-primary/20",
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

