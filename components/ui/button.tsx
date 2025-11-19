import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-mono font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation active:scale-[0.96] relative overflow-hidden group uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/60 border border-primary/50 hover:bg-primary/90 hover:border-primary before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
        destructive:
          "bg-destructive text-white shadow-lg shadow-destructive/40 hover:shadow-xl hover:shadow-destructive/60 border border-destructive/50 hover:bg-destructive/90",
        outline:
          "border-2 border-primary/60 bg-transparent text-primary hover:bg-primary/15 hover:text-primary backdrop-blur-sm hover:border-primary hover:shadow-lg hover:shadow-primary/30 font-bold",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md hover:shadow-lg border border-border hover:border-border/80",
        ghost: "text-foreground hover:bg-accent/20 hover:text-accent backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-accent",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

