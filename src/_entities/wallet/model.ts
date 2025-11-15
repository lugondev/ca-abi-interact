import { TChainId, TAddress } from "@shared/lib/web3";
import { useCallback } from "react";
import { useWalletClient, useAccount, useSwitchChain } from "wagmi";

type TWalletModel = {
  address: TAddress | null;
};

export const useCurrentWallet = (): TWalletModel => {
  const { address } = useAccount();
  return { address: address || null };
};

export const useSwitchWalletChain = (chain: TChainId) => {
  const { data: walletClient } = useWalletClient();
  const { isConnected, address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const switchIfNeeded = useCallback(async () => {
    // Check if wallet is connected using useAccount (more reliable than walletClient)
    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }

    try {
      // Check if already on the correct chain
      if (chainId === Number(chain)) {
        return true; // Already on correct chain
      }

      // Use switchChainAsync which works even if walletClient is not ready
      await switchChainAsync({ chainId: Number(chain) });
      return true;
    } catch (e) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : typeof e === "string"
          ? e
          : "Failed to switch chain";
      
      // Re-throw with a more user-friendly message
      if (errorMessage.includes("rejected") || errorMessage.includes("denied")) {
        throw new Error("Chain switch was rejected by user");
      } else if (errorMessage.includes("not found") || errorMessage.includes("unsupported")) {
        throw new Error(`Chain ${chain} is not supported by your wallet`);
      } else {
        throw new Error(`Failed to switch chain: ${errorMessage}`);
      }
    }
  }, [chain, chainId, isConnected, address, switchChainAsync]);

  return switchIfNeeded;
};
