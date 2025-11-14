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
        <button className="flex gap-2 items-center px-2 sm:px-3 py-1.5 rounded-2xl text-xs sm:text-sm bg-blue-50 border border-blue-800 hover:bg-blue-100 transition-colors cursor-pointer">
          <AddressIcon size="small" address={wallet} />
          <span>{shortAddress}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
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
