import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type TProps = {
  value: string;
  className?: string;
};

export const JsonDisplay = ({ value, className }: TProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Simple syntax highlighting for JSON
  const highlightJson = (json: string) => {
    return json
      .replace(/(".*?")(:)/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>$2')
      .replace(/: (".*?")/g, ': <span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/: (\d+)/g, ': <span class="text-orange-600 dark:text-orange-400">$1</span>')
      .replace(/: (true|false|null)/g, ': <span class="text-purple-600 dark:text-purple-400">$1</span>');
  };

  return (
    <div className={cn("relative w-full min-w-0", className)}>
      <div className="absolute top-2 right-2 z-10">
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 bg-background/80 hover:bg-background"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <pre
        className="bg-muted/50 rounded-md p-3 pr-10 overflow-x-auto text-xs font-mono break-all whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: highlightJson(value) }}
      />
    </div>
  );
};

