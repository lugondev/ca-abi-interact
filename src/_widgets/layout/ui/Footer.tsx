import { ExternalLink } from "@shared/ui/ExternalLink";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="relative border-t border-border/30 bg-background/60 backdrop-blur-md mt-20 z-10">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-accent/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container mx-auto py-10 px-4 relative">
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm">
          <div className="flex items-center gap-6">
            <ExternalLink
              href="https://github.com/lugondev/ca-abi-interact"
              className="font-mono text-muted-foreground hover:text-primary transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(150,100,255,0.6)] uppercase text-xs tracking-wider"
            >
              ▸ GitHub
            </ExternalLink>
            <div className="h-5 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
            <ExternalLink
              href="https://x.com/bld3v"
              className="font-mono text-muted-foreground hover:text-accent transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,80,220,0.6)] uppercase text-xs tracking-wider"
            >
              ▸ Twitter
            </ExternalLink>
          </div>
          <div className="h-5 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden sm:block" />
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-success/20 blur-md group-hover:blur-lg transition-all duration-300" />
            <div className="relative flex items-center gap-2 px-5 py-2.5 rounded-md bg-card/80 border border-primary/20 group-hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Donations:</span>
              <code className="text-xs font-mono text-primary font-semibold select-all group-hover:text-accent transition-colors duration-300">
                0x4b4a931eede296628452d88e0cb4ed64663e3ef5
              </code>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-[0.2em]">
            Built with <span className="text-primary inline-block animate-pulse">◆</span> blockchain precision
          </p>
        </div>
      </div>
    </footer>
  );
};
