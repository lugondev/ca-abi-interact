import { useState } from "react";
import { TAddress, shortenAddress } from "@shared/lib/web3";
import { AddressIcon } from "../AddressIcon";
import { ExternalLink } from "../ExternalLink";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

type TProps = {
  value: TAddress;
  explorerUrl?: string;
  shorten?: boolean;
};

export const AddressValue = ({
  value,
  explorerUrl,
  shorten = true,
}: TProps) => {
  const [copied, setCopied] = useState(false);
  const displayValue = shorten ? shortenAddress(value) : value;

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
    <div className="flex items-center gap-1 min-w-0">
      <AddressIcon address={value} size="small" className="flex-shrink-0" />
      <span className="font-mono text-xs min-w-0">
        {explorerUrl ? (
          <ExternalLink
            href={explorerUrl}
            className="hover:underline break-all"
          >
            {displayValue}
          </ExternalLink>
        ) : (
          <span className="break-all">{displayValue}</span>
        )}
      </span>
      <Button
        onClick={handleCopy}
        variant="ghost"
        size="sm"
        className="flex-shrink-0 h-5 w-5 p-0"
      >
        {copied ? (
          <Check className="h-2.5 w-2.5 text-green-500" />
        ) : (
          <Copy className="h-2.5 w-2.5" />
        )}
      </Button>
    </div>
  );
};
