import { useConnect } from "wagmi";
import { metaMask } from "wagmi/connectors";

export const useConnectWallet = () => {
  const { connect, connectors } = useConnect();

  const connectWallet = () => {
    const connector = connectors.find((c) => c.id === "metaMask") || metaMask();
    connect({ connector });
  };

  return connectWallet;
};
