"use client";

import { TAddress } from "@shared/lib/web3";
import { AddressIcon } from "@shared/ui/AddressIcon";
import { chainModel } from "@entities/chain";
import { useDisconnect } from "wagmi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, Copy, LogOut, ChevronDown } from "lucide-react";
import { useNotifications } from "@shared/lib/notify";

type TProps = {
  wallet: TAddress;
};

export const WalletCard = ({ wallet }: TProps) => {
  const shortAddress = `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  const { chain } = chainModel.useCurrentChain();
  const { getAddressUrl } = chainModel.useChainExplorer(chain);
  const { disconnect } = useDisconnect();
  const notify = useNotifications();

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet);
      notify("Address copied to clipboard", "success");
    } catch (error) {
      notify("Failed to copy address", "error");
    }
  };

  const handleOpenExplorer = () => {
    const url = getAddressUrl(wallet);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative group flex gap-2 items-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-mono font-semibold bg-success/10 border-2 border-success/40 text-success hover:bg-success/20 hover:border-success/60 hover:shadow-lg hover:shadow-success/20 transition-all duration-300 cursor-pointer uppercase tracking-wide">
          <div className="absolute inset-0 bg-gradient-to-r from-success/0 via-success/10 to-success/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          <AddressIcon size="small" address={wallet} />
          <span className="relative z-10">{shortAddress}</span>
          <ChevronDown className="h-3 w-3 opacity-70 relative z-10" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleOpenExplorer}>
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>Open in Explorer</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Address</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
