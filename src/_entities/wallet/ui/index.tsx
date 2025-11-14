import { TAddress } from "@shared/lib/web3";
import { AddressIcon } from "@shared/ui/AddressIcon";

type TProps = {
  wallet: TAddress;
};
export const WalletCard = ({ wallet }: TProps) => {
  const shortAddress = `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  
  return (
    <div className="flex gap-2 items-center px-2 sm:px-3 py-1.5 rounded-2xl text-xs sm:text-sm bg-blue-50 border border-blue-800">
      <AddressIcon size="small" address={wallet} />
      <span className="hidden sm:inline">{wallet}</span>
      <span className="inline sm:hidden">{shortAddress}</span>
    </div>
  );
};
