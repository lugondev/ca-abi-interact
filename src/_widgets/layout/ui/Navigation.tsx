"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TPageLink = {
  path: string;
  title: string;
};

type TProps = {
  pages: TPageLink[];
};

export const Navigation = ({ pages }: TProps) => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {pages.map(({ path, title }) => {
        // Check if current path is active
        const isActive = path === "/"
          ? pathname === "/"
          : pathname === path || pathname?.startsWith(path + "/") || pathname?.startsWith(path + "?");

        return (
          <Link
            key={path}
            href={path}
            className={cn(
              "relative px-2 lg:px-4 py-2 text-sm font-mono font-bold transition-all duration-300 whitespace-nowrap group uppercase tracking-wide",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="relative z-10">{title}</span>
            <div className={cn(
              "absolute inset-0 rounded-lg transition-all duration-300",
              isActive
                ? "bg-primary/20 border border-primary/40"
                : "bg-primary/0 group-hover:bg-primary/10 border border-transparent"
            )} />
            <div className={cn(
              "absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300",
              isActive
                ? "w-full shadow-[0_0_10px_rgba(150,100,255,0.8)]"
                : "w-0 group-hover:w-full"
            )} />
          </Link>
        );
      })}
    </nav>
  );
};
