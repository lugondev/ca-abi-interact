import useSWRImmutable from "swr/immutable";
import { TChain } from "./types";
import DefaultChainsRaw from "./defaultChains.json";

const Endpoint = "https://chainid.network/chains.json";

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
const PRIORITY_CHAIN_IDS = [1, 10, 56, 137, 8453, 42161, 43114, 84532];

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

const fetcher = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint);
    const data = (await response.json()) as any[];

    const filtered = data
      .filter(
        (item) =>
          item.rpc &&
          item.rpc.length > 0 &&
          item.explorers &&
          item.explorers.length > 0
      )
      .map(rawToTChain);

    return sortChainsByPriority(filtered);
  } catch (e) {
    console.log(e);
    return sortChainsByPriority(DefaultChains);
  }
};

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
  const response = useSWRImmutable(Endpoint, fetcher);

  if (response.isLoading) {
    return {
      loading: true,
      chains: null,
    };
  }

  if (!response.data) {
    return { loading: false, chains: DefaultChains };
  }

  return { loading: false, chains: response.data };
};

export const useChainListSafe = () => {
  const response = useChainList();

  if (!response.chains) {
    throw new Error("Unexpected missing chains");
  }

  return response.chains;
};

