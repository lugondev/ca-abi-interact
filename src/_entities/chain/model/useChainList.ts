import { TChain } from "./types";
import DefaultChainsRaw from "./defaultChains.json";
import { useCustomChains } from "./useCustomChains";
import { useMemo } from "react";

const rawToTChain = (item: any): TChain => {
  return {
    chain: item.chain,
    chainId: item.chainId,
    explorers: item.explorers,
    name: item.name,
    rpc: item.rpc,
    nativeCurrency: item.nativeCurrency,
  };
};

const DefaultChains = DefaultChainsRaw.map(rawToTChain);

// Popular chains to prioritize at the top
const PRIORITY_CHAIN_IDS = [1, 10, 56, 137, 8453, 42161, 43114, 11155111, 421614, 84532];

const sortChainsByPriority = (chains: TChain[]): TChain[] => {
  return chains.sort((a, b) => {
    const aIndex = PRIORITY_CHAIN_IDS.indexOf(a.chainId);
    const bIndex = PRIORITY_CHAIN_IDS.indexOf(b.chainId);
    
    // Both are priority chains
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // Only a is priority
    if (aIndex !== -1) return -1;
    
    // Only b is priority
    if (bIndex !== -1) return 1;
    
    // Neither are priority, sort by chainId
    return a.chainId - b.chainId;
  });
};

// Removed fetcher function as we now only use local chains

type TChainListContext =
  | {
      loading: true;
      chains: null;
    }
  | {
      loading: false;
      chains: TChain[];
    };

export const useChainList = (): TChainListContext => {
  const { customChains, chainRpcOverrides } = useCustomChains();
  
  const allChains = useMemo(() => {
    // Merge default chains with custom chains
    const chainMap = new Map<number, TChain>();
    
    // Add default chains
    DefaultChains.forEach((chain) => {
      chainMap.set(chain.chainId, chain);
    });
    
    // Add/override with custom chains
    customChains.forEach((chain) => {
      chainMap.set(chain.chainId, chain);
    });
    
    // Apply RPC overrides to existing chains
    Object.entries(chainRpcOverrides).forEach(([chainIdStr, rpc]) => {
      const chainId = Number(chainIdStr);
      const chain = chainMap.get(chainId);
      if (chain) {
        chainMap.set(chainId, {
          ...chain,
          rpc,
        });
      }
    });
    
    return Array.from(chainMap.values());
  }, [customChains, chainRpcOverrides]);
  
  return { loading: false, chains: sortChainsByPriority(allChains) };
};

export const useChainListSafe = () => {
  const response = useChainList();

  if (!response.chains) {
    throw new Error("Unexpected missing chains");
  }

  return response.chains;
};

