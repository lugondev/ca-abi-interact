import { Button } from "@/components/ui/button";
import { useConnectWallet } from "./model";

export const ConnectButton = () => {
  const connect = useConnectWallet();

  return (
    <Button onClick={() => connect()} size="default" variant="default">
      Connect wallet
    </Button>
  );
};
