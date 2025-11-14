import { ExternalLink } from "@shared/ui/ExternalLink";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <ExternalLink href="https://github.com/lugondev/ca-abi-interact">
            GitHub
          </ExternalLink>
          <Separator orientation="vertical" className="h-4" />
          <ExternalLink href="https://x.com/bld3v">Twitter</ExternalLink>
          <Separator orientation="vertical" className="h-4" />
          <p className="text-xs">Donations: 0x0</p>
        </div>
      </div>
    </footer>
  );
};
