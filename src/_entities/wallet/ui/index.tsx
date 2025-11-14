import { TAddress } from "@shared/lib/web3";
import { AddressIcon } from "@shared/ui/AddressIcon";

type TProps = {
  wallet: TAddress;
};
export const WalletCard = ({ wallet }: TProps) => {
  return (
    <div className="flex gap-2 items-center px-2 py-1 rounded-2xl text-sm bg-blue-50 border border-blue-800">
      <AddressIcon size="small" address={wallet} />
      <span>{wallet}</span>
    </div>
  );
};
