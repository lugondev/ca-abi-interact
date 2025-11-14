import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type TProps = {
  value: string;
  className?: string;
  copyable?: boolean;
};

export const ValueDisplay = ({ value, className, copyable = true }: TProps) => {
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

  return (
    <div className="flex items-start gap-2 w-full min-w-0">
      <span
        className={cn(
          "font-mono text-sm break-all flex-1 min-w-0",
          className
        )}
      >
        {value}
      </span>
      {copyable && (
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="flex-shrink-0 h-6 w-6 p-0"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      )}
    </div>
  );
};

