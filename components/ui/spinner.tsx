import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "default" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  default: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
}

export const Spinner = ({ size = "default", className }: SpinnerProps) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  )
}

