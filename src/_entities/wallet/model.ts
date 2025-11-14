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
  const { switchChainAsync } = useSwitchChain();

  const switchIfNeeded = useCallback(async () => {
    if (walletClient) {
      try {
        const walletChain = await walletClient.getChainId();
        if (walletChain !== Number(chain)) {
          await switchChainAsync({ chainId: Number(chain) });
        }
        return true;
      } catch (e) {
        console.log(e);
      }
    }
    return false;
  }, [chain, walletClient, switchChainAsync]);

  return switchIfNeeded;
};
