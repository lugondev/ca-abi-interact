import { useMemo, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { AlchemyKey } from "@shared/lib/env";
import { TWithChildren } from "@shared/lib//props";
import { useChainConfig } from "../model";
import { useWagmiChain } from "../model/useWagmiChain";
import { TChainId } from "@shared/lib/web3";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type TProps = TWithChildren & {
  chain: TChainId;
};

export const Web3Provider = ({ chain, children }: TProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const chainConfig = useChainConfig(chain);

  const wagmiChain = useWagmiChain(chainConfig);

  const wagmiConfig = useMemo(() => {
    const alchemyUrl = `https://${wagmiChain.network || wagmiChain.name.toLowerCase()}.g.alchemy.com/v2/${AlchemyKey}`;
    
    return createConfig({
      chains: [wagmiChain] as const,
      connectors: [metaMask()],
      transports: {
        [wagmiChain.id]: http(AlchemyKey ? alchemyUrl : undefined),
      },
    });
  }, [wagmiChain]);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  );
};

