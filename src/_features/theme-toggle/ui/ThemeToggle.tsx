"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@shared/lib/theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative h-10 w-10 rounded-lg overflow-hidden group",
        "hover:bg-accent/30 transition-all duration-500"
      )}
      aria-label="Toggle theme"
    >
      {/* Sun icon for light mode */}
      <Sun
        className={cn(
          "absolute h-5 w-5 transition-all duration-500 text-accent",
          theme === "dark"
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
      />

      {/* Moon icon for dark mode */}
      <Moon
        className={cn(
          "absolute h-5 w-5 transition-all duration-500 text-primary",
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        )}
      />

      {/* Animated glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
          theme === "dark" ? "bg-primary/20" : "bg-accent/20"
        )}
      />
    </Button>
  );
};
