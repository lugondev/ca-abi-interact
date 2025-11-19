"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tools = [
  { name: "Eth Unit Converter", href: "/tools/eth-unit-converter" },
  { name: "Token Unit Converter", href: "/tools/token-unit-converter" },
  { name: "Epoch Converter", href: "/tools/epoch-converter" },
  { name: "Base Converter", href: "/tools/base-converter" },
  { name: "String Bytes32", href: "/tools/string-bytes32" },
  { name: "Calldata Decoder", href: "/tools/calldata-decoder" },
];

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <nav className="flex flex-col space-y-1 p-2 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
              <h2 className="font-display font-bold text-xl mb-3 px-3 pt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TOOLS
              </h2>
              {tools.map((tool) => {
                const isActive = pathname === tool.href;

                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={cn(
                      "relative px-4 py-2.5 rounded-md font-mono text-sm font-semibold transition-all duration-300 group",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isActive && <span className="text-accent">▸</span>}
                      {tool.name}
                    </span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent rounded-md" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
