import { ExternalLink } from "@shared/ui/ExternalLink";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <ExternalLink href="https://github.com/olekon/justsmartcontracts">
            GitHub
          </ExternalLink>
          <Separator orientation="vertical" className="h-4" />
          <ExternalLink href="mailto:contact@justsmartcontracts.dev">
            Email
          </ExternalLink>
          <Separator orientation="vertical" className="h-4" />
          <p className="text-xs">Donations: 0x6d661B87C66D717F688d47796D7068B41D0a8730</p>
        </div>
      </div>
    </footer>
  );
};
