import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TChain } from "./types";

type State = {
  customChains: TChain[];
  chainRpcOverrides: Record<number, string[]>; // chainId -> custom RPCs
};

type Actions = {
  addCustomChain: (chain: TChain) => void;
  removeCustomChain: (chainId: number) => void;
  updateChainRpc: (chainId: number, rpc: string[]) => void;
  resetChainRpc: (chainId: number) => void;
};

const useCustomChainsStore = create<State & Actions>()(
  persist(
    (set) => ({
      customChains: [],
      chainRpcOverrides: {},
      
      addCustomChain: (chain: TChain) =>
        set((state) => ({
          customChains: [...state.customChains.filter((c) => c.chainId !== chain.chainId), chain],
        })),
      
      removeCustomChain: (chainId: number) =>
        set((state) => ({
          customChains: state.customChains.filter((c) => c.chainId !== chainId),
          chainRpcOverrides: Object.fromEntries(
            Object.entries(state.chainRpcOverrides).filter(([id]) => Number(id) !== chainId)
          ),
        })),
      
      updateChainRpc: (chainId: number, rpc: string[]) =>
        set((state) => ({
          chainRpcOverrides: {
            ...state.chainRpcOverrides,
            [chainId]: rpc,
          },
        })),
      
      resetChainRpc: (chainId: number) =>
        set((state) => {
          const newOverrides = { ...state.chainRpcOverrides };
          delete newOverrides[chainId];
          return { chainRpcOverrides: newOverrides };
        }),
    }),
    { name: "custom-chains" }
  )
);

export const useCustomChains = () => useCustomChainsStore((state) => state);

