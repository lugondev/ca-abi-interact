import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { TContract, TAbiFunction } from "@entities/contract";
import { ParamValue } from "@entities/contract";
import { chainModel } from "@entities/chain";
import { useContractCall } from "../model";
import { RefreshCw } from "lucide-react";

type TProps = {
  contract: TContract;
  abiItem: TAbiFunction;
};

export const PropertyCall = ({ contract, abiItem }: TProps) => {
  const { data, error, loading, refetch } = useContractCall(
    contract,
    abiItem,
    []
  );
  const { getAddressUrl } = chainModel.useChainExplorer(contract.chain);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const outputType = abiItem.outputs[0].type;
  const explorerUrl = outputType === "address" ? getAddressUrl(data as any) : undefined;

  return (
    <div className="flex items-start gap-2 w-full min-w-0">
      <Button onClick={() => refetch()} variant="outline" size="sm" className="flex-shrink-0 h-7 w-7 p-0">
        <RefreshCw className="h-3 w-3" />
      </Button>
      <div className="flex-1 min-w-0">
        <ParamValue 
          value={data} 
          abiType={outputType} 
          chain={contract.chain} 
          shorten={false}
          explorerUrl={explorerUrl}
        />
      </div>
    </div>
  );
};
