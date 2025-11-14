import { TChain } from "./types";
import DefaultChainsRaw from "./defaultChains.json";

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
  // Always use local defaultChains.json instead of fetching from external API
  // This ensures we only show the curated list of 10 popular chains
  return { loading: false, chains: sortChainsByPriority(DefaultChains) };
};

export const useChainListSafe = () => {
  const response = useChainList();

  if (!response.chains) {
    throw new Error("Unexpected missing chains");
  }

  return response.chains;
};

