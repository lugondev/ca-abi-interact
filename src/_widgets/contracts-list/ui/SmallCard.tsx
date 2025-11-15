import { ReactNode } from "react";
import { AddressValue } from "@shared/ui/AddressValue";
import { TContract } from "@entities/contract";
import { chainModel } from "@entities/chain";

type TProps = {
  contract: TContract;
  extra?: ReactNode;
};

export const SmallCard = ({ contract, extra }: TProps) => {
  const { getAddressUrl } = chainModel.useChainExplorer(contract.chain);
  const explorerUrl = getAddressUrl(contract.address);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-start gap-2">
        <p className="text-sm font-medium overflow-hidden text-ellipsis flex-1 leading-tight">
          {contract.name}
        </p>
        {extra && <div className="flex-shrink-0">{extra}</div>}
      </div>
      <AddressValue value={contract.address} explorerUrl={explorerUrl} />
    </div>
  );
};
