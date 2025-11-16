import { useMemo } from "react";
import { defineChain } from "viem";
import { TChain } from "./types";
import { getAlchemyUrl } from "../lib/alchemy";

export const useWagmiChain = (chainConfig: TChain) => {
  const rpcUrls = useMemo(() => {
    // Filter out RPCs with template variables and empty strings
    const validRpcUrls = chainConfig.rpc.filter(
      (item) => item.trim() !== "" && !item.includes("${")
    );
    
    // If no valid RPCs, use the first one anyway (might be a custom RPC)
    return validRpcUrls.length > 0 ? validRpcUrls : chainConfig.rpc;
  }, [chainConfig.rpc]);

  const defaultRpc = useMemo(() => {
    return rpcUrls[0] || "";
  }, [rpcUrls]);

  const alchemyRpcUrl = getAlchemyUrl(chainConfig.chainId);

  return useMemo(() => {
    return defineChain({
      id: chainConfig.chainId,
      name: chainConfig.name,
      rpcUrls: {
        default: { http: rpcUrls },
        public: { http: rpcUrls },
        alchemy: { http: alchemyRpcUrl ? [alchemyRpcUrl] : [] },
      },
      blockExplorers: chainConfig.explorers.length > 0
        ? {
            default: {
              name: chainConfig.explorers[0].name,
              url: chainConfig.explorers[0].url,
            },
          }
        : undefined,
      nativeCurrency: chainConfig.nativeCurrency,
      network: String(chainConfig.chainId),
    });
  }, [chainConfig, rpcUrls, defaultRpc, alchemyRpcUrl]);
};

