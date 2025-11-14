import { Routes } from "@shared/config/routes";
import { Navigation } from "./Navigation";
import { SetCurrentChain } from "@features/set-current-chain";
import { WalletCard, walletModel } from "@entities/wallet";
import { ConnectButton } from "@features/connect-wallet";
import { Separator } from "@/components/ui/separator";

const WalletBlock = () => {
  const { address } = walletModel.useCurrentWallet();

  if (address) {
    return <WalletCard wallet={address} />;
  }

  return <ConnectButton />;
};

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between gap-4 px-4">
          <Navigation pages={Routes} />
          <div className="flex items-center gap-4 ml-auto">
            <WalletBlock />
            <Separator orientation="vertical" className="h-6" />
            <div className="min-w-[200px]">
              <SetCurrentChain />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
