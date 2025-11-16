"use client";

import { useMemo, useState, useEffect } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { AlchemyKey } from "@shared/lib/env";
import { TWithChildren } from "@shared/lib//props";
import { useChainConfig } from "../model";
import { useWagmiChain } from "../model/useWagmiChain";
import { TChainId } from "@shared/lib/web3";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoadingScreen } from "@widgets/loading-screen";

type TProps = TWithChildren & {
  chain: TChainId;
};

export const Web3Provider = ({ chain, children }: TProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const chainConfig = useChainConfig(chain);

  const wagmiChain = useWagmiChain(chainConfig);

  // Check if we're on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
    setIsLoading(false);
  }, []);

  const wagmiConfig = useMemo(() => {
    // Use the first RPC from the chain definition (which includes custom RPCs)
    const rpcUrl = wagmiChain.rpcUrls.default.http[0] || 
                   (AlchemyKey ? `https://${wagmiChain.network || wagmiChain.name.toLowerCase()}.g.alchemy.com/v2/${AlchemyKey}` : undefined);
    
    // Create MetaMask connector using injected with target
    const metaMaskConnector = injected({ target: 'metaMask' });
    
    return createConfig({
      chains: [wagmiChain] as const,
      connectors: isClient ? [metaMaskConnector] : [],
      transports: {
        [wagmiChain.id]: http(rpcUrl),
      },
    });
  }, [wagmiChain, isClient]);

  // Show loading state while MetaMask connector is being loaded
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  );
};

